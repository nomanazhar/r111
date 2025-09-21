/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    // Suppress specific dependency warnings
    config.module = config.module || {};
    config.module.exprContextCritical = false;
    
    // Ignore specific warnings
    config.ignoreWarnings = [
      { module: /@supabase\/realtime-js/ },
      { file: /@supabase\/realtime-js/ },
    ];

    return config;
  },
};

module.exports = nextConfig;
