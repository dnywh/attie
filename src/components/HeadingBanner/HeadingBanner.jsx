import { styled } from "@pigment-css/react";

const StyledHeading = styled("h2")(({ theme }) => ({
  textAlign: "center",
  fontStyle: "italic",
  textTransform: "uppercase",
  letterSpacing: "0.085rem",
  fontSize: "1.0625rem",
  fontWeight: "500",
  color: "white",
  backgroundColor: "black",
  padding: "0.25rem 0",
  // Required since it might be rendered as inline elements like label
  display: "block",
  width: "100%",

  variants: [
    {
      props: { sticky: true },
      style: {
        // Sticky behaviour
        position: "sticky",
        top: "0",
        zIndex: "1",
        // top: "3px",
        // boxShadow: "0 0 0 3px #FA6565",
      },
    },
  ],
}));

function HeadingBanner({
  as = "h2",
  sticky = false,
  children = "Heading Title",
  ...props
}) {
  return (
    <StyledHeading as={as} sticky={sticky} {...props}>
      {children}
    </StyledHeading>
  );
}

export default HeadingBanner;
