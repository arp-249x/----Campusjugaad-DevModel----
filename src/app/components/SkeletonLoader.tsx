export function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-[var(--campus-card-bg)] rounded-2xl p-6 border border-[var(--campus-border)] animate-pulse"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="h-6 bg-[var(--campus-border)] rounded w-2/3"></div>
            <div className="h-6 bg-[var(--campus-border)] rounded w-16"></div>
          </div>

          {/* Description */}
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-[var(--campus-border)] rounded w-full"></div>
            <div className="h-4 bg-[var(--campus-border)] rounded w-4/5"></div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-4 bg-[var(--campus-border)] rounded w-24"></div>
            <div className="h-4 bg-[var(--campus-border)] rounded w-20"></div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--campus-border)]">
            <div className="flex items-center gap-3">
              <div className="h-5 bg-[var(--campus-border)] rounded w-16"></div>
              <div className="h-5 bg-[var(--campus-border)] rounded w-12"></div>
            </div>
            <div className="h-10 bg-[var(--campus-border)] rounded w-28"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
