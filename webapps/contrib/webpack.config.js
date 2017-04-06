const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: [
        "whatwg-fetch",
        "./src/main/index.tsx"
    ],
    output: {
        filename: "bundle.js",
        path: __dirname + "/out/dist"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["*", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            // and then fed through Babel to compiled from ES6 to ES5
            { 
                test: /\.tsx?$/, 
                loaders: [ "babel-loader", "awesome-typescript-loader" ],                
                exclude: [ /node_modules/ ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { 
                enforce: 'pre',
                test: /\.js$/, 
                loader: "source-map-loader" 
            },
            // Use CSS modules
            {
                test: /\.css$/,
                loaders: [                        
                    "style-loader",
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: "[name]__[local]___[hash:base64:5]",
                        }
                    }
                ]
            },
            {
                test: /\.(jpeg?|gif|png|svg|woff|ttf)$/,
                loader: 'file-loader'
            }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: 'node_modules/react/dist/react.js', to: 'react.js' },
            { from: 'node_modules/react-dom/dist/react-dom.js', to: 'react-dom.js' }
        ])
    ]
};