import { useState } from "react";
import Image from "next/image";
import { css, styled } from "next-yak";
import { webTheme } from "@/styles/theme.yak";

const CONTAINER_SIZE = 32;
const SCALE = 1.65;
const PHYSICAL_SIZE = CONTAINER_SIZE * 2;
const ROTATION = 15;

const knownLogoStyles = css`
  background: ${webTheme.colors.background.foremost};
`;

const unknownLogoStyles = css`
  background: ${webTheme.colors.background.crest};
`;

const Container = styled.div<{ $isKnown: boolean }>`
  aspect-ratio: 1 / 1;
  border: 1px solid black;
  border-radius: 2px;
  flex-shrink: 1;
  overflow: hidden;
  width: ${CONTAINER_SIZE}px;
  ${({ $isKnown }) => ($isKnown ? knownLogoStyles : unknownLogoStyles)}

  &[data-orientation="home"] img {
    transform: rotate(${ROTATION}deg) scale(${SCALE});
  }

  &[data-orientation="away"] img {
    transform: rotate(${ROTATION * -1}deg) scale(${SCALE});
  }
`;

const StyledImage = styled(Image)`
  height: auto;
  width: auto;
`;

interface TeamLogoProps {
  src: string;
  alt: string;
  isHomeTeam: boolean;
  isKnown?: boolean;
}

function TeamLogo({
  src,
  alt,
  isHomeTeam,
  isKnown: initialIsKnown = true,
}: TeamLogoProps) {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  // Combine the initial isKnown prop with the image load state
  const isKnown = initialIsKnown && !imageLoadFailed;

  return (
    <Container
      data-orientation={isHomeTeam ? "home" : "away"}
      $isKnown={isKnown}
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
