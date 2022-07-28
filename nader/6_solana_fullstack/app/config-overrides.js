const webpack = require("webpack")

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {}

  Object.assign(fallback, {
    path: require.resolve("path-browserify"),
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    // add others as shown in the error if there are more
  })
  config.resolve.fallback = fallback
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ])
  return config
}
