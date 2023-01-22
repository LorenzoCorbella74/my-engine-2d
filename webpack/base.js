const webpack = require("webpack");
const path = require("path");
// per generare an index.html nella dist folder
const HtmlWebpackPlugin = require("html-webpack-plugin");
// per pulire la dist folder tra le build
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// gestione CSS
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-source-map",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // https://v4.webpack.js.org/loaders/file-loader/
      {
        test: /\.(png|mp3|jpe?g)$/i,
        use: "file-loader"
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 4000,
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "dist")
    }),
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    }),
    new HtmlWebpackPlugin({
      title: 'pixijs engine',
      template: "./index.html" // path assoluto ??
    }),
    new MiniCssExtractPlugin({
      filename:"bundle.css"})
  ]
};

/*
  Source: https://blog.logrocket.com/using-webpack-typescript/
*/
