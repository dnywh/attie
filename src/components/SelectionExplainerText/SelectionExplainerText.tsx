// @ts-nocheck
import { styled } from "next-yak";

const StyledParagraph = styled.p`
  text-align: center;
`;
function SelectionExplainerText({ children }) {
  return <StyledParagraph>{children}</StyledParagraph>;
}

export default SelectionExplainerText;
