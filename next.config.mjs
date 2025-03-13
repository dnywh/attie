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
            background: "#FA6565",
            mid: {
                primary: "#FEE272", // Yellow cards
                secondary: "#AEF4F5", // Blue interstitials
                tertiary: "#D8D4C4", // Brown/gray cards
                quaternary: "rgb(245, 245, 245)" // TBD team crests
            },
            foreground: "#FFFFFF",
            text: {
                primary: "#000000",
                tertiary: "rgb(128, 128, 128)", // TBD team names
            },
            shadow: "rgba(0,0,0,0.1)"
        }
    })
});
