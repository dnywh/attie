import Link from "next/link";
import { styled } from "@pigment-css/react";
import {
  smallText,
  veryBasicCardStyle,
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
  backgroundColor: theme.colors.background.interstitial,
  ...veryBasicCardStyle({ theme }),

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
    transition: `transform ${theme.curves.springy}`,
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
      transition: `opacity ${theme.curves.smooth}, transform ${theme.curves.springy}`,
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
            href={`${linkUrl}?ref=attie&utm_medium=sponsorship`}
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
