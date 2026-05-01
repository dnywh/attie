import type { PropsWithChildren, ReactNode } from "react";
import { Checkbox } from "@headlessui/react";
import FieldChoiceRow from "@/components/FieldChoiceRow";
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
    <FieldChoiceRow
      control={
        <StyledCheckbox name={name} checked={checked} onChange={onChange}>
          <InputIconContainer>{icon}</InputIconContainer>
        </StyledCheckbox>
      }
    >
      {children}
    </FieldChoiceRow>
  );
}

export default FieldCheckboxRow;
