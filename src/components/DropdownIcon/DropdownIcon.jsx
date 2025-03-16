import { styled } from "@pigment-css/react";

// 8x12 originally
const WIDTH = 8;
const HEIGHT = 12;
const SCALE = 1.5;

function DropdownIcon({ size = "large" }) {
  return (
    <StyledDropdownIcon
      size={size}
      viewBox="0 0 8 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.888672 6.00006C0.888672 6.15729 1.0083 6.30084 1.17236 6.30084H7.48535C7.64941 6.30084 7.77246 6.15729 7.77246 6.00006C7.77246 5.83942 7.65283 5.69928 7.48535 5.69928H1.17236C1.00488 5.69928 0.888672 5.83942 0.888672 6.00006ZM3.88965 10.8297C4.1084 11.192 4.54932 11.1954 4.77148 10.8297L6.29248 8.33454C6.52148 7.95856 6.3335 7.57575 5.896 7.57575H2.76514C2.31738 7.57575 2.13965 7.96539 2.36523 8.33454L3.88965 10.8297ZM2.36523 3.66559C2.13965 4.03473 2.31738 4.42438 2.76514 4.42438H5.896C6.3335 4.42438 6.52148 4.04157 6.29248 3.66559L4.77148 1.17047C4.54932 0.80475 4.1084 0.808168 3.88965 1.17047L2.36523 3.66559Z"
        fill="currentColor"
      />
    </StyledDropdownIcon>
  );
}

export default DropdownIcon;

const StyledDropdownIcon = styled("svg")({
  // Positioning
  position: "absolute", // Requires position: "relative" on parent
  right: "1rem",
  // Ignore events
  pointerEvents: "none",
  // Color
  // Handled on SVG via fill="currentColor"
  variants: [
    {
      props: { size: "large" },
      style: {
        // Size
        width: `${WIDTH * SCALE}px`,
        height: `${HEIGHT * SCALE}px`,
        // Positioning
        top: `calc(50% - calc(${HEIGHT * SCALE}px / 2))`, // Half of SVG height
      },
    },
    {
      props: { size: "small" },
      style: {
        // Size
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        // Positioning
        top: `calc(50% - calc(${HEIGHT}px / 2))`, // Half of SVG height
      },
    },
  ],
});
