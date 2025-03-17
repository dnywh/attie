import { Label as HeadlessLabel } from "@headlessui/react";
import { teamText, ellipsizedText } from "@/styles/commonStyles";
import { styled } from "@pigment-css/react";

const StyledLabel = styled(HeadlessLabel)(({ theme }) => ({
  ...teamText,
  textAlign: "left",
  width: "100%",
  flex: 1,
  // cursor: "unset", // Browsers often set to 'default'
  padding: "0 0.75rem",
  ...ellipsizedText,
}));

function InputLabel({ children, ...props }) {
  return <StyledLabel {...props}>{children}</StyledLabel>;
}

export default InputLabel;
