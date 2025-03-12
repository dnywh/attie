import { styled } from "@pigment-css/react";

const StyledDiv = styled("div")(({ theme }) => ({
  // padding: "1rem",
  display: "flex",
  // gap: "1rem",
  flexDirection: "row-reverse",
  alignItems: "center",

  "& label": {
    padding: "0.75rem 0.75rem",
  },

  "& input": {
    // TODO: Hide and restyle visible input, or nest input inside of tappable label
    margin: "0 0.75rem 0 0",
  },

  "&:hover": {
    cursor: "pointer",
  },
}));

function InputGroup({ children, ...props }) {
  return <StyledDiv {...props}>{children}</StyledDiv>;
}

export default InputGroup;
