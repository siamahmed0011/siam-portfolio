export default function AdminLoading() {
  return (
    <div className="py-16 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Loading Admin Module...
        </span>
      </div>
    </div>
  );
}
