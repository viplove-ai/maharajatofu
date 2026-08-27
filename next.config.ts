import type { NextConfig } from 'next'

const config: NextConfig = {
  // Fly runs one machine behind its own proxy; standalone keeps the image small
  // by shipping only the traced server files rather than all of node_modules.
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true }, // CI runs `npm run lint` as its own step
}

export default config
