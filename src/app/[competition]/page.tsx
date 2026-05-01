import { redirect } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import FixturesClient from "@/components/FixturesClient";
import { COMPETITIONS, isCompetitionKey } from "@/constants/competitions";
import { siteConfig } from "@/config/site";
import { SPORTS } from "@/config/sportConfig";
import { DEFAULTS } from "@/constants/defaults";

interface CompetitionPageProps {
  params: Promise<{
    competition: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(COMPETITIONS).map((competitionKey) => ({
    competition: competitionKey,
  }));
}

export async function generateMetadata({
  params,
}: CompetitionPageProps): Promise<Metadata> {
  const { competition } = await params;

  if (!isCompetitionKey(competition)) {
    return {
      title: `${siteConfig.name}: ${siteConfig.byline}`,
      description: siteConfig.description,
    };
  }

  const selectedCompetition = COMPETITIONS[competition];
  const sportConfig = SPORTS[selectedCompetition.sport];
  const selectedSport =
    "localName" in sportConfig ? sportConfig.localName : sportConfig.name;

  const pageTitle = `Attie: ${selectedCompetition.name} results without the scores`;
  const pageDescription = `See who played ${selectedSport.toLowerCase()} recently without spoiling the results. Attie shows ${selectedCompetition.name} games with scores hidden by default.`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      ...siteConfig.meta.keywords,
      `${selectedCompetition.name} results`,
      `${selectedSport} results`,
    ],
    openGraph: {
      title: pageTitle,
      type: "website",
      description: pageDescription,
      siteName: siteConfig.name,
      url: `${siteConfig.url}/${competition}`,
    },
  };
}


export default async function CompetitionPage({ params }: CompetitionPageProps) {
  const { competition } = await params;

  if (!isCompetitionKey(competition)) {
    redirect("/");
  }

  const selectedCompetitionParams = {
    competitions: [competition],
    sport: COMPETITIONS[competition].sport,
    direction: DEFAULTS.DIRECTION,
  };

  return (
    <Suspense>
      <FixturesClient initialParams={selectedCompetitionParams} />
    </Suspense>
  );
}
