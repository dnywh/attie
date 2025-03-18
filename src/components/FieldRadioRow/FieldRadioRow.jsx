import { Radio } from "@headlessui/react";
import FieldRow from "@/components/FieldRow";
import FieldLabel from "@/components/FieldLabel";
import RadioDotIcon from "@/components/RadioDotIcon";
import { styled } from "@pigment-css/react";

function FieldRadioRow({ value, children, ...props }) {
  return (
    <FieldRow>
      <StyledRadio value={value} {...props}>
        <RadioIconContainer>
          <RadioDotIcon />
        </RadioIconContainer>
      </StyledRadio>
      <FieldLabel>{children}</FieldLabel>
    </FieldRow>
  );
}

export default FieldRadioRow;

// TODO: Abstract and share with FieldCheckbox
const StyledRadio = styled(Radio)(({ theme }) => ({
  padding: "0.75rem",
  outline: "none", // See focus-within
}));

const CheckboxIconBase = styled("div")(({ theme }) => ({
  width: "1.5rem",
  height: "1.5rem",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
}));

const RadioIconContainer = styled(CheckboxIconBase)(({ theme }) => ({
  backgroundColor: theme.colors.background.foremost,
  border: `1px dashed ${theme.colors.text.primary}`,
  "& svg": {
    opacity: 0,
    margin: "0 0 2px 1px", // Optical offset for pseudo printing misalignment
  },
  "[data-headlessui-state~='checked'] &": {
    backgroundColor: theme.colors.background.card,
    "& svg": {
      opacity: 1,
    },
    border: "none",
  },
  "[data-headlessui-state~='disabled'] &": {
    opacity: 0.35, // The parent RadioGroup is dulled but let's dull the icon even more
  },
}));
