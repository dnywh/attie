// @ts-nocheck
import { fieldsetGroupStyle } from "@/styles/commonStyles";
import { styled } from "next-yak";

const StyledCheckboxGroup = styled.div`
  ${fieldsetGroupStyle};
`;

function CheckboxGroup({ children }) {
  return <StyledCheckboxGroup>{children}</StyledCheckboxGroup>;
}

export default CheckboxGroup;
