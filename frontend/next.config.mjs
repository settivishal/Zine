/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        forceSwcTransforms: true,
    },
    images: {
        domains: ['images.unsplash.com'], // Add this line to configure the domain
      },
};

export default nextConfig;
