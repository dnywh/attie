// @ts-nocheck
import { siteConfig } from "@/config/site";
import { styled, keyframes } from "next-yak";

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

function FixturesHeader() {
  return (
    <Header>
      <h1>
        Atti<span>e</span>
      </h1>
      <p>{siteConfig.byline}</p>
    </Header>
  );
}

export default FixturesHeader;
