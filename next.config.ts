import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'apricot-abstract-swordfish-756.mypinata.cloud',
                port: '',
                pathname: '/ipfs/**',
            },
        ],
    },
}

export default nextConfig
