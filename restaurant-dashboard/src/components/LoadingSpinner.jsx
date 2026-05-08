export default function LoadingSpinner({
  label = "Loading your restaurant workspace...",
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="rounded-[2rem] border border-white/10 bg-[#141820]/90 px-10 py-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-white/15 border-t-orange-500" />
        <p className="mt-5 text-sm font-medium tracking-[0.12em] text-slate-300 uppercase">
          {label}
        </p>
      </div>
    </div>
  );
}
