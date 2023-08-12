const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Import HtmlWebpackPlugin

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    entry: './src/index.ts',
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
        directory: path.join(__dirname),
      },
      compress: false,
      port: 9000,
      hot: true,
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: 'src/assets', to: 'assets' }],
      }),
      new HtmlWebpackPlugin({ // Add HtmlWebpackPlugin
        template: 'index.html', // Path to your HTML template
      }),
    ],
  };
};
