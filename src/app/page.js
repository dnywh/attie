import FixturesClient from "@/components/FixturesClient";

export default function Home() {

  return (
    <>
      <header>
        <h1>Attie</h1>
        <p>The anti-scores scores app.</p>
      </header>

      <main>
        <FixturesClient />
      </main>
    </>
  );
}
