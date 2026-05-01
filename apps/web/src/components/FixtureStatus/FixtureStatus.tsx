import { styled, keyframes } from "next-yak";
import { FIXTURE_STATUS } from "@/constants/fixtureStatus";
import { webTheme } from "@/styles/theme.yak";
import type { CommonFixture } from "@/types/domain";

const RegularStatus = styled.p``;

const blink = keyframes`
  from {
    scale: 100%;
  }

  to {
    scale: 60%;
  }
`;

const LiveStatus = styled(RegularStatus)`
  align-items: center;
  color: ${webTheme.colors.text.live};
  display: flex;
  gap: 0.35rem;

  &::before {
    animation: ${blink} 1s infinite alternate;
    background-color: ${webTheme.colors.text.live};
    border-radius: 50%;
    content: "";
    display: inline-block;
    height: 0.5rem;
    width: 0.5rem;
  }
`;

function FixtureStatus({ fixture }: { fixture: CommonFixture }) {
  const { status } = fixture;

  if (status.type === FIXTURE_STATUS.LIVE) {
    return (
      <LiveStatus>
        Live
        {status.detail && `: ${status.detail}`}
      </LiveStatus>
    );
  }

  return <RegularStatus>{status.type}</RegularStatus>;
}

export default FixtureStatus;
