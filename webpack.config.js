module.exports = {
    entry: "./static/js/app.js",
    output: {
        path: __dirname + "/static/dist",
        filename: "bundle.js",
        library: "OmniDashboard"
    },
    devtool: "inline-source-map"
};
