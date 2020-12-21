const path = require("path");
const webpack = require("webpack");

const vueLoader = require("vue-loader");

const OfflinePlugin = require("offline-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const ManifestPlugin = require("webpack-manifest-plugin").WebpackManifestPlugin;
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const VueLoaderPlugin = vueLoader.VueLoaderPlugin;

module.exports = {
    entry: ["babel-polyfill", "./src/app.js"],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js?[hash]",
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
        }),
        new WebpackPwaManifest({
            name: "Omni Dashboard",
            short_name: "Dashboard",
            description: "Sales Dashboard for Omni",
            theme_color: "#6d6d6d",
            background_color: "#6d6d6d",
            icons: [
                {
                    src: path.resolve("src/assets/images/icon.play.png"),
                    sizes: [96, 128, 192, 256, 384, 512]
                }
            ]
        }),
        new OfflinePlugin({})
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
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            },
            {
                test: /\.js$/,
                use: [
                    {
                        loader: "babel-loader"
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]?[hash]",
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
                    name: "[name].[ext]?[hash]",
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
            vue$: "vue/dist/vue.esm.js"
        }
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: false,
        port: 3000,
        stats: "minimal",
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
        })
    ]);
} else {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false
        })
    ]);
}
