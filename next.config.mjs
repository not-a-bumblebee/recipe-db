/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'd1p9uf8cei0o4.cloudfront.net',

            }
        ]
    }
};

export default nextConfig;
