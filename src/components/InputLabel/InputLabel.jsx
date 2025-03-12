import { styled } from "@pigment-css/react";
import { teamText, ellipsizedText } from "@/styles/commonStyles";

const StyledLabel = styled("label")(({ theme }) => ({
  ...ellipsizedText,
  ...teamText,
  width: "100%",
}));

function InputLabel({ children, ...props }) {
  return <StyledLabel {...props}>{children}</StyledLabel>;
}

export default InputLabel;
