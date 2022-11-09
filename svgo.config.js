module.exports = {
    plugins: [
        {
            name: "preset-default",
            params: {
                overrides: {
                    removeViewBox: false,
                    minifyStyles: false
                }
            }
        },
        {
            name: "preset-custom",
            params: {
                removeDimensions: false,
                active: false
            },
            fn: (ast, params, info) => {}
        }
    ]
};
