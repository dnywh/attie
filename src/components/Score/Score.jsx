import { styled } from "@pigment-css/react";

const Block = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "2rem",
  height: "2rem",
  backgroundColor: "black",
  color: "black",
  borderRadius: "50%",

  variants: [
    {
      props: { showScore: true },
      style: {
        backgroundColor: "white",
        border: "0.5px dashed black",
      },
    },
  ],
});

function Score({ score, showScore = false }) {
  return <Block showScore={showScore}>{showScore && score}</Block>;
}

export default Score;
