import { Suspense } from 'react';
import FixturesClient from "@/components/FixturesClient";

export default function Home() {
  return (
    // FixturesHeader in shared layout
    // If passing custom props to header, uncomment and set props:
    // <FixturesHeader />
    <Suspense>
      {/* Fallback (i.e. loading) is handled inside FixturesClient */}
      <FixturesClient />
    </Suspense>
  );
}
