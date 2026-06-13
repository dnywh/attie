import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import type { CommonFixture, Direction } from "@/types/domain";

export const isLiveFixture = (
  fixture: Pick<CommonFixture, "status">
): boolean => fixture.status.type === FIXTURE_STATUS.LIVE;

export const isFixtureVisibleForDirection = (
  fixture: Pick<CommonFixture, "status" | "utcDate">,
  direction: Direction,
  now = new Date()
): boolean => {
  if (isLiveFixture(fixture)) {
    return true;
  }

  const fixtureDate = new Date(fixture.utcDate);

  return direction === "forwards" ? fixtureDate >= now : fixtureDate <= now;
};
