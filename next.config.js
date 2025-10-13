const deps = require('./package.json').dependencies;
const NextFederationPlugin = require('@module-federation/nextjs-mf');

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'dev-rjs-iam-app',
        filename: "remoteEntry.js",
        exposes: {
          './hello': './src/pages/hello.tsx',
        },
        shared: {},
        extraOptions: {
          exposePages: true,
        },
      })
    );

    return config;
  },
};
