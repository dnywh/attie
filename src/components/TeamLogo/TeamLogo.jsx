import Image from "next/image";

function TeamLogo({ src }) {
  return <Image src={src} alt="Next.js logo" width={28} height={28} priority />;
}

export default TeamLogo;
