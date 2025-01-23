/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
          {
              protocol: 'http',
              hostname: '192.168.1.13',
              port: '8080',
              pathname: '**'
          }
      ]
  }
}

module.exports = nextConfig
