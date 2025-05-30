import { useState } from "react";
import Image from "next/image";
import { styled } from "@pigment-css/react";

const CONTAINER_SIZE = 32;
const SCALE = 1.65;
const PHYSICAL_SIZE = CONTAINER_SIZE * 2;
const ROTATION = 15;

const Container = styled("div")(({ theme }) => ({
  flexShrink: 1, // Prefer to keep the score dot sized and shrink this instead
  border: "1px solid black",
  borderRadius: "2px",
  overflow: "hidden",
  width: `${CONTAINER_SIZE}px`,
  aspectRatio: "1 / 1", // Keeps it square, even when shrinking
  variants: [
    {
      props: { "data-orientation": "home" },
      style: {
        "& img": {
          transform: `rotate(${ROTATION}deg) scale(${SCALE})`,
        },
      },
    },
    {
      props: { "data-orientation": "away" },
      style: {
        "& img": {
          transform: `rotate(${ROTATION * -1}deg) scale(${SCALE})`,
        },
      },
    },
    {
      props: { isKnown: true },
      style: {
        background: theme.colors.background.foremost,
      },
    },
    {
      props: { isKnown: false },
      style: {
        background: theme.colors.background.crest,
      },
    },
  ],
}));

const StyledImage = styled(Image)({
  width: `auto`,
  height: `auto`,
});

function TeamLogo({ src, alt, isHomeTeam, isKnown: initialIsKnown = true }) {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  // Combine the initial isKnown prop with the image load state
  const isKnown = initialIsKnown && !imageLoadFailed;

  return (
    <Container
      data-orientation={isHomeTeam ? "home" : "away"}
      isKnown={isKnown}
    >
      {isKnown && (
        <StyledImage
          src={src}
          alt={alt}
          width={PHYSICAL_SIZE}
          height={PHYSICAL_SIZE}
          unoptimized // As our images are quite small
          onError={() => {
            console.warn(
              `Failed to load team logo, falling back to base TeamLogo styles.\nSource: ${src}`
            );
            setImageLoadFailed(true);
          }}
        />
      )}
    </Container>
  );
}

export default TeamLogo;
