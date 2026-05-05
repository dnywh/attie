import { curves, spacing, typography } from "./tokens.ts";

const cssVar = (name: string) => `var(${name})`;

export const webTheme = {
  colors: {
    background: {
      page: cssVar("--color-background-page"),
      card: cssVar("--color-background-card"),
      interstitial: cssVar("--color-background-interstitial"),
      informational: cssVar("--color-background-informational"),
      crest: cssVar("--color-background-crest"),
      foremost: cssVar("--color-background-foremost"),
      focus: {
        hover: cssVar("--color-background-focus-hover"),
        active: cssVar("--color-background-focus-active"),
      },
      heading: cssVar("--color-background-heading"),
    },
    border: {
      page: cssVar("--color-border-page"),
    },
    text: {
      primary: cssVar("--color-text-primary"),
      page: cssVar("--color-text-page"),
      heading: cssVar("--color-text-heading"),
      tertiary: cssVar("--color-text-tertiary"),
      live: cssVar("--color-text-live"),
    },
    shadow: cssVar("--color-shadow"),
  },
  curves,
  spacing,
  typography,
};
