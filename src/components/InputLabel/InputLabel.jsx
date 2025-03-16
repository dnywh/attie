import { Label as HeadlessLabel } from "@headlessui/react";
import { teamText, ellipsizedText } from "@/styles/commonStyles";
import { styled } from "@pigment-css/react";

const StyledLabel = styled(HeadlessLabel)(({ theme }) => ({
  ...ellipsizedText,
  ...teamText,
  width: "100%",
  // cursor: "unset", // Browsers often set to 'default'
  padding: "0.75rem 0.75rem",
}));

function InputLabel({ children, ...props }) {
  return <StyledLabel {...props}>{children}</StyledLabel>;
}

export default InputLabel;
