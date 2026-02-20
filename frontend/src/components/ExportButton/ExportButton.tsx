'use client';

import { useState, useEffect } from 'react';
import { FileText, Braces } from 'lucide-react';
import { componentTokens } from '@/lib/design-tokens';
import { track } from '@/lib/tracker';
import { downloadCSV, downloadJSON } from '@/lib/export';
import type { ExportFilters } from '@/lib/export';

export interface ExportButtonProps {
  /** JWT token required for authenticated export endpoints */
  token?: string;
  /** Optional filters to apply to both exports */
  filters?: ExportFilters;
  projectId?: string;
  trackingName?: string;
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-testid="export-spinner"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function ExportButton({
  token = '',
  filters = {},
  projectId,
  trackingName = 'ExportButton',
}: ExportButtonProps) {
  const [csvLoading, setCsvLoading] = useState(false);
  const [jsonLoading, setJsonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = componentTokens.button;
  const busy = csvLoading || jsonLoading;

  useEffect(() => {
    track({ componentName: trackingName, action: 'mount', projectId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCSV() {
    setError(null);
    setCsvLoading(true);
    track({ componentName: trackingName, variant: 'csv', action: 'click', projectId });
    try {
      await downloadCSV(token, filters);
    } catch {
      setError('No se pudo exportar el CSV. Verifica que estés autenticado.');
    } finally {
      setCsvLoading(false);
    }
  }

  async function handleJSON() {
    setError(null);
    setJsonLoading(true);
    track({ componentName: trackingName, variant: 'json', action: 'click', projectId });
    try {
      await downloadJSON(token, filters);
    } catch {
      setError('No se pudo exportar el JSON. Verifica que estés autenticado.');
    } finally {
      setJsonLoading(false);
    }
  }

  const btnBase = [t.base, t.variants.secondary, t.sizes.md].join(' ');
  const loadingCls = t.loading;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCSV}
          disabled={busy}
          aria-busy={csvLoading}
          data-testid="export-csv-btn"
          className={[btnBase, csvLoading ? loadingCls : ''].filter(Boolean).join(' ')}
        >
          {csvLoading ? <Spinner /> : <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />}
          <span>Exportar CSV</span>
        </button>

        <button
          onClick={handleJSON}
          disabled={busy}
          aria-busy={jsonLoading}
          data-testid="export-json-btn"
          className={[btnBase, jsonLoading ? loadingCls : ''].filter(Boolean).join(' ')}
        >
          {jsonLoading ? <Spinner /> : <Braces className="w-4 h-4 shrink-0" aria-hidden="true" />}
          <span>Exportar JSON</span>
        </button>
      </div>

      {error && (
        <p
          className="text-xs text-red-600"
          role="alert"
          data-testid="export-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}
