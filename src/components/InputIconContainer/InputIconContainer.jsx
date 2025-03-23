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
  border: `1px dashed ${theme.colors.text.primary}`,
  backgroundColor: theme.colors.background.foremost,
  // Transition instantly when going off
  transition: `background-color 0ms ${theme.curves.ease.basic}`,
  "& svg": {
    opacity: 0,
    transform: "scale(0)",
    margin: "0 0 2px 1px", // Optical offset for pseudo printing misalignment
    // Transition instantly when going off
    transition: `opacity 0ms ${theme.curves.ease.basic}, transform 0ms ${theme.curves.spring.heavy}`,
  },
  "[data-headlessui-state~='checked'] &": {
    border: "none",
    backgroundColor: theme.colors.background.card,
    transition: `background-color 50ms ${theme.curves.ease.basic}`,
    "& svg": {
      opacity: 1,
      transform: "scale(1)",
      transition: `opacity 50ms ${theme.curves.ease.basic}, transform 100ms ${theme.curves.spring.heavy}`,
    },
  },
  "[data-headlessui-state~='disabled'] &": {
    opacity: 0.35, // The parent is dulled but let's dull the icon contents even more
  },
}));
