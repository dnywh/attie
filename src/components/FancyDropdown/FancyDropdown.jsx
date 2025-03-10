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
import { styled } from "@pigment-css/react";

const DialogHeader = styled("header")(({ theme }) => ({
  display: "flex",
  flexDirection: "row-reverse",

  // Sticky behaviour
  position: "sticky",
  top: "0",
  backgroundColor: theme.colors.mid.secondary,
}));

const StyledButton = styled("button")(({ theme }) => ({
  appearance: "none",
  border: "none",
  cursor: "pointer",

  display: "flex",
  gap: "0.65rem",
  padding: "0.65rem",
  borderColor: theme.colors.text,
  borderStyle: "solid",
  borderWidth: "1px",
  borderRadius: "0.25rem",
  backgroundColor: theme.colors.foreground,
  alignItems: "center",
  fontSize: "0.85rem",
  fontWeight: "500",
  // textWrap: "noWrap",
  overflow: "hidden",
  // whiteSpace: "nowrap",

  transition: "transform 0.1s ease",
  transformOrigin: "bottom center",

  "&:hover": {
    transform: "translateY(-2px) scale(1.005)",
  },

  "&::after": {
    content: '"⟠"',
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
}));

const IconSpan = styled("span")({
  flexShrink: 0,
  fontSize: "1.5rem",
});

const ContentSpan = styled("span")({
  textAlign: "left",
  textTransform: "uppercase",
  letterSpacing: "0.015em",
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

const CountSpan = styled("span")(({ theme }) => ({
  fontSize: "0.75rem",
  backgroundColor: "#FEE272",
  color: "black",
  width: "1.5rem",
  height: "1.5rem",
  borderRadius: "0.75rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
}));

// Dialog
const StyledDialog = styled(Dialog)({
  position: "relative",
  zIndex: "50",
});

const DialogInner = styled("div")(({ theme }) => ({
  position: "fixed",
  bottom: "0.5rem",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: theme.colors.mid.secondary,
  padding: "1rem 0.75rem 1.75rem",
  width: "calc(100% - 1rem)",
  maxWidth: "30rem",
  borderRadius: "0.25rem",

  maxHeight: "calc(100dvh - 1rem)",
  overflowY: "scroll",

  "@media (min-height: 768px)": {
    transform: "translateX(-50%) translateY(50%)",
    top: "50%",
    bottom: "unset",
    transform: "translate(-50%, -50%)",
  },
}));

const StyledDialogPanel = styled(DialogPanel)({
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
  opacity: "95%",
}));

const StyledDialogBackdropTwo = styled(DialogBackdrop)({
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backdropFilter: "grayscale(96%) sepia(30%)",
});

function FancyDropdown({
  icon = "•",
  label,
  fillSpace = false,
  count,
  children,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  function open() {
    console.log("opening...");
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
        {count && <CountSpan>{count}</CountSpan>}
      </StyledButton>

      <StyledDialog open={isOpen} onClose={() => setIsOpen(false)}>
        <StyledDialogBackdropOne />
        <StyledDialogBackdropTwo />
        <DialogInner>
          <StyledDialogPanel transition>
            <DialogHeader>
              <Button onClick={close}>Close</Button>
              {/* <DialogTitle>Sport and competitions</DialogTitle> */}
            </DialogHeader>
            {children}
          </StyledDialogPanel>
        </DialogInner>
      </StyledDialog>
    </>
  );
}

export default FancyDropdown;
