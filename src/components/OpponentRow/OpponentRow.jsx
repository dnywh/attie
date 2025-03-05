import TeamLogo from "@/components/TeamLogo";
import Score from "@/components/Score";

function OpponentRow({ team, score, showScore }) {
  return (
    <div>
      <TeamLogo src={team.crest} />
      <p>{team.name}:</p>
      <Score score={score} showScore={showScore} />
    </div>
  );
}

export default OpponentRow;
