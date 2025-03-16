import { Select as HeadlessSelect } from "@headlessui/react";
import {
  bleedingWhiteCard,
  teamText,
  ellipsizedText,
} from "@/styles/commonStyles";
import { styled } from "@pigment-css/react";

function Select({ children, ...props }) {
  return (
    <Wrapper>
      <StyledSelect {...props}>{children}</StyledSelect>
      <StyledSvg
        width="8"
        height="12"
        viewBox="0 0 8 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0.888672 6.00006C0.888672 6.15729 1.0083 6.30084 1.17236 6.30084H7.48535C7.64941 6.30084 7.77246 6.15729 7.77246 6.00006C7.77246 5.83942 7.65283 5.69928 7.48535 5.69928H1.17236C1.00488 5.69928 0.888672 5.83942 0.888672 6.00006ZM3.88965 10.8297C4.1084 11.192 4.54932 11.1954 4.77148 10.8297L6.29248 8.33454C6.52148 7.95856 6.3335 7.57575 5.896 7.57575H2.76514C2.31738 7.57575 2.13965 7.96539 2.36523 8.33454L3.88965 10.8297ZM2.36523 3.66559C2.13965 4.03473 2.31738 4.42438 2.76514 4.42438H5.896C6.3335 4.42438 6.52148 4.04157 6.29248 3.66559L4.77148 1.17047C4.54932 0.80475 4.1084 0.808168 3.88965 1.17047L2.36523 3.66559Z" />
      </StyledSvg>
    </Wrapper>
  );
}

export default Select;

const StyledSvg = styled("svg")(({ theme }) => ({
  position: "absolute",
  top: "calc(50% - calc(12px / 2))", // Match SVG height / 2
  right: "1rem",
  pointerEvents: "none",

  "& path": {
    fill: theme.colors.text.primary,
  },
}));

// const StyledSelect = styled("select")(({ theme }) => ({
const StyledSelect = styled(HeadlessSelect)(({ theme }) => ({
  // https://moderncss.dev/custom-select-styles-with-pure-css/
  // A reset of styles, including removing the default dropdown arrow
  appearance: "none",
  // Additional resets for further consistency
  backgroundColor: "transparent",
  border: "none",
  // padding: "0 1em 0 0",
  margin: "0",
  padding: "0",
  width: "100%",
  fontFamily: "inherit",
  fontSize: "inherit",
  cursor: "inherit",
  lineHeight: "inherit",
  outline: "none",

  // Custom styles
  height: "3rem", // 48px
  color: "inherit",
  padding: "0 2rem 0 0.5rem", // Account for icon on right
  ...ellipsizedText,
  ...teamText,

  // outline: "1px solid red",
}));

// Wrapping div required to properly set custom arrow shape
const Wrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  color: theme.colors.text.primary,
  ...bleedingWhiteCard({ theme }),

  // display: "grid",
  // gridTemplateAreas: "select",
  // alignItems: "center",

  transition: `transform ${theme.curves.springy}`,
  // transformOrigin: "bottom center",

  "&:hover": {
    // transform: "translateY(-1.5px) scale(1.005)",
    transform: "scale(1.005)",
  },
  "&:active": {
    transform: "translateY(0) scale(0.965)",
  },

  "&:focus-within": {
    background: "lightyellow",
    boxShadow: "0 0 0 2px rgba(0,0,0,0.1)",
  },
  background: "white",

  position: "relative",
  // Dropdown icon
  "&::after": {
    content: '""',
    width: "0.8em",
    height: "0.5em",
    backgroundColor: theme.colors.text.primary,
    clipPath: "polygon(100% 0%, 0 0%, 50% 100%)",

    position: "absolute",
    top: "calc(50% - 0.25rem)", // Match icon height / 2
    right: "1rem",
    pointerEvents: "none",
  },
}));
