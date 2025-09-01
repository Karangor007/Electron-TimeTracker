const path = require("path");

module.exports = {
    entry: "./src/index.jsx",
    output: {
        path: path.resolve(__dirname, "dist"), // optional for disk write
        filename: "bundle.js",
        publicPath: "/", // <--- important for dev server
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: "babel-loader",
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    devServer: {
        port: 8080,
        hot: true,
        historyApiFallback: true,
        devMiddleware: {
            writeToDisk: true, // optional if Electron needs it
        },
    },
};
