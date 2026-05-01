// @ts-nocheck
import { Label as HeadlessLabel } from "@headlessui/react";
import { teamText, ellipsizedText } from "@/styles/commonStyles";
import { styled } from "next-yak";

const FieldLabel = styled(HeadlessLabel)`
  ${teamText};
  ${ellipsizedText};
  align-items: center;
  display: flex;
  flex: 1;
  padding: 0 0.75rem;
  text-align: left;
`;

function InputLabel({ children, ...props }) {
  return <FieldLabel {...props}>{children}</FieldLabel>;
}

export default InputLabel;
