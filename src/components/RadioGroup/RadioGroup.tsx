import type { PropsWithChildren } from "react";
import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import { fieldsetGroupStyle } from "@/styles/commonStyles";
import { styled } from "next-yak";

const StyledRadioGroup = styled(HeadlessRadioGroup)`
  ${fieldsetGroupStyle};
  &[data-disabled] {
    cursor: not-allowed;
    pointer-events: none;

    & label,
    & span {
      opacity: 0.35;
    }
  }
`;

interface RadioGroupProps {
  value: boolean;
  onChange: (value: boolean) => void;
  "aria-label"?: string;
  disabled?: boolean;
}

function RadioGroup({ children, ...props }: PropsWithChildren<RadioGroupProps>) {
  return (
    <StyledRadioGroup
      {...props}
      onChange={props.onChange as (value: unknown) => void}
    >
      {children}
    </StyledRadioGroup>
  );
}

export default RadioGroup;
