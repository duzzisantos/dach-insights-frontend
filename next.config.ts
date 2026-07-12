import type { NextConfig } from "next";

const apiOrigin = process.env.NEXT_PUBLIC_API_URL ?? "";

// 'unsafe-inline' on script-src is a deliberate, scoped tradeoff: Next.js App Router
// injects its own inline bootstrap/RSC-payload scripts on every page, and a nonce-based
// CSP that removes this requires opting every route out of static rendering (see
// https://nextjs.org/docs/app/guides/content-security-policy). Those inline scripts are
// framework-generated, not attacker-influenced, and the app never uses
// dangerouslySetInnerHTML or interpolates user input into a <script> tag, so the residual
// XSS surface this trades away is small. connect-src/img-src/etc. stay locked down.
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  `connect-src 'self' ${apiOrigin}`,
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "geolocation=(), camera=(), microphone=()" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  // Traces only the dependencies actually needed at runtime into .next/standalone,
  // so the Docker runtime image doesn't need to carry the full node_modules tree.
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
