import type { PropsWithChildren } from "react";
import { Radio } from "@headlessui/react";
import FieldRow from "@/components/FieldRow";
import FieldLabel from "@/components/FieldLabel";
import InputIconContainer from "@/components/InputIconContainer";
import RadioDotIcon from "@/components/RadioDotIcon";
import { styled } from "next-yak";
import { fieldInputStyle } from "@/styles/commonStyles";

const StyledRadio = styled(Radio)`
  ${fieldInputStyle};
`;

function FieldRadioRow({ value, children, ...props }: PropsWithChildren<{ value: boolean }>) {
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
