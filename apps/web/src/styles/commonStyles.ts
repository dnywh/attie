import { css } from "next-yak";
import { webTheme } from "@/styles/theme.yak";

export const fieldInputStyle = css`
  outline: none;
  padding: 0.75rem;
`;

export const fieldsetGroupStyle = css`
  background-color: ${webTheme.colors.background.foremost};
  border: 1px solid ${webTheme.colors.text.primary};
  display: flex;
  flex-direction: column;

  &:focus-within {
    box-shadow: 0 0 0 2px ${webTheme.colors.shadow};
  }
`;

export const ellipsizedText = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const smallText = css`
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  line-height: 100%;
  text-transform: uppercase;
`;

export const mediumText = css`
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.075em;
  line-height: 100%;
  text-transform: uppercase;
`;

export const teamText = css`
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.055em;
  line-height: 100%;
  text-transform: uppercase;
`;

export const cardStippledBackground = css`
  background:
    repeating-linear-gradient(
      to right,
      transparent,
      transparent 2px,
      ${webTheme.colors.background.card} 2px,
      ${webTheme.colors.background.card} 4px
    ),
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 2px,
      ${webTheme.colors.background.card} 2px,
      ${webTheme.colors.background.card} 4px
    ),
    color-mix(in hsl, ${webTheme.colors.background.card}, black 2.5%);
`;

export const interstitialStippledBackground = css`
  background:
    repeating-linear-gradient(
      to right,
      transparent,
      transparent 2px,
      ${webTheme.colors.background.interstitial} 2px,
      ${webTheme.colors.background.interstitial} 4px
    ),
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 2px,
      ${webTheme.colors.background.interstitial} 2px,
      ${webTheme.colors.background.interstitial} 4px
    ),
    color-mix(
      in hsl,
      ${webTheme.colors.background.interstitial},
      black 2.5%
    );
`;

export const dashedBorder = css`
  background-blend-mode: overlay;
  background-color: ${webTheme.colors.background.page};
  background-image:
    none,
    repeating-linear-gradient(
      90deg,
      rgb(255 255 255 / 30%),
      rgb(255 255 255 / 30%) 3px,
      transparent 3px,
      transparent 6px,
      rgb(0 0 0 / 95%) 1.25rem
    );
  background-repeat: no-repeat;
  background-size: 0 100%, 100% 1.5px, 0 100%, 100% 0;
  padding-top: 1.5rem;
`;

export const veryBasicCardStyle = css`
  border: 1px solid ${webTheme.colors.text.primary};
  border-radius: 3px;
  box-shadow: 0 4px 0 0 ${webTheme.colors.text.primary};
`;

export const bleedingWhiteCard = css`
  background-color: ${webTheme.colors.background.foremost};
  border: 1px solid ${webTheme.colors.text.primary};
  border-radius: 2px;
  box-shadow: 0.5px 1.5px 0 0 ${webTheme.colors.background.foremost};
`;
