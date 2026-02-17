module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@onsite360/ui': '../../packages/ui/src',
          '@onsite360/schemas': '../../packages/schemas/schemas',
          '@onsite360/types': '../../packages/types/src',
          '@onsite360/common': '../../packages/common/src'
        }
      }
    ]
  ]
};
