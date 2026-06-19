import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import { fixtureInstantMs } from "@/utils/fixtureTime";
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

  const statusType = fixture.status.type;
  const fixtureTime = fixtureInstantMs(fixture);
  const nowTime = now.getTime();

  if (statusType === FIXTURE_STATUS.SCHEDULED) {
    return direction === "forwards" && fixtureTime >= nowTime;
  }

  if (statusType === FIXTURE_STATUS.FINISHED) {
    return direction === "backwards" && fixtureTime <= nowTime;
  }

  return direction === "backwards" && fixtureTime <= nowTime;
};
