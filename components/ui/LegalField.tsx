export function LegalField({ value }: { value: string }) {
  const todo = value.startsWith("[À COMPLÉTER");
  if (!todo) return <>{value}</>;
  return (
    <span className="rounded border border-dashed border-danger px-1.5 py-0.5 text-danger" title="Champ à compléter avant mise en ligne">
      {value}
    </span>
  );
}
