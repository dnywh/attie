import { styled } from "@pigment-css/react";
import { mediumText } from "@/styles/commonStyles";

function CountDot({ children }) {
  return <StyledCount>{children}</StyledCount>;
}

export default CountDot;

const StyledCount = styled("span")(({ theme }) => ({
  flexShrink: 0,
  ...mediumText,
  letterSpacing: 0, // Override mediumText presets so text is truely centered
  display: "grid",
  placeItems: "center",
  backgroundColor: theme.colors.background.card,
  color: theme.colors.text.primary,
  width: "1.25rem",
  height: "1.25rem",
  borderRadius: "50%",
}));
