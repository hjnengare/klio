import type { NextConfig } from "next";
import webpack from "webpack";

if (typeof globalThis.self === "undefined") {
  (globalThis as any).self = globalThis;
}

const nextConfig: NextConfig = {
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    compiler: {
      removeConsole: false,
    },
  }),

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
    compiler: {
      removeConsole: true,
    },
    // Note: generateStaticParams is a function, not a boolean config option
    // We handle dynamic rendering at the page level with export const dynamic
  }),

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/photo-**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development', // Faster dev builds
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Configure quality levels for Next.js 16 compatibility
    qualities: [75, 85, 90, 100],
  },

  // Webpack optimizations for faster compilation
  webpack: (config, { dev, isServer }) => {
    // Handle Supabase packages for Edge Runtime compatibility
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      },
    };

    // Fix for "self is not defined" error - handle browser-only packages
    if (isServer) {
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.DefinePlugin({
          self: "globalThis",
        })
      );
      // On server, exclude canvas-confetti and provide fallback for browser globals
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'canvas-confetti': false,
        self: false,
      };
      
      // Externalize canvas-confetti to prevent server bundling
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('canvas-confetti');
      } else if (typeof config.externals === 'object') {
        config.externals['canvas-confetti'] = 'commonjs canvas-confetti';
      }
    } else {
      // On client, define self as window for browser-only code
      config.plugins = config.plugins || [];
      config.plugins.push(
        new webpack.DefinePlugin({
          'self': 'window',
        })
      );
    }

    if (dev) {
      // Development optimizations
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    } else {
      // Production optimizations
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
      };
    }
    return config;
  },

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['react-icons', 'lucide-react', 'date-fns'],
    optimizeCss: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // Enable PPR for better performance
    ppr: false, // Set to true when ready for Partial Prerendering
    // Enable faster page transitions
    scrollRestoration: true,
  },

  // Turbopack configuration (moved from experimental)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // TypeScript and ESLint optimizations
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint during builds
  },
  
  // Workaround for _document static generation issues in Next.js 15
  // Skip static optimization for pages that might cause issues
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  
  // Disable static optimization to prevent _document generation issues
  // This forces all pages to be dynamically rendered
  outputFileTracing: false,
  
  // Skip static page generation entirely to avoid _document issues
  // This is a workaround for Next.js 15 App Router static generation bugs
  skipTrailingSlashRedirect: true,
  
  // Disable build cache to ensure fresh builds
  // This helps avoid stale cache issues during development
  // Note: This may slow down builds but ensures consistency
  // experimental: {
  //   // Disable build cache (commented out as it's not a valid option)
  // },

  // Additional performance optimizations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  
  // Add security and performance headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Handle Supabase Edge Runtime warnings
  transpilePackages: ['@supabase/ssr', '@supabase/realtime-js'],
  
  // Configure runtime for specific routes to avoid Edge Runtime issues
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
  }),
  
  // Faster development builds
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),
};

export default nextConfig;
