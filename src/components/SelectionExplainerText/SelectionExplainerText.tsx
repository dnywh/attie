import type { PropsWithChildren } from "react";
import { styled } from "next-yak";

const StyledParagraph = styled.p`
  text-align: center;
`;
function SelectionExplainerText({ children }: PropsWithChildren) {
  return <StyledParagraph>{children}</StyledParagraph>;
}

export default SelectionExplainerText;
