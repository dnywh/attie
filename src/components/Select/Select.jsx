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
    </Wrapper>
  );
}

export default Select;

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
  // "&:active": {
  //   transform: "translateY(0) scale(0.965)",
  // },

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
