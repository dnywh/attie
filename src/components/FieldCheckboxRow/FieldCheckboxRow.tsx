import type { PropsWithChildren, ReactNode } from "react";
import { Checkbox } from "@headlessui/react";
import FieldRow from "@/components/FieldRow";
import FieldLabel from "@/components/FieldLabel";
import InputIconContainer from "@/components/InputIconContainer";
import { styled } from "next-yak";
import { fieldInputStyle } from "@/styles/commonStyles";
import RadioDotIcon from "@/components/RadioDotIcon";

const StyledCheckbox = styled(Checkbox)`
  ${fieldInputStyle};
`;

interface FieldCheckboxRowProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: ReactNode;
}

function FieldCheckboxRow({
  name,
  checked,
  onChange,
  icon = <RadioDotIcon />,
  children,
}: PropsWithChildren<FieldCheckboxRowProps>) {
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
