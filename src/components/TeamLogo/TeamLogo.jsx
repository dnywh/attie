import Image from "next/image";

function TeamLogo({ src }) {
  return <Image src={src} alt="Next.js logo" width={24} height={24} priority />;
}

export default TeamLogo;
