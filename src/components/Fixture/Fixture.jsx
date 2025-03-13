import FixtureStatus from "@/components/FixtureStatus";
import OpponentRow from "@/components/OpponentRow";
import { styled } from "@pigment-css/react";
import { smallText } from "@/styles/commonStyles";

const FixtureRow = styled("li")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.65rem",
  padding: "0.65rem",
  backgroundColor: "#FEE272",
  border: `1px solid ${theme.colors.text.primary}`,
  boxShadow: `0 3px 0 0 ${theme.colors.text.primary}`,
  borderRadius: `3px`,
  // ...smallCardStyle({ theme }),
  // ...cardStyle({ theme }),
  // ...createCardStyle({ shadowSize: 40, borderRadius: 30 })({ theme }),

  // Border between each item
  "&:not(:last-of-type)": {
    position: "relative",
    // Blue and black goalposts
    "&::before": {
      content: '""',
      position: "absolute",
      top: "calc(100% + 3px + 1px)", // Match offset caused by boxShadow and border
      left: "0",
      height: "calc(1.5rem - 3px)", // Match gap in parent component, minus same offsets as above
      width: "100%",
      background:
        "linear-gradient(to right,  transparent 34px, black 0, black 36px, #AEF4F5 0, #AEF4F5 48px, black 0, black 54px, transparent 0, transparent calc(100% - 54px), black 0, black calc(100% - 48px), #AEF4F5 0, #AEF4F5 calc(100% - 36px), black 0, black calc(100% - 34px), transparent 0)",
    },
    // Shorter, black shadow on goalposts
    "&::after": {
      content: '""',
      position: "absolute",
      top: "calc(100% + 3px + 1px)", // Match offset caused by boxShadow and border
      left: "0",
      height: "calc(0.425rem - 1px)", // Match gap in parent component, minus same offsets as above
      width: "100%",
      background:
        "linear-gradient(to right, transparent 34px, black 0, black 54px, transparent 0, transparent calc(100% - 54px), black 0, black calc(100% - 48px), black calc(100% - 34px), transparent 0)",
    },
  },
}));

const FixtureTiming = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "1rem",

  "& p": {
    ...smallText,
    margin: "0",
    "&:first-of-type": {
      textAlign: "left",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    "&:last-of-type": {
      textAlign: "right",
    },
  },
});

const CompetitionName = styled("p")({
  ...smallText,
  textAlign: "center",
  margin: "0",
});

const OpponentsList = styled("ul")(({ theme }) => ({
  border: "1px solid black",
  borderRadius: "2px",
  backgroundColor: "white",
  boxShadow: "0.5px 1.5px 0 0 white",
}));

function Fixture({ fixture, showAllScores, useSoundEffects }) {
  const formattedDate = new Date(fixture.utcDate).toLocaleDateString(
    "default",
    {
      day: "numeric",
      month: "short",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
    }
  );

  return (
    <FixtureRow>
      <FixtureTiming>
        <p>{formattedDate}</p>
        <FixtureStatus fixture={fixture} />
      </FixtureTiming>

      <OpponentsList>
        <OpponentRow
          team={fixture.homeTeam}
          score={fixture.score.fullTime.home}
          showAllScores={showAllScores}
          useSoundEffects={useSoundEffects}
          status={fixture.status}
          isHomeTeam={true}
        />
        <OpponentRow
          team={fixture.awayTeam}
          score={fixture.score.fullTime.away}
          showAllScores={showAllScores}
          useSoundEffects={useSoundEffects}
          status={fixture.status}
          isHomeTeam={false}
        />
      </OpponentsList>

      <CompetitionName>
        {fixture.competition.name}{" "}
        {fixture.competition.type === "CUP" && fixture.group
          ? `· ${fixture.group}`
          : null}{" "}
        {fixture.competition.type === "CUP" && fixture.stage
          ? `· ${fixture.stage}`
          : null}
      </CompetitionName>
    </FixtureRow>
  );
}

export default Fixture;
