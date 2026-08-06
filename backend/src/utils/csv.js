// Minimal RFC4180-ish CSV helpers (no external dependency): quotes fields that
// contain a comma, quote, or newline; doubles embedded quotes.

function toCSV(rows, columns) {
  const escape = (val) => {
    if (val == null) return '';
    const str = String(val);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = rows.map((row) => columns.map((col) => escape(row[col])).join(','));
  return [columns.join(','), ...lines].join('\n');
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; } else inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      field = '';
      if (row.length > 1 || row[0] !== '') rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (rows.length === 0) return [];

  const header = rows[0];
  return rows.slice(1).map((r) => Object.fromEntries(header.map((h, idx) => [h, r[idx] ?? ''])));
}

module.exports = { toCSV, parseCSV };
