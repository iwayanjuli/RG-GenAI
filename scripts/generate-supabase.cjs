const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const schema = fs.readFileSync('supabase/schema.sql', 'utf8');
const catalog = {};
for (const match of schema.matchAll(/CREATE TABLE IF NOT EXISTS (\w+) \(([\s\S]*?)\n\);/g)) {
  catalog[match[1]] = [...match[2].matchAll(/^    (\w+) /gm)].map(m => m[1]);
}
const tables = Object.keys(catalog);
let sql = schema.startsWith('BEGIN;')
  ? schema.slice('BEGIN;\n'.length, schema.indexOf('-- Roles are maintained'))
  : schema.slice(0, schema.indexOf('-- ROW LEVEL SECURITY')) + '\n' + schema.slice(schema.indexOf('-- 11. ROADMAP PHASES'), schema.indexOf('ALTER TABLE roadmap_phases'));
sql = 'BEGIN;\n' + sql;
sql += `
-- Roles are maintained by trusted database operators, never user metadata.
CREATE OR REPLACE FUNCTION public.current_admin_role() RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT role::text FROM public.users WHERE id = auth.uid() $$;
REVOKE ALL ON FUNCTION public.current_admin_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_admin_role() TO anon, authenticated;
`;
for (const table of tables) {
  sql += `
ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;
DO $$ DECLARE p record; BEGIN
  FOR p IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='${table}' LOOP
    EXECUTE format('DROP POLICY %I ON public.${table}', p.policyname);
  END LOOP;
END $$;
REVOKE ALL ON public.${table} FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.${table} TO authenticated;
`;
  if (table === 'users') {
    sql += `CREATE POLICY profile_read ON public.users FOR SELECT TO authenticated USING (id=auth.uid() OR public.current_admin_role()='Super Admin');
CREATE POLICY profile_insert ON public.users FOR INSERT TO authenticated WITH CHECK (public.current_admin_role()='Super Admin');
CREATE POLICY profile_update ON public.users FOR UPDATE TO authenticated USING (public.current_admin_role()='Super Admin') WITH CHECK (public.current_admin_role()='Super Admin');
CREATE POLICY profile_delete ON public.users FOR DELETE TO authenticated USING (public.current_admin_role()='Super Admin');
`;
    continue;
  }
  const roles = "('Super Admin','Admin','Editor')";
  if (table !== 'contact_messages') {
    sql += `GRANT SELECT ON public.${table} TO anon;
CREATE POLICY catalog_read ON public.${table} FOR SELECT TO anon, authenticated USING (${['members','partners'].includes(table) ? "is_active OR public.current_admin_role() IN ('Super Admin','Admin','Editor')" : 'true'});
`;
  } else {
    sql += `GRANT INSERT ON public.contact_messages TO anon;
CREATE POLICY messages_read ON public.contact_messages FOR SELECT TO authenticated USING (public.current_admin_role() IN ${roles});
CREATE POLICY messages_submit ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (status='Unread');
`;
  }
  if (table !== 'contact_messages') sql += `CREATE POLICY content_insert ON public.${table} FOR INSERT TO authenticated WITH CHECK (public.current_admin_role() IN ${roles});\n`;
  sql += `CREATE POLICY content_update ON public.${table} FOR UPDATE TO authenticated USING (public.current_admin_role() IN ${roles}) WITH CHECK (public.current_admin_role() IN ${roles});
CREATE POLICY content_delete ON public.${table} FOR DELETE TO authenticated USING (public.current_admin_role() IN ${['project_members','project_gallery','publication_authors'].includes(table) ? roles : "('Super Admin','Admin')"});
`;
}
for (const table of ['projects','publications']) {
  const cols=catalog[table].filter(c=>!['created_at','updated_at'].includes(c));
  let relations = table==='publications' ? `
  IF payload ? 'authors' THEN
    DELETE FROM public.publication_authors WHERE publication_id=entity_id;
    INSERT INTO public.publication_authors(publication_id,external_author_name,author_order)
    SELECT entity_id, value, ordinality::int FROM jsonb_array_elements_text(payload->'authors') WITH ORDINALITY;
  END IF;` : `
  IF payload ? 'gallery' THEN
    DELETE FROM public.project_gallery WHERE project_id=entity_id;
    INSERT INTO public.project_gallery(project_id,image_url,caption,display_order)
    SELECT entity_id, value->>'image_url', value->>'caption', ordinality::int FROM jsonb_array_elements(payload->'gallery') WITH ORDINALITY;
  END IF;
  IF payload ? 'team_members' THEN
    DELETE FROM public.project_members WHERE project_id=entity_id;
    INSERT INTO public.project_members(project_id,member_id,role)
    SELECT entity_id, (value->>'id')::uuid, value->>'role' FROM jsonb_array_elements(payload->'team_members');
  END IF;`;
  sql += `
-- Invoker security keeps table RLS active; parent and children save atomically.
CREATE OR REPLACE FUNCTION public.save_${table}(payload jsonb) RETURNS uuid
LANGUAGE plpgsql SECURITY INVOKER SET search_path=public AS $$
DECLARE entity_id uuid; current_row jsonb; merged jsonb;
BEGIN
  IF public.current_admin_role() IS NULL THEN RAISE EXCEPTION 'Administrator profile required'; END IF;
  entity_id := COALESCE(NULLIF(payload->>'id','')::uuid, gen_random_uuid());
  SELECT to_jsonb(t) INTO current_row FROM public.${table} t WHERE id=entity_id FOR UPDATE;
  merged := COALESCE(current_row, '{}'::jsonb) || payload || jsonb_build_object('id',entity_id);
  merged := merged || jsonb_build_object('research_area_id',NULLIF(merged->>'research_area_id',''));
  ${table==='projects' ? "merged := merged || jsonb_build_object('project_leader_id',NULLIF(merged->>'project_leader_id',''));" : ''}
  INSERT INTO public.${table} (${cols.join(',')})
  SELECT ${cols.join(',')} FROM jsonb_populate_record(NULL::public.${table}, merged)
  ON CONFLICT (id) DO UPDATE SET ${cols.filter(c=>c!=='id').map(c=>`${c}=EXCLUDED.${c}`).join(',')}, updated_at=NOW();
  ${relations}
  RETURN entity_id;
END $$;
REVOKE ALL ON FUNCTION public.save_${table}(jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_${table}(jsonb) TO authenticated;
`;
}
sql += "NOTIFY pgrst, 'reload schema';\nCOMMIT;\n";
sql = sql.replace(/[ \t]+$/gm, '');
fs.writeFileSync('supabase/schema.sql', sql);
const moduleObject={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/mockData.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports:moduleObject.exports});
const data=moduleObject.exports;
const groups=[['research_areas','initialResearchAreas','b'],['members','initialMembers','c'],['projects','initialProjects','d'],['publications','initialPublications','e'],['partners','initialPartners','f'],['contact_messages','initialMessages','1'],['roadmap_phases','initialRoadmap','2']];
const ids={};
const uuid=(prefix,index)=>`${prefix}0000000-0000-0000-0000-${String(index).padStart(12,'0')}`;
for(const [,key,prefix] of groups) data[key].forEach((r,i)=>ids[r.id]=uuid(prefix,i+1));
const literal=v=>v===undefined||v===null?'NULL':Array.isArray(v)?`ARRAY[${v.map(literal).join(',')}]::text[]`:typeof v==='string'?`'${v.replace(/'/g,"''")}'`:String(v);
let seed='-- Generated from src/data/mockData.ts. Existing rows are preserved.\nBEGIN;\n';
function insert(table,rows){for(const row of rows){const cols=Object.keys(row).filter(c=>catalog[table].includes(c));seed+=`INSERT INTO public.${table} (${cols.join(',')}) VALUES (${cols.map(c=>literal(row[c])).join(',')}) ON CONFLICT DO NOTHING;\n`;}}
for(const [table,key] of groups){insert(table,data[key].map(r=>({...r,id:ids[r.id],...(r.research_area_id?{research_area_id:ids[r.research_area_id]}:{}),...(r.project_leader_id?{project_leader_id:ids[r.project_leader_id]}:{})})));}
let galleryIndex=0,teamIndex=0,authorIndex=0;
for(const project of data.initialProjects){insert('project_gallery',(project.gallery||[]).map((g,i)=>({...g,id:uuid('3',++galleryIndex),project_id:ids[project.id],display_order:i+1})));insert('project_members',(project.team_members||[]).map(m=>({id:uuid('4',++teamIndex),project_id:ids[project.id],member_id:ids[m.id],role:m.role})));}
for(const pub of data.initialPublications)insert('publication_authors',pub.authors.map((name,i)=>({id:uuid('5',++authorIndex),publication_id:ids[pub.id],external_author_name:name,author_order:i+1})));
seed+='COMMIT;\n';fs.writeFileSync('supabase/seed.sql',seed);fs.writeFileSync('supabase/setup.sql',sql+'\n'+seed);
console.log('Generated complete seed:',groups.map(([t,k])=>`${t}=${data[k].length}`).join(', '));
