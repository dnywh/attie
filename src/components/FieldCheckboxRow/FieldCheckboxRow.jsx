import { Checkbox } from "@headlessui/react";
import FieldRow from "@/components/FieldRow";
import FieldLabel from "@/components/FieldLabel";
import InputIconContainer from "@/components/InputIconContainer";
import FootballIcon from "@/components/FootballIcon";
import { styled } from "@pigment-css/react";

function FieldCheckboxRow({ name, checked, onChange, children }) {
  return (
    <FieldRow>
      <StyledCheckbox name={name} checked={checked} onChange={onChange}>
        <InputIconContainer>
          <FootballIcon />
        </InputIconContainer>
      </StyledCheckbox>
      <FieldLabel>{children}</FieldLabel>
    </FieldRow>
  );
}

export default FieldCheckboxRow;

// TODO: Abstract and share with FieldRadioRow
const StyledCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: "0.75rem",
  outline: "none", // See focus-within
}));
