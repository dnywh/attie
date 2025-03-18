import { fieldsetGroupStyle } from "@/styles/commonStyles";
import { styled } from "@pigment-css/react";

const StyledCheckboxGroup = styled("div")(({ theme }) => ({
  ...fieldsetGroupStyle({ theme }),
}));

function CheckboxGroup({ children, ...props }) {
  return <StyledCheckboxGroup {...props}>{children}</StyledCheckboxGroup>;
}

export default CheckboxGroup;
