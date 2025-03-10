import { styled } from "@pigment-css/react";

const StyledButton = styled("button")({
  appearance: "none",
  border: "none",
  cursor: "pointer",
  background: "none",
  textTransform: "uppercase",
  fontWeight: "500",
  letterSpacing: "0.015em",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
});

function Button({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

export default Button;
