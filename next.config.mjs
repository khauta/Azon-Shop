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
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=9999999999, must-revalidate",
          },
        ],
      },
    ];
  },
  images: {
    domains: [
      "shorturl.at",
      "placeimg.com",
      "lh3.googleusercontent.com",
      "loremflickr.com",
    ],
  },
};
export default config;
