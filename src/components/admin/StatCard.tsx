export default function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-panel p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-faint">{label}</p>
      <p className="mt-2 font-display text-3xl text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-faint">{hint}</p> : null}
    </div>
  );
}
