import { styled } from "@pigment-css/react";

const StyledDropdown = styled("div")({
  display: "flex",
  gap: "0.65rem",
  padding: "0.65rem",
  borderColor: "black",
  borderStyle: "solid",
  borderWidth: "1px",
  backgroundColor: "rgb(240, 240, 240)",
  alignItems: "center",
  fontSize: "0.85rem",
  // textWrap: "noWrap",
  overflow: "hidden",
  // whiteSpace: "nowrap",

  "&::after": {
    content: '"▾"',
    // display: "block",
    // flexGrow: 1,
    // borderBottom: "1px solid black",
    // margin: "0.5rem 0",
  },

  variants: [
    {
      props: { fillSpace: true },
      style: {
        flexGrow: 1,
      },
    },
    {
      props: { fillSpace: false },
      style: {
        flexShrink: 0,
      },
    },
  ],
});

const IconSpan = styled("span")({
  flexShrink: 0,
  fontSize: "1.5rem",
});

const ContentSpan = styled("span")({
  variants: [
    {
      props: { fillSpace: true },
      style: {
        flexGrow: 1,
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
    },
  ],
});

const CountSpan = styled("span")({
  fontSize: "0.75rem",
  backgroundColor: "black",
  color: "white",
  width: "1.5rem",
  height: "1.5rem",
  borderRadius: "0.75rem",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
});
function FancyDropdown({ icon = "•", fillSpace = false, count, children }) {
  return (
    <StyledDropdown fillSpace={fillSpace}>
      <IconSpan>{icon}</IconSpan>
      {children && <ContentSpan fillSpace={fillSpace}>{children}</ContentSpan>}
      {count && <CountSpan>{count}</CountSpan>}
    </StyledDropdown>
  );
}

export default FancyDropdown;
