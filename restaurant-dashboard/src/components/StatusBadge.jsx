const toneMap = {
  pending: "bg-amber-500/15 text-amber-200 border-amber-400/25",
  accepted: "bg-emerald-500/15 text-emerald-200 border-emerald-400/25",
  cooking: "bg-orange-500/15 text-orange-200 border-orange-400/25",
  on_the_way: "bg-sky-500/15 text-sky-200 border-sky-400/25",
  delivered: "bg-violet-500/15 text-violet-200 border-violet-400/25",
  cancelled: "bg-rose-500/15 text-rose-200 border-rose-400/25",
};

export default function StatusBadge({ status }) {
  const label = String(status || "pending").replaceAll("_", " ");
  const tone = toneMap[status] || "bg-slate-500/15 text-slate-200 border-slate-400/20";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${tone}`}>
      {label}
    </span>
  );
}
