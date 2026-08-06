'use client';

import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiFetch, apiFetchText } from '@/lib/api';
import { downloadCSV, readFileAsText } from '@/lib/csv';
import { useI18n } from '@/lib/i18n/i18n-context';

interface Props {
  exportUrl: string;
  importUrl: string;
  filename: string;
  onImported: () => Promise<void>;
}

interface ImportResult {
  imported: number;
  errors: { row: number; error: string }[];
}

// Export/import buttons shared by the income and expense sections on the
// transactions page. CSV columns match 1:1 with what exportCSV/importCSV expect.
export default function CsvActions({ exportUrl, importUrl, filename, onImported }: Props) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  async function handleExport() {
    const csv = await apiFetchText(exportUrl);
    downloadCSV(filename, csv);
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImporting(true);
    setResult(null);
    try {
      const csv = await readFileAsText(file);
      const res = await apiFetch<ImportResult>(importUrl, { method: 'POST', body: JSON.stringify({ csv }) });
      setResult(res);
      await onImported();
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button type="button" variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs text-muted-foreground" onClick={handleExport}>
        <Download size={13} /> {t('csv.export')}
      </Button>
      <Button
        type="button" variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs text-muted-foreground"
        disabled={importing}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={13} /> {importing ? t('csv.importing') : t('csv.import')}
      </Button>
      <input ref={fileInputRef} type="file" accept=".csv,text/csv" hidden onChange={handleFileChange} />
      {result && (
        <span className="text-xs text-muted-foreground">
          {t('csv.imported').replace('{n}', String(result.imported))}
          {result.errors.length > 0 && ` · ${t('csv.rowsSkipped').replace('{n}', String(result.errors.length))}`}
        </span>
      )}
    </div>
  );
}
