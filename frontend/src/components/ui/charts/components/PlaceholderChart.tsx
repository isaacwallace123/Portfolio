export default function PlaceholderChart({
  label = 'No data',
  height = 260,
}: {
  label?: string;
  height?: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 p-6">
      <div
        className="rounded-lg border border-dashed border-white/10 bg-black/10 grid place-items-center"
        style={{ height }}
      >
        <p className="text-sm text-muted">{label}</p>
      </div>
    </div>
  );
}
