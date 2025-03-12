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
                primary: "#FEE272",
                secondary: "#AEF4F5",
            },
            foreground: "#FFFFFF",
            text: "#000000",
            shadow: "rgba(0,0,0,0.1)"
        }
    })
});
