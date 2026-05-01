// @ts-nocheck
import { Fieldset as HeadlessFieldset } from "@headlessui/react";
import { styled } from "next-yak";

const StyledFieldset = styled(HeadlessFieldset)`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

function Fieldset({ children }) {
  return <StyledFieldset>{children}</StyledFieldset>;
}

export default Fieldset;
