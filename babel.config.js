module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: { "@": "./src" },
          extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".svg"],
        },
      ],
      // react-native-worklets/plugin (reanimated 4's babel transform) is
      // already included by babel-preset-expo on SDK 50+ — no manual entry
      // needed, and it must stay last if one is ever added explicitly.
    ],
  };
};
