import Image from "next/image";
import Fixture from "@/components/Fixture";
import styles from "./page.module.css";

import { demoFixtures } from "@/data/demo/fixtures";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h2>Fixtures</h2>
        {demoFixtures.map((fixture) => (
          <Fixture key={fixture.id} {...fixture} />
        ))}
      </main>
    </div>
  );
}
