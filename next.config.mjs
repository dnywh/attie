import { withPigment, extendTheme } from '@pigment-css/nextjs-plugin';

/** @type {import('next').NextConfig} */


const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'crests.football-data.org',
                port: '',
            },
        ],
    },
};

export default withPigment(nextConfig, {
    theme: extendTheme({
        curves: {
            // Transforms (physical movement)
            springy: "180ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            // Opacity (fades)
            smooth: "200ms ease",
        },
        colors: {
            background: {
                page: "#FA6565", // Pink page
                card: "#FEE272", // Yellow cards
                interstitial: "#AEF4F5", // Blue interstitials
                informational: "#D8D4C4", // Brown/gray cards
                crest: "rgb(245, 245, 245)", // TBD team crests
                foremost: "#FFFFFF", // White
                focus: {
                    hover: "hsl(48deg 99% 96%)", // Light shade of same yellow as colors.background.card
                    active: "hsl(48deg 99% 92%)", // Slighter darker shade of above
                },
            },
            text: {
                primary: "#000000",
                tertiary: "rgb(128, 128, 128)", // TBD team names
            },
            shadow: "rgba(0,0,0,0.1)"
        }
    })
});
