import { Label as HeadlessLabel } from "@headlessui/react";
import { teamText, ellipsizedText } from "@/styles/commonStyles";
import { styled } from "@pigment-css/react";

const StyledLabel = styled(HeadlessLabel)(({ theme }) => ({
  flex: 1, // Take full width
  ...teamText,
  ...ellipsizedText,
  padding: "0 0.75rem", // Inset from left and right edges
  textAlign: "left",
  // cursor: "unset", // Browsers often set to 'default'

  // Ensure the label is vertically centered, since the parent flex container tells it to stretch (so the whole container is tappable)
  display: "flex",
  alignItems: "center",
}));

function InputLabel({ children, ...props }) {
  return <StyledLabel {...props}>{children}</StyledLabel>;
}

export default InputLabel;
