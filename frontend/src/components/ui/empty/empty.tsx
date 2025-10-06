type Props = { title: string; subtitle?: string; action?: React.ReactNode };

export default function Empty({ title, subtitle, action }: Props) {
  return (
    <div className="rounded-xl border border-white/10 p-8 text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
