// Supports weights 100-900
import '@fontsource-variable/jost/wght-italic.css';
import { Analytics } from "@vercel/analytics/react"
import { globalCss, styled } from "@pigment-css/react";
import '@pigment-css/react/styles.css';

export const metadata = {
  title: "Attie",
  description: "The anti-score scores app.",
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
  text-wrap: balance;
}
h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}

// Custom styles

ul, ol {
  list-style: none;
  margin: 0;
  padding: 0;
}

fieldset {
  border: none;
  margin: 0;
  padding: 0;
}

p a {
  color: inherit;
}

button {
  appearance: none;
  border: none;
  color: unset;
  background: none;
  cursor: pointer;
  }
`

const Body = styled("body")({
  fontFamily: "'Jost Variable', Futura, Helvetica, Arial, sans-serif",
  padding: "2rem 1rem",
  maxWidth: "40rem",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "3rem",
  backgroundColor: "#FA6565",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Body>
        {children}
        <Analytics />
      </Body>
    </html>
  );
}
