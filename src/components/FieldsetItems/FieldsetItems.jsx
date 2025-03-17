import { styled } from "@pigment-css/react";

const Container = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  border: `1px solid ${theme.colors.text.primary}`,
  backgroundColor: theme.colors.background.foremost,
  // Give the entire container a focus treatment if an item within (e.g. radio button row) is focussed
  "&:focus-within": {
    boxShadow: `0 0 0 2px ${theme.colors.shadow}`,
  },
}));

function FieldsetItems({ children }) {
  return <Container>{children}</Container>;
}

export default FieldsetItems;
