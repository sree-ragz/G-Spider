const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);
const config = getDefaultConfig(__dirname);
config.resolver.extraNodeModules = {
  dgram: require.resolve('react-native-udp'),
  buffer: require.resolve('buffer/'),
};
module.exports = config;