const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Remove 3D model file extensions to prevent Metro from scanning for them
// config.resolver.assetExts.push('gltf', 'glb', 'obj', 'mtl');

module.exports = config;
