import { Publication } from '../types';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDateIndo(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function generateAPACitation(pub: Publication): string {
  const authorsStr = pub.authors.join(', ');
  const yearStr = `(${pub.publication_year})`;
  const titleStr = `${pub.title}.`;
  const venueStr = `${pub.journal_or_conference}.`;
  const doiStr = pub.doi ? ` https://doi.org/${pub.doi}` : '';
  return `${authorsStr} ${yearStr}. ${titleStr} ${venueStr}${doiStr}`;
}

export function generateIEEECitation(pub: Publication): string {
  const authorsStr = pub.authors.join(', ');
  const titleStr = `"${pub.title},"`;
  const venueStr = `${pub.journal_or_conference},`;
  const yearStr = `pp. ${pub.pages || '1-10'}, ${pub.publication_year}.`;
  const doiStr = pub.doi ? ` doi: ${pub.doi}.` : '';
  return `${authorsStr}, ${titleStr} ${venueStr} ${yearStr}${doiStr}`;
}

export function downloadBibTeX(filename: string, content: string): void {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
  element.href = URL.createObjectURL(file);
  element.download = `${filename}.bib`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
