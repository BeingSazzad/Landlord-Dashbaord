export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-3 border-brand-200 border-t-brand-600" />
        <span className="text-xs font-semibold text-slate-400">Loading...</span>
      </div>
    </div>
  )
}

