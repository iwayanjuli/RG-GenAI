# Integrasi Supabase

`setup.sql` memasang skema, RLS, fungsi penyimpanan atomik, dan seluruh data awal dari `src/data/mockData.ts`. Jalankan isinya melalui **SQL Editor** pada proyek Supabase yang URL-nya ada di `.env`.

Data awal: 9 bidang riset, 6 anggota, 5 proyek, 6 publikasi, 6 mitra, 2 contoh pesan, 4 fase roadmap, beserta tim proyek, galeri, dan penulis publikasi. Profil institusi dan teks halaman di `siteConfig.ts` tetap merupakan konfigurasi kode karena belum memiliki modul pengelolaan di panel admin.

## Akun administrator

1. Buat akun melalui **Authentication > Users > Add user** di Supabase.
2. Salin UUID akun tersebut, kemudian jalankan SQL berikut dengan nilai akun sebenarnya:

```sql
INSERT INTO public.users (id, full_name, email, role)
VALUES ('UUID_DARI_AUTH_USERS', 'Nama Administrator', 'email-admin@example.com', 'Super Admin');
```

Gunakan email dan password akun Auth untuk masuk melalui `/admin/login`. UUID profil wajib sama dengan UUID Supabase Auth. Peran dibaca dari tabel `users`, bukan metadata yang dapat diubah pengguna. Untuk menambah Admin atau Editor, ulangi langkah di atas dengan peran yang sesuai. Tidak ada akun/password admin bawaan.

## Perilaku aplikasi

- Saat Supabase terkonfigurasi, data panel admin dan halaman publik dibaca dari database. Kegagalan database tidak disimpan sebagai perubahan lokal.
- Super Admin dan Admin dapat menghapus konten; Editor dapat menambah dan mengedit. Hanya Super Admin dapat mengelola profil administrator melalui database/API.
- Pesan kontak dapat dikirim oleh pengunjung; kotak masuk hanya dapat dibaca akun dengan profil administrator.
- Anggota dan mitra nonaktif hanya terlihat oleh administrator.
- Penulis publikasi serta tim dan galeri proyek memakai tabel relasi. Fungsi RPC menyimpan induk dan relasi dalam satu transaksi.
- Tanpa konfigurasi Supabase, mode demo menggunakan LocalStorage.

## Memperbarui SQL data awal

```sh
node scripts/generate-supabase.cjs
```

Generator memperbarui `schema.sql`, `seed.sql`, dan gabungannya `setup.sql`. Pemasangan ulang mempertahankan baris data yang sudah ada (`ON CONFLICT DO NOTHING`); tidak menimpa perubahan admin. `schema.sql` memperbarui kebijakan akses pada tabel aplikasi, sehingga tinjau kebijakan khusus sebelum memasangnya pada database yang telah dikustomisasi.

`.env` hanya memerlukan URL dan anon/publishable key. Jangan memasukkan service-role key atau password database ke variabel `VITE_*`.
