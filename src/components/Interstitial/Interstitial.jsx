import Link from "next/link";
import Image from "next/image";
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
  marginTop: "3.25rem",
  ...veryBasicCardStyle({ theme }),
  ...createStippledBackground({ fill: theme.colors.background.interstitial })({
    theme,
  }),

  position: "relative",
  "&::after": {
    position: "absolute",
    content: '""',
    width: "100%",
    height: "88px",
    left: 0,
    top: "-67px",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "55%",
    backgroundImage: "url('/images/boys-test-a.png')",
  },

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
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1.5rem",

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

        <Inner>
          <Image
            src="/images/eye.svg"
            width={64}
            height={64}
            alt="An eye shape with an at-symbol instead of a pupil"
          />
          {children}
        </Inner>
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
