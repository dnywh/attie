import { styled } from "@pigment-css/react";
import { mediumText } from "@/styles/commonStyles";

function CountDot({ children }) {
  return (
    <Wrapper>
      <Span>{children}</Span>
    </Wrapper>
  );
}

export default CountDot;

const Wrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  borderRadius: "0.75rem",
  backgroundColor: theme.colors.mid.primary,
  width: "1.5rem",
  height: "1.5rem",
}));

const Span = styled("span")(({ theme }) => ({
  ...mediumText,
  textAlign: "center",
  color: theme.colors.text.primary,
  width: "100%",
  height: "100%",
}));
