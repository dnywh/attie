import { siteConfig } from "@/config/site";
import { styled, keyframes } from "@pigment-css/react";

const scrollFade = keyframes({
  from: {
    opacity: "1",
    transform: "scale(1)",
  },
  to: {
    opacity: "0",
    transform: "scale(0.8)",
  },
});

const Header = styled("header")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  color: "white",
  textTransform: "lowercase",
  fontStyle: "italic",

  "& h1": {
    letterSpacing: "-0.035em",
    fontSize: "clamp(5rem, 20vw, 10rem)",
    lineHeight: "100%",
    // TODO: Add more comma-separated values for less-jagged edges (perhaps programmatically)
    textShadow:
      "0 1px 0 black, 1px 2px 0 black, 2px 3px 0 black, 3px 4px 0 black, 3px 5px 0 black, 3px 6px 0 black",
    "-webkit-text-stroke": "5px black",
    "paint-order": "stroke fill",

    "& span": {
      // Manually kern the 'e' character at the end of 'attie'
      marginLeft: "-0.015em",
    },
  },

  "& p": {
    fontSize: "1.0625rem",
    fontWeight: "500",
    textWrap: "balance",
    lineHeight: "120%",
    // TODO: Add more comma-separated values for less-jagged edges (perhaps programmatically)
    textShadow: "1px 1px 0 black, 2px 2px 0 black",
    "-webkit-text-stroke": "2px black",
    "paint-order": "stroke fill",
  },

  // Fancy stuff
  "@supports (animation-timeline: scroll())": {
    position: "sticky",
    top: "0",
    // https://ryanmulligan.dev/blog/sticky-header-scroll-shadow/
    // https://mskelton.dev/blog/css-scroll-animations
    animation: `${scrollFade} linear both`,
    animationTimeline: "scroll()",
    animationRange: "0 6rem", // Match margin above and below (gap to next content)
  },
});

function FixturesHeader() {
  return (
    <Header>
      <h1>
        Atti<span>e</span>
      </h1>
      <p>{siteConfig.byline}</p>
    </Header>
  );
}

export default FixturesHeader;
