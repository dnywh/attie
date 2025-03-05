import React from "react";

function Score({ score, showScore = false }) {
  return <div>{showScore ? score : "X"}</div>;
}

export default Score;
