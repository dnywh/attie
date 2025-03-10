import { styled } from "@pigment-css/react";

const StyledDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  border: "1px solid black",
  backgroundColor: "white",
}));

function FieldsetItems({ children }) {
  return <StyledDiv>{children}</StyledDiv>;
}

export default FieldsetItems;
