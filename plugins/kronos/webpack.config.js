const path = require('path');

module.exports = {
    entry: './public/vue/index.js',
    mode: 'development',
    output: {
        path: path.resolve('./public', 'dist'),
        filename: 'bundle.js'
    },
    devtool: "source-map", // any "source-map"-like devtool is possible
    module: {
        rules: [{
            test: /\.scss$/,
            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader", options: {
                    sourceMap: true
                }
            }, {
                loader: "sass-loader", options: {
                    sourceMap: true,
                    includePaths: ["./public/scss"]
                }
            }]
        }]
    }
};
