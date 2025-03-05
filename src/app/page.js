
import FixturesClient from "@/components/FixturesClient";
import styles from "./page.module.css";

import localMatches from "@/data/demo/local_matches.json";


// import { demoFixtures } from "@/data/demo/fixtures";

async function getFixtures() {
  // const response = await fetch("@/data/demo/fixtures");
  // const data = await response.json();
  return localMatches.matches;
}

// getFixtures().then((fixtures) => {
//   console.log(fixtures);
// });
export default async function Home() {
  const demoFixtures = await getFixtures();

  return (
    <div className={styles.page}>

      <header>
        <h1>Attie</h1>
        <p>The anti-scores scores app.</p>
      </header>

      <main className={styles.main}>


        <FixturesClient fixtures={demoFixtures} />
      </main>
    </div >
  );
}
