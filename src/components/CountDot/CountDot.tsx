// @ts-nocheck
import { styled } from "next-yak";
import { mediumText } from "@/styles/commonStyles";
import { webTheme } from "@/styles/theme.yak";

function CountDot({ children }) {
  return <StyledCount>{children}</StyledCount>;
}

export default CountDot;

const StyledCount = styled.span`
  ${mediumText};
  background-color: ${webTheme.colors.background.card};
  border-radius: 50%;
  color: ${webTheme.colors.text.primary};
  display: grid;
  flex-shrink: 0;
  height: 1.25rem;
  letter-spacing: 0;
  place-items: center;
  width: 1.25rem;
`;
