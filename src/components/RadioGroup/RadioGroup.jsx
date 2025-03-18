import { RadioGroup as HeadlessRadioGroup } from "@headlessui/react";
import { fieldsetGroupStyle } from "@/styles/commonStyles";
import { styled } from "@pigment-css/react";

const StyledRadioGroup = styled(HeadlessRadioGroup)(({ theme }) => ({
  ...fieldsetGroupStyle({ theme }),
  variants: [
    {
      props: { disabled: true },
      style: {
        pointerEvents: "none",
        cursor: "not-allowed",
        "& label, & span": {
          opacity: 0.35, // Dull the contents without dulling the background fill
        },
      },
    },
  ],
}));

function RadioGroup({ children, ...props }) {
  return <StyledRadioGroup {...props}>{children}</StyledRadioGroup>;
}

export default RadioGroup;
