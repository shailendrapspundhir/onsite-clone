/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@onsite360/ui-shared', '@onsite360/web-ui-shared', '@onsite360/types','@onsite360/schemas', '@onsite360/common'],
  webpack(config) {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, './app'),
      '@onsite360/ui-shared': path.resolve(__dirname, '../../libraries/ui-shared'),
      '@onsite360/web-ui-shared': path.resolve(__dirname, '../../libraries/web-ui-shared'),
      '@onsite360/schemas': path.resolve(__dirname, '../../libraries/schemas'),
      '@onsite360/types': path.resolve(__dirname, '../../libraries/types'),
      '@onsite360/common': path.resolve(__dirname, '../../libraries/common'),
    };
    return config;
  },
};

module.exports = nextConfig;
