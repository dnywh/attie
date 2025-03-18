import { styled } from "@pigment-css/react";

function InputIconContainer({ children }) {
  return <Container>{children}</Container>;
}

export default InputIconContainer;

const Container = styled("div")(({ theme }) => ({
  // Placement
  width: "1.5rem",
  height: "1.5rem",
  borderRadius: "50%",
  display: "grid",
  placeItems: "center",
  // Styling
  backgroundColor: theme.colors.background.foremost,
  border: `1px dashed ${theme.colors.text.primary}`,
  "& svg": {
    opacity: 0,
    margin: "0 0 2px 1px", // Optical offset for pseudo printing misalignment
  },
  "[data-headlessui-state~='checked'] &": {
    backgroundColor: theme.colors.background.card,
    "& svg": {
      opacity: 1,
    },
    border: "none",
  },
  "[data-headlessui-state~='disabled'] &": {
    opacity: 0.35, // The parent is dulled but let's dull the icon contents even more
  },
}));
