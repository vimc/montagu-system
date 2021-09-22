const path = require('path');
const stringReplacePlugin = require("string-replace-webpack-plugin");

function commonConfig(name, public_path) {
    return {
        mode: process.env.MONTAGU_PORTAL_PROFILE == "docker" ? "production" : "development",    
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
                ),
                "appName": path.join(
                    __dirname,
                    "src/main/shared/settings/app",
                    name
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
                {
                    test: /\.scss$/,
                    loaders: [
                        'style-loader',
                        'css-loader',
                        'sass-loader',
                    ]
                },
                // Substitute paths into index.html
                {
                    test: /index.html$/,
                    loaders: [
                        {
                            loader: "file-loader",
                            options: { name: "index.html" }
                        },
                        stringReplacePlugin.replace({
                            replacements: [{ pattern: /_SITE_ROOT_\//g, replacement: () => public_path }]
                        })
                    ]
                },
                {
                    test: /\.(jpeg?|gif|png|svg|otf|ttf|pdf|html)$/,
                    loaders: [
                        {
                            loader: "file-loader",
                            options: {
                                publicPath: public_path + 'resources/',
                                outputPath: 'resources/'
                            }
                        }
                    ],
                    exclude: [/index.html$/, /guidance-2019-inputs.pdf$/, /guidance-2019-outputs.pdf$/, /guidance-2021-inputs.pdf$/, /guidance-2021-outputs.pdf$/],
                },
                {
                    test: /(stochastic_template_params.csv|guidance-2019-inputs.pdf|guidance-2019-outputs.pdf|guidance-2021-inputs.pdf|guidance-2021-outputs.pdf)$/,
                    loaders: [
                    {
                        loader: "file-loader",
                        options: {
                            publicPath: public_path + 'resources/',
                            outputPath: 'resources/',
                            name: "[name].[ext]"
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
