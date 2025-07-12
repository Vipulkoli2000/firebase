// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push('cjs');
defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
module.exports = defaultConfig;
