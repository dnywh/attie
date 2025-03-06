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

const LiveStatus = styled(RegularStatus)({
  color: "red",
  display: "flex",
  gap: "0.1rem",
  alignItems: "center",
  "&::after": {
    content: "'•'",
    fontSize: "2rem",
    lineHeight: "100%",
    display: "inline-block",
    animation: `${blink} 1s infinite alternate`,
  },
});

function FixtureStatus({ fixture }) {
  // https://docs.football-data.org/general/v4/match.html#_status_workflow_explained
  const status = "IN_PLAY";
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
