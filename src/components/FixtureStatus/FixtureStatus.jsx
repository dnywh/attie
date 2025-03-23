import { styled, keyframes } from "@pigment-css/react";

const RegularStatus = styled("p")({});

const blink = keyframes({
  from: {
    scale: "100%",
  },
  to: {
    scale: "60%",
  },
});

const LiveStatus = styled(RegularStatus)(({ theme }) => ({
  color: theme.colors.text.live,
  display: "flex",
  alignItems: "center",
  gap: "0.35rem",
  "&::before": {
    content: "''",
    width: "0.5rem",
    height: "0.5rem",
    backgroundColor: theme.colors.text.live,
    borderRadius: "50%",
    display: "inline-block",
    animation: `${blink} 1s infinite alternate`,
  },
}));

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
