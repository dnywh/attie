import OpponentRow from "@/components/OpponentRow";

function Fixture({ fixture, showScore }) {
  return (
    <li>
      <h3>{fixture.utcDate}</h3>
      <p>{fixture.competition.name}</p>
      <p>FT</p>
      <ul>
        <li>
          <OpponentRow
            team={fixture.homeTeam}
            score={fixture.score.fullTime.home}
            showScore={showScore}
          />
        </li>
        <li>
          <OpponentRow
            team={fixture.awayTeam}
            score={fixture.score.fullTime.away}
            showScore={showScore}
          />
        </li>
      </ul>
    </li>
  );
}

export default Fixture;
