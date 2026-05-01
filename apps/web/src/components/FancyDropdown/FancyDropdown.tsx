"use client";
import { useState, type PropsWithChildren, type ReactNode } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import Button from "@/components/Button";
import CountDot from "@/components/CountDot";
import DropdownIcon from "@/components/DropdownIcon";
import FootballIcon from "@/components/FootballIcon";
import { css, styled, keyframes } from "next-yak";
import {
  veryBasicCardStyle,
  interstitialStippledBackground,
  mediumText,
  ellipsizedText,
} from "@/styles/commonStyles";
import { webTheme } from "@/styles/theme.yak";

const scrollShadow = keyframes`
  from {
    border-bottom: none;
    box-shadow: none;
  }

  to {
    border-bottom: 1px solid var(--header-border-color);
    box-shadow: 0 4px 0 0 var(--header-shadow-color);
  }
`;

const DialogHeader = styled.header`
  ${interstitialStippledBackground};
  display: flex;
  flex-direction: row-reverse;
  min-height: 3rem;
  padding: 0 0.75rem;
  position: sticky;
  top: 0;
  z-index: 1;

  @supports (animation-timeline: scroll()) {
    --header-border-color: ${webTheme.colors.text.primary};
    --header-shadow-color: ${webTheme.colors.shadow};
    animation: ${scrollShadow} linear both;
    animation-range: 0 0.5rem;
    animation-timeline: scroll();
  }
`;

const fillButtonStyles = css`
  flex-grow: 1;
`;

const fixedButtonStyles = css`
  flex-shrink: 0;
`;

const StyledButton = styled.button<{ $fillSpace: boolean }>`
  ${mediumText};
  align-items: center;
  background-color: ${webTheme.colors.background.foremost};
  border: 1px solid ${webTheme.colors.text.primary};
  border-radius: 2px;
  box-shadow: 0.5px 1.5px 0 0 ${webTheme.colors.background.foremost};
  color: ${webTheme.colors.text.primary};
  display: flex;
  gap: 0.65rem;
  height: 2.5rem;
  overflow: hidden;
  padding: 0 2rem 0 0.5rem;
  position: relative;
  transition: transform 150ms ${webTheme.curves.spring.light};
  ${({ $fillSpace }) => ($fillSpace ? fillButtonStyles : fixedButtonStyles)}

  &:hover {
    transform: translateY(-1.5px) scale(1.005);
  }

  &:active {
    @media (pointer: coarse) {
      transform: translateY(0) scale(0.965);
    }
  }
`;

const IconSpan = styled.span`
  flex-shrink: 0;
  font-size: 1.5rem;
`;

const fillContentStyles = css`
  ${ellipsizedText};
  flex-grow: 1;
`;

const ContentSpan = styled.span<{ $fillSpace: boolean }>`
  text-align: left;
  ${({ $fillSpace }) => ($fillSpace ? fillContentStyles : "")}
`;

// Dialog styles
const StyledDialog = styled(Dialog)`
  position: relative;
  z-index: 50;
`;

const StyledDialogPanel = styled(DialogPanel)`
  ${veryBasicCardStyle};
  ${interstitialStippledBackground};
  border-radius: 0.25rem;
  bottom: calc(0.5rem + 4px);
  left: 50%;
  max-height: calc(100dvh - 5rem);
  max-width: 30rem;
  overflow-y: scroll;
  padding: 0 0 1.75rem;
  position: fixed;
  transform: translateX(-50%) translateY(0) rotate(0deg);
  transition:
    opacity 50ms ease,
    transform 150ms ${webTheme.curves.spring.light};
  width: calc(100% - 1rem);

  &[data-closed] {
    opacity: 0;
    transform: translateX(-50%) translateY(15%) rotate(0deg);
  }

  @media (min-height: 960px) {
    bottom: unset;
    top: 50%;
    transform: translateX(-50%) translateY(-50%) rotate(0deg);
    transition:
      opacity 50ms ease,
      transform 300ms cubic-bezier(0, 0.5, 0, 1);

    &[data-closed] {
      transform: translateX(-50%) translateY(calc(-50% + 2.5rem))
        rotate(-3.5deg);
    }
  }
`;

// Required so padding can be separate from sticky header
const DialogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 0.75rem;
`;

const StyledDialogBackdropOne = styled(DialogBackdrop)`
  background-color: ${webTheme.colors.background.page};
  bottom: 0;
  left: 0;
  opacity: 0.95;
  position: fixed;
  right: 0;
  top: 0;
  transition: opacity 150ms ease;

  &[data-closed] {
    opacity: 0;
  }
`;

const StyledDialogBackdropTwo = styled(DialogBackdrop)`
  backdrop-filter: grayscale(96%) sepia(30%) opacity(1);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  transition: opacity 150ms ease;

  &[data-closed] {
    opacity: 0;
  }
`;

interface FancyDropdownProps {
  icon?: ReactNode;
  label?: string;
  fillSpace?: boolean;
  count?: number;
}

function FancyDropdown({
  icon = <FootballIcon />,
  label,
  fillSpace = false,
  count,
  children,
}: PropsWithChildren<FancyDropdownProps>) {
  const [isOpen, setIsOpen] = useState(false);
  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <StyledButton $fillSpace={fillSpace} onClick={open}>
        <IconSpan>{icon}</IconSpan>
        {label && <ContentSpan $fillSpace={fillSpace}>{label}</ContentSpan>}
        {typeof count === "number" && count > 0 && (
          <CountDot>{count > 9 ? "9+" : count}</CountDot>
        )}
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
