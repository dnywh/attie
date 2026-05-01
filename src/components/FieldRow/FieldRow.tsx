// @ts-nocheck
import { Field } from "@headlessui/react";
import { styled } from "next-yak";
import { webTheme } from "@/styles/theme.yak";

const StyledField = styled(Field)`
  align-items: stretch;
  display: flex;
  flex-direction: row-reverse;

  &:hover {
    background: ${webTheme.colors.background.focus.hover};
  }

  &:focus-within {
    background: ${webTheme.colors.background.focus.active};
  }
`;

function FieldRow({ children, ...props }) {
  return <StyledField {...props}>{children}</StyledField>;
}

export default FieldRow;
