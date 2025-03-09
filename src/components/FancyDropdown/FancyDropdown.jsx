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
import { styled } from "@pigment-css/react";

const StyledButton = styled("button")({
  appearance: "none",
  border: "none",

  cursor: "pointer",

  display: "flex",
  gap: "0.65rem",
  padding: "0.65rem",
  // borderColor: "black",
  // borderStyle: "solid",
  // borderWidth: "1px",
  backgroundColor: "rgb(240, 240, 240)",
  alignItems: "center",
  fontSize: "0.85rem",
  // textWrap: "noWrap",
  overflow: "hidden",
  // whiteSpace: "nowrap",

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
});

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

// Dialog
const StyledDialog = styled(Dialog)({
  position: "relative",
  zIndex: "50",
});

const DialogInner = styled("div")({
  position: "fixed",
  bottom: "0.5rem",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "white",
  padding: "2rem",
  width: "calc(100% - 1rem)",
  maxWidth: "30rem",
  borderRadius: "0.25rem",
});

const StyledDialogBackdropOne = styled(DialogBackdrop)({
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "#FA6565",
  opacity: "95%",
});

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
          <DialogPanel transition>
            <header>
              <button onClick={close}>Close</button>
              {/* <DialogTitle>Sport and competitions</DialogTitle> */}
            </header>
            {children}
          </DialogPanel>
        </DialogInner>
      </StyledDialog>
    </>
  );
}

export default FancyDropdown;
