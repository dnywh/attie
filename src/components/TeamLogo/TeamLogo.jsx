import Image from "next/image";
import { styled } from "@pigment-css/react";

const CONTAINER_SIZE = 32;
const SCALE = 1.65;
const PHYSICAL_SIZE = CONTAINER_SIZE * 2;
const ROTATION = 15;

const Container = styled("div")(({ theme }) => ({
  border: "1px solid black",
  borderRadius: "2px",
  overflow: "hidden",
  width: `${CONTAINER_SIZE}px`,
  height: `${CONTAINER_SIZE}px`,
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
        background: theme.colors.background.focus,
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

function TeamLogo({ src, alt, isHomeTeam, isKnown = true }) {
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
          priority
        />
      )}
    </Container>
  );
}

export default TeamLogo;
