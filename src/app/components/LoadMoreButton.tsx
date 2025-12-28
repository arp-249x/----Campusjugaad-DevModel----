import { ChevronDown, Loader2 } from "lucide-react";

interface LoadMoreButtonProps {
  onLoadMore: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
}

export function LoadMoreButton({ onLoadMore, isLoading = false, hasMore = true }: LoadMoreButtonProps) {
  if (!hasMore) {
    return (
      <div className="text-center py-8">
        <p className="text-[var(--campus-text-secondary)] text-sm">
          You've reached the end. No more quests to load.
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-8">
      <button
        onClick={onLoadMore}
        disabled={isLoading}
        className="flex items-center gap-2 px-8 py-3 bg-[var(--campus-card-bg)] border border-[var(--campus-border)] rounded-xl hover:bg-[var(--campus-border)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 text-[var(--campus-text-secondary)] animate-spin" />
            <span className="text-[var(--campus-text-primary)]">Loading more quests...</span>
          </>
        ) : (
          <>
            <span className="text-[var(--campus-text-primary)]">Load More Quests</span>
            <ChevronDown className="w-5 h-5 text-[var(--campus-text-secondary)]" />
          </>
        )}
      </button>
    </div>
  );
}
