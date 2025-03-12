import { styled } from "@pigment-css/react";

const StyledButton = styled("button")(({ theme }) => ({
  color: "black",
  fontWeight: "700",
  fontSize: "0.85rem",
  textTransform: "uppercase",
  textDecoration: "underline",
  letterSpacing: "0.035em",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  // Tap target sizing to account for small text design
  minHeight: "2.5rem", // 40px
  padding: "0 0.5rem", // Tappable on sides of text
  margin: "0 -0.5rem", // Visually 'undo' this padding
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
