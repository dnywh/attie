import OpponentRow from "@/components/OpponentRow";

function Fixture({ homeTeam, awayTeam, utcDate, score, showScore, ...props }) {
  return (
    <li>
      <p>{utcDate}</p>
      <p>FT</p>
      <ul>
        <li>
          <OpponentRow
            team={homeTeam}
            score={score.fullTime.home}
            showScore={showScore}
          />
        </li>
        <li>
          <OpponentRow
            team={awayTeam}
            score={score.fullTime.away}
            showScore={showScore}
          />
        </li>
      </ul>
    </li>
  );
}

export default Fixture;
