const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin-next");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: "./src/index.ts",
  externals: {
    react: "react",
    "react-dom": "react-dom",
    "next/router": "next/router",
    "next/link": "next/link",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: {
      type: "umd2",
      name: "miuri",
    },
    globalObject: "this",
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new WebpackShellPlugin({
      onBuildExit: {
        scripts: [
          "echo 'Copy ./dist/ to playground...'",
          "rm -r ./playground/components/miuri",
          "cp -r ./dist/ ./playground/components/miuri",
        ],
        blocking: true,
        parallel: false,
      },
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: [{ loader: "babel-loader" }, { loader: "ts-loader" }],
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/i,
        use: [
          stylesHandler,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
