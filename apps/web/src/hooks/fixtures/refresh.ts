export const FIXTURE_REFRESH_INTERVAL_MS = 60_000;

export interface AutoRefreshState {
  hasRateLimitError: boolean;
  isDocumentHidden: boolean;
  lastSuccessfulRefreshAt: number;
  loading: boolean;
  loadingMore: boolean;
  now: number;
  refreshing: boolean;
}

export const shouldAutoRefreshFixtures = ({
  hasRateLimitError,
  isDocumentHidden,
  lastSuccessfulRefreshAt,
  loading,
  loadingMore,
  now,
  refreshing,
}: AutoRefreshState): boolean => {
  if (
    hasRateLimitError ||
    isDocumentHidden ||
    loading ||
    loadingMore ||
    refreshing
  ) {
    return false;
  }

  return now - lastSuccessfulRefreshAt >= FIXTURE_REFRESH_INTERVAL_MS;
};
