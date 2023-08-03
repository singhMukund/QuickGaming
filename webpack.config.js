const path = require('path');

module.exports = {
  entry: './src/index.ts', // Entry point for your application
  mode: 'development',
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'dist'), // Output path (you can change 'dist' to any folder you prefer)
  },
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
    static: {
        directory: path.join(__dirname), // Serve files from the project root
      }, // Serve files from the project root
    compress: true,
    port: 9000,
    hot: true, // Enable hot module replacement (HMR)
  },
};
