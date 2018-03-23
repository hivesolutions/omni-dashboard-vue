const path = require("path");
const webpack = require("webpack");

const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js",
        library: "OmniDashboard"
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: "vue-loader",
            options: {
                loaders: {
                    js: "babel-loader!eslint-loader"
                }
            }
        }, {
            test: /\.css$/,
            use: ["style-loader", "css-loader"]
        }, {
            test: /\.js$/,
            loader: "babel-loader",
            exclude: /node_modules/,
            query: {
                presets: ["env"]
            }
        }, {
            test: /\.html$/,
            use: [{
                loader: "file-loader",
                options: {
                    name: "[name].[ext]",
                },
            }, {
                loader: "extract-loader",
            }, {
                loader: "html-loader",
                options: {
                    minimize: true,
                    removeComments: true,
                    collapseWhitespace: true,
                    conservativeCollapse: false
                },
            }],
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: "file-loader",
            options: {
                name: "[name].[ext]?[hash]"
            }
        }, {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: ["file-loader"]
        }],
    },
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        }
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 3000,
        stats: "errors-only",
        hot: true
    },
    performance: {
        hints: false
    },
    devtool: "inline-source-map"
};

if (process.env.NODE_ENV === "production") {
    module.exports.devtool = "source-map";
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
        new UglifyJSPlugin({
            sourceMap: true,
            extractComments: true
        })
    ]);
}
