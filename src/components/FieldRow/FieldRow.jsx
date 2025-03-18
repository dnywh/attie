import { Field } from "@headlessui/react";
import { styled } from "@pigment-css/react";

const StyledField = styled(Field)(({ theme }) => ({
  display: "flex",
  flexDirection: "row-reverse",
  alignItems: "stretch", // Take full height of container so tapping anywhere on container triggers event
  "&:hover": {
    background: theme.colors.background.focus.hover,
  },
  "&:focus-within": {
    background: theme.colors.background.focus.active,
  },
}));

function FieldRow({ children, ...props }) {
  return <StyledField {...props}>{children}</StyledField>;
}

export default FieldRow;
