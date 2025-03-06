import FixturesClient from "@/components/FixturesClient";
import { styled } from "@pigment-css/react";

const Header = styled("header")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",

  "& h1": {
    fontSize: "clamp(5rem, 14vw, 10rem)",
  },

  "& p": {
    marginTop: "-0.75rem",
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
    textWrap: "balance",
    lineHeight: "120%",
  },
});

export default function Home() {

  return (
    <>
      <Header>
        <h1>Attie</h1>
        <p>The anti-scores scores app.</p>
      </Header>

      <FixturesClient />
    </>
  );
}
