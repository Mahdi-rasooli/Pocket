import type { ReactNode } from 'react';

// Fixed-height helper-text slot rendered under every field in a form grid — used
// whether or not a given field actually has helper text (see AmountPreview). Forms
// here use `items-end` grid alignment, which aligns each column to the row's
// bottom; a column that's only sometimes taller than its siblings (e.g. only the
// amount field growing a line of text) nudges its input out of line with the rest
// of the row. Reserving this slot everywhere keeps every column the same height
// by construction, and — being in normal flow, not absolutely positioned — it
// correctly pushes whatever comes after the form out of the way instead of
// floating over it.
export default function FieldHelper({ children }: { children?: ReactNode }) {
  return <p className="h-4 text-xs text-muted-foreground">{children}</p>;
}
