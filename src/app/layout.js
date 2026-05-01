import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { siteConfig } from "@/config/site";
import { SoundProvider } from "@/contexts/SoundContext";
import FixturesHeader from '@/components/FixturesHeader';
import { COMPETITIONS } from '@/constants/competitions';
import './theme.css';

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.name}: ${siteConfig.byline}`,
  description: siteConfig.description,
  keywords: [
    ...siteConfig.meta.keywords,
    ...Object.values(COMPETITIONS).map(comp => `${comp.name} results`),
  ],
  openGraph: {
    title: `${siteConfig.name}: ${siteConfig.byline}`,
    type: "website",
    description: siteConfig.description,
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SoundProvider>
          <FixturesHeader />
          {children}
        </SoundProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
