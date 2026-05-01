// @ts-nocheck
import { styled, keyframes } from "next-yak";

const loadingStagger = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const StyledText = styled.span`
  & span {
    animation: ${loadingStagger} 1s infinite;
  }

  & span:nth-child(1) {
    animation-delay: 0s;
  }

  & span:nth-child(2) {
    animation-delay: 100ms;
  }

  & span:nth-child(3) {
    animation-delay: 200ms;
  }
`;

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
