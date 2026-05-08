import StatusBadge from "./StatusBadge";
import { formatCurrency } from "../utils/api";

const nextActions = {
  pending: { label: "Accept order", status: "accepted", tone: "from-emerald-500 to-emerald-600" },
  accepted: { label: "Start cooking", status: "cooking", tone: "from-orange-500 to-orange-600" },
  cooking: { label: "Ready for delivery", status: "on_the_way", tone: "from-sky-500 to-sky-600" },
  on_the_way: { label: "Mark delivered", status: "delivered", tone: "from-violet-500 to-violet-600" },
};

export default function OrderCard({ order, onStatusChange, busy = false }) {
  const items = order.items_detail || [];
  const action = nextActions[order.status];

  return (
    <article className="rounded-[2rem] border border-white/10 bg-[#131821]/95 p-6 shadow-[0_22px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-2xl font-black text-white">Order #{order.id}</h3>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Customer: <span className="font-semibold text-slate-200">{order.customer_name || "Walk-in guest"}</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Contact: <span className="font-semibold text-slate-200">{order.contact_phone || "Not shared"}</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Address: <span className="font-semibold text-slate-200">{order.delivery_address || "Pickup / not added"}</span>
          </p>
        </div>

        <div className="rounded-3xl border border-orange-400/20 bg-orange-500/10 px-5 py-4 text-left">
          <p className="text-xs uppercase tracking-[0.25em] text-orange-200">Order value</p>
          <p className="mt-2 text-3xl font-black text-white">{formatCurrency(order.total)}</p>
          <p className="mt-1 text-xs text-slate-400">
            {items.length} item{items.length === 1 ? "" : "s"} in queue
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {items.length ? (
          items.map((item, index) => (
            <div
              key={`${order.id}-${item.food_name}-${index}`}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{item.food_name}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-orange-200">
                  {formatCurrency(item.price)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-6 text-sm text-slate-400 md:col-span-2">
            Order item details are not available for this ticket.
          </div>
        )}
      </div>

      {order.notes && (
        <div className="mt-5 rounded-2xl border border-white/8 bg-black/20 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Kitchen note</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">{order.notes}</p>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {action ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onStatusChange(order.id, action.status)}
            className={`rounded-2xl bg-gradient-to-r ${action.tone} px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(0,0,0,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60`}
          >
            {busy ? "Updating..." : action.label}
          </button>
        ) : (
          <span className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
            No further action available
          </span>
        )}
      </div>
    </article>
  );
}
