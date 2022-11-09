const path = require("path");
const webpack = require("webpack");

const vueLoader = require("vue-loader");

const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin").WebpackManifestPlugin;
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const VueLoaderPlugin = vueLoader.VueLoaderPlugin;

const isProduction = process.env.NODE_ENV === "production";

const config = {
    entry: ["babel-polyfill", "./src/app.js"],
    mode: isProduction ? "production" : "development",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js?[fullhash]",
        library: "OmniDashboard"
    },
    plugins: [
        new VueLoaderPlugin({}),
        new ESLintWebpackPlugin({
            extensions: ["js", "jsx", "vue"]
        }),
        new ManifestPlugin({}),
        new HtmlWebpackPlugin({
            title: "Omni Dashboard",
            template: "index.html.tpl",
            favicon: "src/assets/images/icon.play.png",
            cache: false,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                conservativeCollapse: false,
                preserveLineBreaks: false
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        js: "babel-loader",
                        scss: "vue-style-loader!css-loader!sass-loader",
                        sass: "vue-style-loader!css-loader!sass-loader?indentedSyntax"
                    }
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(scss|sass)$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.js$/,
                loader: "babel-loader"
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]?[fullhash]",
                            esModule: false
                        }
                    },
                    {
                        loader: "extract-loader"
                    },
                    {
                        loader: "html-loader",
                        options: {
                            minimize: true,
                            removeComments: true,
                            collapseWhitespace: true,
                            conservativeCollapse: false,
                            preserveLineBreaks: false
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]?[fullhash]",
                    esModule: false
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: "file-loader",
                options: {
                    esModule: false
                }
            }
        ]
    },
    resolve: {
        alias: {
            vue$: isProduction ? "vue/dist/vue.esm-browser.prod.js" : "vue/dist/vue.esm-browser.js"
        }
    },
    devServer: {
        compress: false,
        port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
        hot: true,
        historyApiFallback: true,
        watchFiles: ["src/**/*"]
    },
    performance: {
        hints: false
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: false
                }
            })
        ]
    },
    devtool: "inline-source-map"
};

if (isProduction) {
    config.devtool = "source-map";
    config.plugins = (config.plugins || []).concat([
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        })
    ]);
} else {
    config.plugins = (config.plugins || []).concat([
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false
        })
    ]);
}

module.exports = config;
