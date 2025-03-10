import { styled } from "@pigment-css/react";

const StyledButton = styled("button")(({ theme }) => ({
  // Resets
  appearance: "none",
  border: "none",
  cursor: "pointer",
  background: "none",
  // Styles
  color: "black",
  fontWeight: "700",
  fontSize: "0.85rem",
  textTransform: "uppercase",
  textDecoration: "underline",
  letterSpacing: "0.035em",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  // Transitions
  transition: "transform 0.1s ease",

  "&:hover": {
    transform: "scale(1.05)",
  },
}));

function Button({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>;
}

export default Button;
