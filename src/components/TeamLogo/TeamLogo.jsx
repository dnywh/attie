import Image from "next/image";

const SIZE = 32;

function TeamLogo({ src }) {
  return (
    <Image src={src} alt="Next.js logo" width={SIZE} height={SIZE} priority />
  );
}

export default TeamLogo;
