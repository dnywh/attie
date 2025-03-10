import { styled } from "@pigment-css/react";

const StyledLabel = styled("label")(({ theme }) => ({
  textTransform: "uppercase",
  letterSpacing: "0.035em",
  lineHeight: "100%",
  width: "100%",
  // Truncate and ellipsize text
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
}));

function InputLabel({ children, ...props }) {
  return <StyledLabel {...props}>{children}</StyledLabel>;
}

export default InputLabel;
