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
const StyledSelect = styled(HeadlessSelect)({
  // https://moderncss.dev/custom-select-styles-with-pure-css/
  // A reset of styles, including removing the default dropdown arrow
  appearance: "none",
  // Additional resets for further consistency
  backgroundColor: "transparent",
  border: "none",
  padding: "0 1em 0 0",
  margin: "0",
  width: "100%",
  fontFamily: "inherit",
  fontSize: "inherit",
  cursor: "inherit",
  lineHeight: "inherit",
  outline: "none",
});

// Wrapping div required to properly set custom arrow shape
const Wrapper = styled("div")(({ theme }) => ({
  // Custom styles
  // width: "100%",
  padding: "0.5rem",
  color: theme.colors.text.primary,
  ...bleedingWhiteCard({ theme }),
  ...ellipsizedText,
  ...teamText,

  display: "grid",
  gridTemplateAreas: "select",
  alignItems: "center",

  "&:focus-within": {
    background: "lightyellow",
  },

  // Dropdown icon
  "&::after": {
    gridArea: "select",
    justifySelf: "end",
    content: '""',
    width: "0.8em",
    height: "0.5em",
    backgroundColor: "red",
    clipPath: "polygon(100% 0%, 0 0%, 50% 100%)",
  },
}));
