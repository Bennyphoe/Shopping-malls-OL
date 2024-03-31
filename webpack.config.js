const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    assetModuleFilename: '[name][ext]'
  },
  devServer: {
    static: {
        directory: path.resolve(__dirname, 'dist')
    },
    port: 3000,
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  devtool: 'source-map',
  module: {
    // exclude node_modules
    rules: [
        {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader, // Extract CSS into separate files
            {
              loader: require.resolve('./CSSTypingLoader'),
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  namedExport: true, //important
                  localIdentName: '[path][name]__[local]', // Customize the generated class names
                },
                importLoaders: 2
              },
            },
            'sass-loader', // Compiles Sass to CSS
          ],
        },
        { 
          test: /\.(ts|tsx)$/, 
          loader: "ts-loader" 
        },
        {
          test: /\.(json|geojson)$/,
          type: 'json'
      },
    ],
  },
  // pass all js files through Babel
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.geojson'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "public", "index.html"),
    }),
    new MiniCssExtractPlugin(),
    new Dotenv()
  ],
};