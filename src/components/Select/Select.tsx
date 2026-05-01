// @ts-nocheck
import { Select as HeadlessSelect } from "@headlessui/react";
import DropdownIcon from "@/components/DropdownIcon";
import {
  bleedingWhiteCard,
  teamText,
  ellipsizedText,
} from "@/styles/commonStyles";
import { styled } from "next-yak";
import { webTheme } from "@/styles/theme.yak";

function Select({ children, ...props }) {
  return (
    <Wrapper>
      <StyledSelect {...props}>{children}</StyledSelect>
      <DropdownIcon />
    </Wrapper>
  );
}

export default Select;

const StyledSelect = styled(HeadlessSelect)`
  /* https://moderncss.dev/custom-select-styles-with-pure-css/ */
  appearance: none;
  background-color: transparent;
  border: none;
  color: inherit;
  cursor: inherit;
  font-family: inherit;
  font-size: inherit;
  height: 3rem;
  line-height: inherit;
  margin: 0;
  outline: none;
  padding: 0 2rem 0 0.5rem;
  width: 100%;
  ${ellipsizedText};
  ${teamText};
`;

const Wrapper = styled.div`
  ${bleedingWhiteCard};
  background: ${webTheme.colors.background.foremost};
  color: ${webTheme.colors.text.primary};
  position: relative;

  transition: transform 180ms ${webTheme.curves.spring.heavy};

  &:hover {
    background: ${webTheme.colors.background.focus.hover};
    transform: scale(1.005);
  }

  &:active {
    transform: translateY(0) scale(0.965);
  }

  &:focus-within {
    background: ${webTheme.colors.background.focus.active};
    box-shadow: 0 0 0 2px ${webTheme.colors.shadow};
  }
`;
