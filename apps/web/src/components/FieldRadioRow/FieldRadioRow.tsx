import type { PropsWithChildren } from "react";
import { Radio } from "@headlessui/react";
import FieldChoiceRow from "@/components/FieldChoiceRow";
import InputIconContainer from "@/components/InputIconContainer";
import RadioDotIcon from "@/components/RadioDotIcon";
import { styled } from "next-yak";
import { fieldInputStyle } from "@/styles/commonStyles";

const StyledRadio = styled(Radio)`
  ${fieldInputStyle};
`;

function FieldRadioRow({ value, children, ...props }: PropsWithChildren<{ value: boolean }>) {
  return (
    <FieldChoiceRow
      control={
        <StyledRadio value={value} {...props}>
          <InputIconContainer>
            <RadioDotIcon />
          </InputIconContainer>
        </StyledRadio>
      }
    >
      {children}
    </FieldChoiceRow>
  );
}

export default FieldRadioRow;
