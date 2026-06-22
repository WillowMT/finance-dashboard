import withPWA from "@ducanh2912/next-pwa";

const nextConfig = {
  cacheComponents: true,
  // required: next.config.ts must declare turbopack when a webpack plugin (withPWA) is present
  turbopack: {},
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
