import { styled, keyframes } from "@pigment-css/react";

const loadingStagger = keyframes({
  from: {
    opacity: "0",
  },
  to: {
    opacity: "1",
  },
});

const StyledText = styled("span")({
  "& span": {
    // color: "red",
    animation: `${loadingStagger} 1s infinite`,
  },

  "& span:nth-child(1)": {
    animationDelay: "0s",
  },
  "& span:nth-child(2)": {
    animationDelay: "100ms",
  },
  "& span:nth-child(3)": {
    animationDelay: "200ms",
  },
});

function LoadingText({ children }) {
  return (
    <StyledText>
      {children}
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </StyledText>
  );
}

export default LoadingText;
