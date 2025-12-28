import { Search, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  onRefresh?: () => void;
  onClearFilters?: () => void;
}

export function EmptyState({
  title = "No Quests Found",
  message = "Try adjusting your filters or check back later for new opportunities",
  onRefresh,
  onClearFilters,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="w-24 h-24 bg-[var(--campus-border)] rounded-full flex items-center justify-center mb-6 opacity-50">
        <Search className="w-12 h-12 text-[var(--campus-text-secondary)]" />
      </div>

      {/* Title */}
      <h3 className="text-[var(--campus-text-primary)] mb-2">{title}</h3>

      {/* Message */}
      <p className="text-[var(--campus-text-secondary)] mb-6 max-w-md">{message}</p>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-6 py-2 bg-[#2D7FF9] text-white rounded-lg hover:bg-[#2D7FF9]/80 transition-colors"
          >
            Clear Filters
          </button>
        )}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="px-6 py-2 bg-[var(--campus-border)] text-[var(--campus-text-primary)] rounded-lg hover:bg-[var(--campus-border)]/80 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        )}
      </div>
    </div>
  );
}
