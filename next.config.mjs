import { withPigment, extendTheme } from '@pigment-css/nextjs-plugin';

/** @type {import('next').NextConfig} */


const nextConfig = {
    images: {
        // Increase expiration (Max Age) of cache
        // https://vercel.com/docs/image-optimization#remote-images-cache-key
        // https://vercel.com/docs/image-optimization/managing-image-optimization-costs
        // https://nextjs.org/docs/app/api-reference/components/image#caching-behavior
        minimumCacheTTL: 2678400, // 31 days (has no effect if `Image` components have `unoptimized` set)
        qualities: [25], // TODO: Can this be lowered if the images are heavily stylised, i.e. halftoned? Has no effect with `unoptimized` set
        // Define where remote images can be pulled from
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'crests.football-data.org', // Football logos
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'interstate21.com', // NBA logos
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'a1.espncdn.com', // NBA logos
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'a.espncdn.com', // NRL logos
                port: '',
            },
        ],
    },
};

export default withPigment(nextConfig, {
    theme: extendTheme({
        curves: {
            // Transforms (physical movement)
            spring: {
                light: "cubic-bezier(0.175, 0.885, 0.32, 1.055)",
                heavy: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            },
            // Opacity (fades)
            ease: {
                basic: "ease",
            },
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
                live: "red",
            },
            shadow: "rgba(0,0,0,0.1)"
        }
    })
});
