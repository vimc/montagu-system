const path = require('path');

function commonConfig(name) {
    return {
        // Enable sourcemaps for debugging webpack's output.
        devtool: "source-map",

        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: ["*", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],

            alias: {
                "environmentSettings": path.join(
                    __dirname,
                    "src/main/shared/settings",
                    process.env.MONTAGU_PORTAL_PROFILE || "development"
                )
            }
        },

        module: {
            rules: [
                // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
                // and then fed through Babel to compiled from ES6 to ES5
                {
                    test: /\.tsx?$/,
                    loaders: [
                        {
                            loader: "awesome-typescript-loader",
                            options: {
                                useBabel: true,
                                useCache: true,
                                configFileName: path.join(__dirname, "tsconfig-" + name + ".json")
                            }
                        }
                    ],
                    exclude: [/node_modules/]
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
                                localIdentName: "[local]_from_[name]",
                            }
                        }
                    ]
                },
                {
                    test: /\.(jpeg?|gif|png|svg|otf|ttf)$/,
                    loaders: [
                        {
                            loader: "file-loader",
                            options: {
                                publicPath: "/",
                                useRelativePath: false
                            }
                        }
                    ]
                },
                {
                    test: /.md$/,
                    loader: "ignore-loader"
                }
            ]
        }
    };
}

module.exports = {
    commonConfig: commonConfig
};