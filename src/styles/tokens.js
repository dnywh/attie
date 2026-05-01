export const palette = {
  black: {
    100: "#000000",
  },
  white: {
    100: "#FFFFFF",
  },
  attie: {
    page: "#FA6565",
    card: "#FEE272",
    interstitial: "#AEF4F5",
    informational: "#D8D4C4",
    crest: "rgb(245, 245, 245)",
    focusHover: "hsl(48deg 99% 96%)",
    focusActive: "hsl(48deg 99% 92%)",
    tertiaryText: "rgb(128, 128, 128)",
    live: "red",
    shadow: "rgba(0,0,0,0.1)",
  },
  night: {
    page: "#181A2A",
    card: "#D8BD4F",
    interstitial: "#286B74",
    informational: "#59564C",
    crest: "rgb(45, 47, 54)",
    foremost: "#F7F3E7",
    focusHover: "hsl(48deg 56% 24%)",
    focusActive: "hsl(48deg 56% 30%)",
    primaryText: "#080808",
    tertiaryText: "rgb(92, 92, 92)",
    live: "#FF5A5A",
    shadow: "rgba(0,0,0,0.28)",
  },
};

export const curves = {
  spring: {
    light: "cubic-bezier(0.175, 0.885, 0.32, 1.055)",
    heavy: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  ease: {
    basic: "ease",
  },
};

export const spacing = {
  pagePaddingY: "2rem",
  pagePaddingX: "0.75rem",
  pageGap: "3rem",
  pageMaxWidth: "40rem",
};

export const typography = {
  bodyFont: "'Jost Variable', Futura, Helvetica, Arial, sans-serif",
};

export const themeMeta = {
  manifestBackground: palette.attie.page,
};
