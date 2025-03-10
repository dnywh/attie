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
        colors: {
            background: "#FE0101",
            mid: {
                primary: "#FEE272",
                secondary: "#AEF4F5",
            },
            foreground: "#FFFFFF",
            text: "#000000",
        }
    })
});
