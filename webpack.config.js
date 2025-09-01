const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/index.jsx",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    module: {
        rules: [
            { test: /\.(js|jsx)$/, exclude: /node_modules/, use: "babel-loader" },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
        ],
    },
    resolve: { extensions: [".js", ".jsx"] },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: "src/index.html", to: "" }],
        }),
    ],
    devServer: {
        port: 8080,
        hot: true,
        historyApiFallback: true, // SPA routing
        devMiddleware: {
            writeToDisk: true, // optional: writes bundle.js to dist for Electron
        },
    }
};
