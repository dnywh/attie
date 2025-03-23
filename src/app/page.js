import FixturesClient from "@/components/FixturesClient";

export default async function Home({ searchParams }) {
  // Parse the search params into the format expected by FixturesClient
  const params = await searchParams;
  const initialParams = {
    sport: params?.sport,
    competitions: params?.competitions?.split(','),
    direction: params?.direction
  };

  return (
    // FixturesHeader in shared layout
    // If passing custom props to header, uncomment and set props:
    // <FixturesHeader />
    <FixturesClient initialParams={initialParams} />
  );
}
