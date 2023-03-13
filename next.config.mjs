// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ['localhost', 'lh3.googleusercontent.com', 'mnmk9-bookings.s3.amazonaws.com', 'mnmk9-bookings.s3.ca-central-1.amazonaws.com'],
  },
};
export default config;
