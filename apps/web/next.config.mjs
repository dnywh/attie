import { withYak } from 'next-yak/withYak';

/** @type {import('next').NextConfig} */


const nextConfig = {
    transpilePackages: ['@attie/contracts', '@attie/design-tokens'],
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

export default withYak(nextConfig);
