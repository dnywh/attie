import { describe, expect, it } from "vitest";
import {
  FIXTURE_REFRESH_INTERVAL_MS,
  shouldAutoRefreshFixtures,
} from "./refresh";

const readyState = {
  hasRateLimitError: false,
  isDocumentHidden: false,
  lastSuccessfulRefreshAt: 1_000,
  loading: false,
  loadingMore: false,
  now: 1_000 + FIXTURE_REFRESH_INTERVAL_MS,
  refreshing: false,
};

describe("fixture refresh scheduling", () => {
  it("refreshes when the visible page has stale fixture data", () => {
    expect(shouldAutoRefreshFixtures(readyState)).toBe(true);
  });

  it("skips automatic refresh while hidden or in flight", () => {
    expect(
      shouldAutoRefreshFixtures({
        ...readyState,
        isDocumentHidden: true,
      })
    ).toBe(false);
    expect(
      shouldAutoRefreshFixtures({
        ...readyState,
        refreshing: true,
      })
    ).toBe(false);
  });

  it("skips automatic refresh before the interval has elapsed", () => {
    expect(
      shouldAutoRefreshFixtures({
        ...readyState,
        now: readyState.lastSuccessfulRefreshAt + FIXTURE_REFRESH_INTERVAL_MS - 1,
      })
    ).toBe(false);
  });
});
