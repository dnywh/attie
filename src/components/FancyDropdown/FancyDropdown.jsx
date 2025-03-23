"use client";
import { useState, useEffect } from "react";
import {
  Switch,
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Button from "@/components/Button";
import CountDot from "@/components/CountDot";
import DropdownIcon from "@/components/DropdownIcon";
import FootballIcon from "@/components/FootballIcon";
import { styled, keyframes } from "@pigment-css/react";
// import {
//   createCardStyle,
//   veryBasicCardStyle,
//   smallCardStyle,
// } from "@/styles/commonStyles";
import { teamText, mediumText, ellipsizedText } from "@/styles/commonStyles";

const scrollShadow = keyframes({
  from: {
    borderBottom: "none",
    boxShadow: "none",
  },
  to: {
    // Variable defined inside component where theme is accessible
    borderBottom: `1px solid var(--header-border-color)`,
    boxShadow: `0 4px 0 0 var(--header-shadow-color)`,
  },
});

const DialogHeader = styled("header")(({ theme }) => ({
  display: "flex",
  flexDirection: "row-reverse",

  // Sticky behaviour
  position: "sticky",
  top: "0",
  // Sticky styling
  backgroundColor: theme.colors.background.interstitial,
  padding: "0 0.75rem",
  minHeight: "3rem", // 48px

  zIndex: "1", // Prevent Select component from stacking above

  "@supports (animation-timeline: scroll())": {
    // https://ryanmulligan.dev/blog/sticky-header-scroll-shadow/
    // https://mskelton.dev/blog/css-scroll-animations
    "--header-border-color": theme.colors.text.primary,
    "--header-shadow-color": theme.colors.shadow,
    animation: `${scrollShadow} linear both`,
    animationTimeline: "scroll()",
    animationRange: "0 0.5rem",
  },
}));

const StyledButton = styled("button")(({ theme }) => ({
  display: "flex",
  gap: "0.65rem",
  // padding: "0.65rem",
  padding: "0 2rem 0 0.5rem", // Account for icon on right
  color: theme.colors.text.primary,
  backgroundColor: theme.colors.background.foremost,
  alignItems: "center",
  ...mediumText,
  height: "2.5rem", // 40px
  // textWrap: "noWrap",
  overflow: "hidden",
  // whiteSpace: "nowrap",

  // ...createCardStyle({ interactive: true })({ theme }),

  // ...veryBasicCardStyle({ theme }),

  border: `1px solid ${theme.colors.text.primary}`,
  borderRadius: "2px",
  boxShadow: `0.5px 1.5px 0 0 ${theme.colors.background.foremost}`,

  transition: `transform 150ms ${theme.curves.spring.light}`,
  // transformOrigin: "bottom center",

  "&:hover": {
    transform: "translateY(-1.5px) scale(1.005)",
  },
  "&:active": {
    "&:(pointer: coarse)": {
      // Only apply to touch screens and similar
      transform: "translateY(0) scale(0.965)",
    },
  },

  position: "relative", // For SVG

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
}));

const IconSpan = styled("span")({
  flexShrink: 0,
  fontSize: "1.5rem",
});

const ContentSpan = styled("span")({
  textAlign: "left",
  variants: [
    {
      props: { fillSpace: true },
      style: {
        flexGrow: 1,
        ...ellipsizedText,
      },
    },
  ],
});

// Dialog styles
const StyledDialog = styled(Dialog)({
  position: "relative",
  zIndex: "50",
});

const StyledDialogPanel = styled(DialogPanel)(({ theme }) => ({
  position: "fixed",
  bottom: "0.5rem",
  left: "50%",
  // Specify all transform properties in initial state
  transform: "translateX(-50%) translateY(0) rotate(0deg)",
  backgroundColor: theme.colors.background.interstitial,
  padding: "0 0 1.75rem",
  width: "calc(100% - 1rem)",
  maxWidth: "30rem",
  borderRadius: "0.25rem",
  maxHeight: "calc(100dvh - 5rem)",
  overflowY: "scroll",
  transition: `opacity 50ms ease, transform 150ms ${theme.curves.spring.light}`,

  "&[data-closed]": {
    opacity: 0,
    transform: "translateX(-50%) translateY(15%) rotate(0deg)",
  },

  "@media (min-height: 768px)": {
    top: "50%",
    bottom: "unset",
    transform: "translateX(-50%) translateY(-50%) rotate(0deg)",

    "&[data-closed]": {
      transform:
        "translateX(-48%) translateY(calc(-50% + 2.5rem)) rotate(-2.25deg)",
    },
  },
}));

// Required so padding can be separate from sticky header
const DialogContent = styled("div")({
  padding: "0 0.75rem",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

const StyledDialogBackdropOne = styled(DialogBackdrop)(({ theme }) => ({
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "#FA6565",
  opacity: 0.95,
  transition: "opacity 150ms ease",

  "&[data-closed]": {
    opacity: 0,
  },
}));

const StyledDialogBackdropTwo = styled(DialogBackdrop)({
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backdropFilter: "grayscale(96%) sepia(30%) opacity(1)",
  // transition: "backdrop-filter 150ms ease",
  transition: "opacity 150ms ease",

  "&[data-closed]": {
    // backdropFilter: "grayscale(96%) sepia(30%) opacity(0)",
    opacity: 0,
  },
});

function FancyDropdown({
  icon = <FootballIcon />,
  label,
  fillSpace = false,
  count,
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);
  function open() {
    setIsOpen(true);
  }

  function close() {
    console.log("closing...");
    setIsOpen(false);
  }

  return (
    <>
      <StyledButton fillSpace={fillSpace} onClick={open}>
        <IconSpan>{icon}</IconSpan>
        {label && <ContentSpan fillSpace={fillSpace}>{label}</ContentSpan>}
        {count > 0 && <CountDot>{count > 9 ? "9+" : count}</CountDot>}
        <DropdownIcon size="small" />
      </StyledButton>

      <StyledDialog open={isOpen} onClose={() => setIsOpen(false)}>
        <StyledDialogBackdropOne transition />
        <StyledDialogBackdropTwo transition />
        <StyledDialogPanel transition>
          <DialogHeader>
            <Button onClick={close}>Close</Button>
            {/* <DialogTitle>Sport and competitions</DialogTitle> */}
          </DialogHeader>
          <DialogContent>{children}</DialogContent>
        </StyledDialogPanel>
      </StyledDialog>
    </>
  );
}

export default FancyDropdown;
