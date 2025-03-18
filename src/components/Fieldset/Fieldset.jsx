import { Fieldset as HeadlessFieldset } from "@headlessui/react";
import { styled } from "@pigment-css/react";

const StyledFieldset = styled(HeadlessFieldset)({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem", // 4px gap
});

function Fieldset({ children }) {
  return <StyledFieldset>{children}</StyledFieldset>;
}

export default Fieldset;
