/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development'
const nextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['@react-pdf/renderer', 'bcryptjs', 'nodemailer'],
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), payment=()',
        },
        {
          key: 'Content-Security-Policy',
          // En production : 'unsafe-eval' retiré. 'unsafe-inline' nécessaire pour Next.js (styles inline).
          // Pour une protection XSS maximale, migrer vers des nonces (étape suivante).
          value: [
            "default-src 'self'",
            isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "font-src 'self'",
            "img-src 'self' data: blob:",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
          ].join('; '),
        },
      ],
    },
  ],
}

module.exports = nextConfig
