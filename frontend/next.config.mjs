/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        forceSwcTransforms: true,
    },
    images: {
        domains: ['images.unsplash.com', 'd9amksc9hkkpj.cloudfront.net'], // Add this line to configure the domain
      },
    output: 'standalone'
};

export default nextConfig;
