import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const csp = [
  ["default-src", ["'self'"]],
  [
    "script-src",
    [
      "'self'",
      "'unsafe-inline'",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://challenges.cloudflare.com",
      "https://app.cal.com",
    ],
  ],
  ["style-src", ["'self'", "'unsafe-inline'"]],
  [
    "img-src",
    [
      "'self'",
      "data:",
      "blob:",
      "https://cdn.sanity.io",
      "https://www.google-analytics.com",
    ],
  ],
  ["font-src", ["'self'", "data:"]],
  [
    "connect-src",
    [
      "'self'",
      "https://cdn.sanity.io",
      "https://*.api.sanity.io",
      "https://www.google-analytics.com",
      "https://api.cal.com",
    ],
  ],
  [
    "frame-src",
    ["'self'", "https://app.cal.com", "https://challenges.cloudflare.com"],
  ],
  ["frame-ancestors", ["'self'"]],
  ["base-uri", ["'self'"]],
  ["form-action", ["'self'"]],
  ["object-src", ["'none'"]],
]
  .map(([directive, sources]) => `${directive} ${(sources as string[]).join(" ")}`)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  ...(isProd
    ? [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ]
    : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Pin the workspace root so Turbopack ignores the sibling lockfile at the Fix4U root
  // and treats this folder as the project root (silences the multiple-lockfiles warning).
  turbopack: { root: __dirname },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
