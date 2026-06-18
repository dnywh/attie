import { siteConfig } from "@/config/site";
import { styled, keyframes } from "next-yak";
import { webTheme } from "@/styles/theme.yak";
import FixturesHeaderRefreshButton from "./FixturesHeaderRefreshButton";
import FixturesHeaderRefreshStatus from "./FixturesHeaderRefreshStatus";

const scrollFade = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }

  to {
    opacity: 0;
    transform: scale(0.8);
  }
`;

const Header = styled.header`
  align-items: center;
  color: white;
  display: flex;
  flex-direction: column;
  font-style: italic;
  text-align: center;
  text-transform: lowercase;
  user-select: none;

  & h1 {
    -webkit-text-stroke: 5px black;
    font-size: clamp(5rem, 20vw, 10rem);
    letter-spacing: -0.035em;
    line-height: 100%;
    paint-order: stroke fill;
    text-shadow:
      0 1px 0 black,
      1px 2px 0 black,
      2px 3px 0 black,
      3px 4px 0 black,
      3px 5px 0 black,
      3px 6px 0 black;

    & span {
      margin-left: -0.015em;
    }
  }

  & p {
    -webkit-text-stroke: 2px black;
    font-size: 1.0625rem;
    font-weight: 500;
    line-height: 120%;
    paint-order: stroke fill;
    text-shadow:
      1px 1px 0 black,
      2px 2px 0 black;
    text-wrap: balance;
  }

  @supports (animation-timeline: scroll()) {
    animation: ${scrollFade} linear both;
    animation-range: 0 6rem;
    animation-timeline: scroll();
    position: sticky;
    top: 0;
  }
`;

const Wordmark = styled.div`
  display: inline-block;
  opacity: 1;
  position: relative;
  transition:
    opacity 160ms ease,
    transform 240ms ${webTheme.curves.spring.heavy};

  & h1 {
    transition: color 120ms ease;
  }

  &:hover {
    opacity: 0.9;
    transform: scale(0.975);

    & h1 {
      color: ${webTheme.colors.background.focus.hover};
    }
  }

  &:active {
    transform: scale(0.9);
  }

  &:has(button:focus-visible) {
    outline: 3px solid currentColor;
    outline-offset: 0.25rem;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:hover,
    &:active {
      transform: none;
    }
  }
`;

const Byline = styled.div`
  min-height: 1.275rem;
  position: relative;

  & .default-byline {
    transition: opacity 160ms ease;
  }

  &[data-header-refresh-status="refreshing"] .default-byline,
  &[data-header-refresh-status="done"] .default-byline {
    opacity: 0;
  }
`;

function FixturesHeader() {
  return (
    <Header>
      <Wordmark>
        <h1>
          Atti<span>e</span>
        </h1>
        <FixturesHeaderRefreshButton />
      </Wordmark>
      <Byline data-header-refresh-status="idle">
        <p className="default-byline">{siteConfig.byline}</p>
        <FixturesHeaderRefreshStatus />
      </Byline>
    </Header>
  );
}

export default FixturesHeader;
