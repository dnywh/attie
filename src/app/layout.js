import "./globals.css";
import { globalCss, styled } from "@pigment-css/react";
import '@pigment-css/react/styles.css';

export const metadata = {
  title: "Attie",
  description: "The anti-scores scores app.",
};

globalCss`
// https://www.joshwcomeau.com/css/custom-css-reset/

/* 1. Use a more-intuitive box-sizing model */
*, *::before, *::after {
  box-sizing: border-box;
}

/* 2. Remove default margin */
* {
  margin: 0;
}

body {
  /* 3. Add accessible line-height */
  line-height: 1.5;
  /* 4. Improve text rendering */
  -webkit-font-smoothing: antialiased;
}

/* 5. Improve media defaults */
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

/* 6. Inherit fonts for form controls */
input, button, textarea, select {
  font: inherit;
}

/* 7. Avoid text overflows */
p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}

/* 8. Improve line wrapping */
p {
  text-wrap: pretty;
}
h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}

// Custom styles
body {
  font-family: Arial, Helvetica, sans-serif;
}

ul, ol {
  list-style: none;
  margin: 0;
  padding: 0;
}
`

const Body = styled("body")({
  padding: "1rem",
  maxWidth: "40rem",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "3rem",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Body>
        {children}
      </Body>
    </html>
  );
}
