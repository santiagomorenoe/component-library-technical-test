export interface ExportFilters {
  from?: string;
  to?: string;
  componentName?: string;
  projectId?: string;
}

const BASE_URL =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : 'http://localhost:4000';

function buildQueryString(filters: ExportFilters): string {
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.componentName) params.set('componentName', filters.componentName);
  if (filters.projectId) params.set('projectId', filters.projectId);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function downloadCSV(token: string, filters: ExportFilters = {}): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/components/export${buildQueryString(filters)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`CSV export failed: ${res.status}`);
  const blob = await res.blob();
  triggerDownload(blob, 'component-tracking.csv');
}

export async function downloadJSON(token: string, filters: ExportFilters = {}): Promise<void> {
  const res = await fetch(
    `${BASE_URL}/api/components/export/json${buildQueryString(filters)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`JSON export failed: ${res.status}`);
  const blob = await res.blob();
  triggerDownload(blob, 'component-tracking.json');
}
