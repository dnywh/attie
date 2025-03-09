import { styled } from "@pigment-css/react";

const StyledHeading = styled("h2")({
  textAlign: "center",
  fontStyle: "italic",
  textTransform: "uppercase",
  letterSpacing: "0.085rem",
  fontSize: "1.0625rem",
  fontWeight: "500",
  color: "white",
  backgroundColor: "black",
  padding: "0.25rem 0",
});

function HeadingBanner({ children = "Heading" }) {
  return <StyledHeading>{children}</StyledHeading>;
}

export default HeadingBanner;
