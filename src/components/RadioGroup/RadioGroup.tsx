// @ts-nocheck
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

function RadioGroup({ children, ...props }) {
  return <StyledRadioGroup {...props}>{children}</StyledRadioGroup>;
}

export default RadioGroup;
