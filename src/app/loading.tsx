export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Loading...
        </span>
      </div>
    </div>
  );
}
