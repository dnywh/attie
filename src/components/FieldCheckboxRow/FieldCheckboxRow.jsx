import { Checkbox } from "@headlessui/react";
import FieldRow from "@/components/FieldRow";
import FieldLabel from "@/components/FieldLabel";
import InputIconContainer from "@/components/InputIconContainer";
import { styled } from "@pigment-css/react";
import { fieldInputStyle } from "@/styles/commonStyles";
import RadioDotIcon from "@/components/RadioDotIcon";

const StyledCheckbox = styled(Checkbox)(() => ({
  ...fieldInputStyle,
}));

function FieldCheckboxRow({
  name,
  checked,
  onChange,
  icon = <RadioDotIcon />,
  children,
}) {
  return (
    <FieldRow>
      <StyledCheckbox name={name} checked={checked} onChange={onChange}>
        <InputIconContainer>{icon}</InputIconContainer>
      </StyledCheckbox>
      <FieldLabel>{children}</FieldLabel>
    </FieldRow>
  );
}

export default FieldCheckboxRow;
