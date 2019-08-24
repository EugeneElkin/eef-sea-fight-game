const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: __dirname + "/.dist"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            { test: /\.css$/, use: ['style-loader', 'css-loader'] },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "react-redux": "ReactRedux",
        "redux": "Redux",
        "axios": "axios"
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'EEF React App Template',
            // Load a custom template (lodash by default see the FAQ for details)
            template: './templates/index.html'
        }),
        new CopyWebpackPlugin(
            [{
                from: './templates/assets/manifest.json',
                to: 'assets',
                toType: 'dir'
            },
            {
                from: './templates/assets/favicon.ico',
                to: 'assets',
                toType: 'dir'
            },
            {
                from: './node_modules/react/umd/react.production.min.js',
                to: 'externals',
                toType: 'dir'
            },        
            {
                from: './node_modules/react-dom/umd/react-dom.production.min.js',
                to: 'externals',
                toType: 'dir'
            },
            {
                from: './node_modules/react-redux/dist/react-redux.min.js',
                to: 'externals',
                toType: 'dir'
            },
            {
                from: './node_modules/redux/dist/redux.min.js',
                to: 'externals',
                toType: 'dir'
            },
            {
                from: './node_modules/axios/dist/axios.min.js',
                to: 'externals',
                toType: 'dir'
            }
        ])
    ],
    devServer: {
        // proxy: { // proxy URLs to backend development server
        //     '/api': 'http://localhost:5555'
        // },
        port: 4200,
        contentBase: path.join(__dirname, '.dist'), // boolean | string | array, static file location
        compress: true, // enable gzip compression
        historyApiFallback: true, // true for index.html upon 404, object for multiple paths
        hot: false, // hot module replacement. Depends on HotModuleReplacementPlugin
        https: false, // true for self-signed, object for cert authority
        noInfo: true, // only errors & warns on hot reload,
        watchContentBase: true
    }
};