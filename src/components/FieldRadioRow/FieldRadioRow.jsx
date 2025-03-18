import { Radio } from "@headlessui/react";
import FieldRow from "@/components/FieldRow";
import FieldLabel from "@/components/FieldLabel";
import InputIconContainer from "@/components/InputIconContainer";
import RadioDotIcon from "@/components/RadioDotIcon";
import { styled } from "@pigment-css/react";

function FieldRadioRow({ value, children, ...props }) {
  return (
    <FieldRow>
      <StyledRadio value={value} {...props}>
        <InputIconContainer>
          <RadioDotIcon />
        </InputIconContainer>
      </StyledRadio>
      <FieldLabel>{children}</FieldLabel>
    </FieldRow>
  );
}

export default FieldRadioRow;

// TODO: Abstract and share with FieldCheckboxRow
const StyledRadio = styled(Radio)(({ theme }) => ({
  padding: "0.75rem",
  outline: "none", // See focus-within
}));
