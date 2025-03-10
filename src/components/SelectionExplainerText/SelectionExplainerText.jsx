import { styled } from "@pigment-css/react";

const StyledParagraph = styled("p")(({ theme }) => ({
  textAlign: "center",
}));
function SelectionExplainerText({ children }) {
  return <StyledParagraph>{children}</StyledParagraph>;
}

export default SelectionExplainerText;
