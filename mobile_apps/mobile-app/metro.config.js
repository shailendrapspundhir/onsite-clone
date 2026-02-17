/**
 * Metro configuration to work with pnpm workspace layout.
 * From RN 0.72, extend @react-native/metro-config default config.
 */
const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..', '..');

module.exports = (async () => {
  const config = await getDefaultConfig(projectRoot);

  // Add workspace root to watchFolders so Metro sees packages in the monorepo
  config.watchFolders = [workspaceRoot];

  // Ensure resolver looks in the local and workspace node_modules
  config.resolver = {
    ...config.resolver,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules')
    ],
    resolverMainFields: ['react-native', 'browser', 'main'],
    extraNodeModules: {
      '@onsite360/ui': path.resolve(workspaceRoot, 'packages/ui/src'),
      '@onsite360/schemas': path.resolve(workspaceRoot, 'packages/schemas/schemas'),
      '@onsite360/types': path.resolve(workspaceRoot, 'packages/types/src'),
      '@onsite360/common': path.resolve(workspaceRoot, 'packages/common/src')
    }
  };

  // Keep existing transform options
  config.transformer = {
    ...config.transformer,
    getTransformOptions: async () => ({
      transform: { experimentalImportSupport: false, inlineRequires: false }
    })
  };

  return config;
})();
