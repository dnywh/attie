import Link from "next/link";
import { styled } from "@pigment-css/react";
import {
  smallText,
  veryBasicCardStyle,
  createStippledBackground,
  bleedingWhiteCard,
  dashedBorder,
} from "@/styles/commonStyles";

const Aside = styled("aside")(({ theme }) => ({
  ...dashedBorder({ theme }),
}));

const Visible = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "0.65rem",
  padding: "1rem",
  ...veryBasicCardStyle({ theme }),
  ...createStippledBackground({ fill: theme.colors.background.interstitial })({
    theme,
  }),

  "& > h2, & > a": {
    ...smallText,
    textAlign: "center",
  },

  "& > h2": {
    fontWeight: "500",
  },

  // Link outside of inner content (at very bottom)
  "& > a": {
    fontStyle: "italic",
    fontWeight: "600",
    transition: `transform 180ms ${theme.curves.spring.heavy}`,
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
}));

const Inner = styled("div")(({ theme }) => ({
  padding: "2.5rem 1.25rem",
  ...bleedingWhiteCard({ theme }),

  "& > p": {
    textAlign: "center",
    // Links within paragraph text
    "& > a": {
      fontStyle: "italic",
      fontWeight: "600",
      transition: `opacity 200ms ${theme.curves.ease.basic}, transform 180ms ${theme.curves.spring.heavy}`,
      "&:hover": {
        opacity: "0.5",
      },
    },
  },
}));

function Interstitial({
  intro = "Did you know?",
  linkUrl,
  linkText,
  children,
}) {
  return (
    <Aside>
      <Visible>
        <h2>{intro}</h2>
        <Inner>{children}</Inner>
        {linkUrl && (
          <Link
            href={`${linkUrl}?utm_source=attie&utm_medium=sponsorship`}
            target="_blank"
          >
            {linkText ? linkText : "Learn more"}
          </Link>
        )}
      </Visible>
    </Aside>
  );
}

export default Interstitial;
