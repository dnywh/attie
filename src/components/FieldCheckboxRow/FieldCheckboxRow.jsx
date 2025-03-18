import { Checkbox } from "@headlessui/react";
import FieldRow from "@/components/FieldRow";
import FieldLabel from "@/components/FieldLabel";
import InputIconContainer from "@/components/InputIconContainer";
import FootballIcon from "@/components/FootballIcon";
import { styled } from "@pigment-css/react";
import { fieldInputStyle } from "@/styles/commonStyles";

const StyledCheckbox = styled(Checkbox)(() => ({
  ...fieldInputStyle,
}));

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
