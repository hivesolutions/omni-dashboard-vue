module.exports = {
    entry: "./static/js/app.js",
    output: {
        path: __dirname + "/static/dist",
        filename: "bundle.js",
        library: "OmniDashboard"
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: "vue-loader"
        }]
    },
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        },
        extensions: ["*", ".js", ".vue", ".json"]
    },
    devtool: "inline-source-map"
};
