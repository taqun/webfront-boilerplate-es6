const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");

const MODE = process.env.NODE_ENV || "development";
const IS_DEV = MODE === "development";

const copyRules = [
  {
    context: "src",
    from: "**/*.html",
    to: path.resolve(__dirname, "public"),
  },
  {
    context: "src/scripts",
    from: "*.js",
    to: path.resolve(__dirname, "public/assets"),
  },
  {
    context: "src/images",
    from: "*",
    to: path.resolve(__dirname, "public/assets/images"),
  },
];

module.exports = {
  mode: MODE,
  entry: ["./src/index.js"],
  devtool: IS_DEV ? "inline-source-map" : false,
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "public/assets"),
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
      },
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCSSExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders: 1 } },
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin(copyRules),
    new WriteFilePlugin(),
    new MiniCSSExtractPlugin({
      filename: "styles.css",
    }),
    new StyleLintPlugin({ files: ["src/**/*.*(css|scss)"] }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    hot: true,
    watchContentBase: true,
  },
};
