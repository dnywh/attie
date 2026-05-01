// @ts-nocheck
import { styled, keyframes } from "next-yak";
import { webTheme } from "@/styles/theme.yak";

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

function FixtureStatus({ fixture }) {
  // Unpack status
  const { status } = fixture;
  const statusType = typeof status === "string" ? status : status.type;
  // Handle both string status and status objects (for competitions with live fixture details, like "2nd Qtr")
  const statusDetail = typeof status === "object" ? status.detail : null;

  if (statusType === "LIVE") {
    return (
      <LiveStatus>
        Live
        {statusDetail && `: ${statusDetail}`}
      </LiveStatus>
    );
  } else {
    return <RegularStatus>{statusType}</RegularStatus>;
  }
}

export default FixtureStatus;
