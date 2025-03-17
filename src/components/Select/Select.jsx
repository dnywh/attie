import { Select as HeadlessSelect } from "@headlessui/react";
import DropdownIcon from "@/components/DropdownIcon";
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
      <DropdownIcon />
    </Wrapper>
  );
}

export default Select;

const StyledSelect = styled(HeadlessSelect)(({ theme }) => ({
  // https://moderncss.dev/custom-select-styles-with-pure-css/
  // A reset of styles, including removing the default dropdown arrow
  appearance: "none",
  // Additional resets for further consistency
  backgroundColor: "transparent",
  border: "none",
  margin: "0",
  padding: "0",
  width: "100%",
  fontFamily: "inherit",
  fontSize: "inherit",
  cursor: "inherit",
  lineHeight: "inherit",
  outline: "none",

  height: "3rem", // 48px
  height: "3rem",
  color: "inherit",
  padding: "0 2rem 0 0.5rem", // Account for icon on right
  ...ellipsizedText,
  ...teamText,
}));

const Wrapper = styled("div")(({ theme }) => ({
  cursor: "pointer",
  color: theme.colors.text.primary,
  ...bleedingWhiteCard({ theme }),

  transition: `transform ${theme.curves.springy}`,

  "&:hover": {
    transform: "scale(1.005)",
    background: theme.colors.background.focus.hover,
  },
  "&:active": {
    transform: "translateY(0) scale(0.965)",
  },

  "&:focus-within": {
    background: theme.colors.background.focus.active,
    boxShadow: "0 0 0 2px rgba(0,0,0,0.1)",
  },
  background: "white",

  position: "relative",
}));
