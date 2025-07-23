module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/consciousness': './src/consciousness',
            '@/sensors': './src/sensors',
            '@/utils': './src/utils',
            '@/types': './src/types'
          }
        }
      ]
    ]
  };
};