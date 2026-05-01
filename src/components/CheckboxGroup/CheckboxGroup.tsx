import type { PropsWithChildren } from "react";
import { fieldsetGroupStyle } from "@/styles/commonStyles";
import { styled } from "next-yak";

const StyledCheckboxGroup = styled.div`
  ${fieldsetGroupStyle};
`;

function CheckboxGroup({ children }: PropsWithChildren) {
  return <StyledCheckboxGroup>{children}</StyledCheckboxGroup>;
}

export default CheckboxGroup;
