const path = require('path');

// Ensure Module Federation finds the real webpack installation instead
// of a Next.js compiled webpack copy which may not expose the same
// 'lib' layout. Set this BEFORE requiring @module-federation so that its
// modules that run at require-time don't attempt to map to
// next/dist/compiled/... paths.
try {
  process.env.FEDERATION_WEBPACK_PATH = process.env.FEDERATION_WEBPACK_PATH || require.resolve('webpack');
}
catch (e) {
  // ignore - if webpack isn't resolvable here, the original logic will try to find it
}

// NOTE: we will require @module-federation lazily inside the webpack
// function to ensure environment variables (FEDERATION_WEBPACK_PATH)
// are in-place before the package runs code at require-time.

module.exports = {
  webpack(config) {
    // Use exact-match aliases (with $) so subpath imports like
    // 'react/jsx-runtime' and 'react/jsx-dev-runtime' still resolve
    // through node_modules/react. Aliasing 'react' to a file breaks
    // subpath resolution.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react$': require.resolve('react'),
      'react-dom$': require.resolve('react-dom'),
    };

    // Lazy-require plugin so it observes FEDERATION_WEBPACK_PATH set above
    let NextFederationPlugin;
    try {
      NextFederationPlugin = require('@module-federation/nextjs-mf');
    }
    catch (err) {
      // If require fails, surface a clearer error
      throw new Error("Failed to require @module-federation/nextjs-mf. Ensure it's installed. Original error: " + err.message);
    }

    config.plugins.push(
      new NextFederationPlugin({
        name: 'iam',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './Signup': './src/components/signup/signup_page.tsx',
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: false },
          'react-dom': { singleton: true, eager: true, requiredVersion: false },
          // Avoid sharing subpath exports like 'react/jsx-runtime' or
          // 'react/jsx-dev-runtime'. Share only the package level (react / react-dom)
          // to prevent resolution issues across hoisted/monorepo installs.
          'react-i18next': { singleton: true, requiredVersion: false },
          i18next: { singleton: true, requiredVersion: false },
        },
        extraOptions: {
          exposePages: false,
        },
      })
    );

    return config;
  },
};
