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
  // https://docs.football-data.org/general/v4/match.html#_status_workflow_explained
  // const status = "IN_PLAY";
  const status = fixture.status;
  // const formattedStatus = status;

  if (status === "IN_PLAY" || status === "PAUSED") {
    return (
      <LiveStatus>
        Live
        {fixture.minute && ` ${fixture.minute}’`}
        {fixture.injuryTime && `+ ${fixture.injuryTime}’`}
      </LiveStatus>
    );
  } else {
    return <RegularStatus>{status}</RegularStatus>;
  }
}

export default FixtureStatus;
