/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // pdfkit ships AFM font files it reads at runtime — telling webpack
    // not to bundle it keeps the Stripe webhook route working in Node.
    serverComponentsExternalPackages: ["pdfkit"],
  },
};

export default nextConfig;
