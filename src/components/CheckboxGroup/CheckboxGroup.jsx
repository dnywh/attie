import { fieldsetGroupStyle } from "@/styles/commonStyles";
import { styled } from "@pigment-css/react";

const StyledCheckboxGroup = styled("div")(({ theme }) => ({
  ...fieldsetGroupStyle({ theme }),
}));

function CheckboxGroup({ children }) {
  return <StyledCheckboxGroup>{children}</StyledCheckboxGroup>;
}

export default CheckboxGroup;
