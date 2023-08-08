const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    entry: './src/index.ts', // Entry point for your application
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    devServer: {
      open: true,
      static: {
        directory: path.join(__dirname), // Serve files from the project root
      },
      compress: false,
      port: 9000,
      hot: true, // Enable hot module replacement (HMR)
    },
    output: {
      path: path.resolve(__dirname, 'dist'), // Output path (you can change 'dist' to any folder you prefer)
      filename: 'bundle.js', // Output file name
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: 'src/assets', to: 'assets' }],
      }),
    ],
  };
}

