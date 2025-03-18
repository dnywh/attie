import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import { fieldsetGroupStyle } from "@/styles/commonStyles";
import { styled } from "@pigment-css/react";

const StyledRadioGroup = styled(HeadlessRadioGroup)(({ theme }) => ({
  ...fieldsetGroupStyle({ theme }),
  variants: [
    {
      props: { disabled: true },
      style: {
        opacity: 0.35,
        pointerEvents: "none",
        cursor: "not-allowed",
      },
    },
  ],
}));

function RadioGroup({ children, ...props }) {
  return <StyledRadioGroup {...props}>{children}</StyledRadioGroup>;
}

export default RadioGroup;
