import { teamText, ellipsizedText } from "@/styles/commonStyles";
import { styled } from "@pigment-css/react";

const StyledLabel = styled("label")(({ theme }) => ({
  ...ellipsizedText,
  ...teamText,
  width: "100%",
}));

function InputLabel({ children, ...props }) {
  return <StyledLabel {...props}>{children}</StyledLabel>;
}

export default InputLabel;
