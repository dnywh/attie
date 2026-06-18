"use client";

import { styled } from "next-yak";
import { dispatchFixtureRefresh } from "@/utils/fixtureRefreshEvents";

const LogoButton = styled.button`
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  background: transparent;
  border: 0;
  inset: 0;
  padding: 0;
  position: absolute;

  &:focus-visible {
    outline: none;
  }
`;

function FixturesHeaderRefreshButton() {
  return (
    <LogoButton
      aria-label="Refresh fixtures"
      onClick={dispatchFixtureRefresh}
      type="button"
    />
  );
}

export default FixturesHeaderRefreshButton;
