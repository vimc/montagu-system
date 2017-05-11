var nodeExternals = require('webpack-node-externals');
const path = require('path');
 
module.exports = {
    target: 'node', // in order to ignore built-in modules like path, fs, etc. 
    externals: [ nodeExternals() ], // in order to ignore all modules in node_modules folder 

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["*", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],

        alias: {
            "environmentSettings": path.join(__dirname, "./src/main/settings/", process.env.MONTAGU_CONTRIB_PROFILE || "development")
        }
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    module: {
        loaders: [
            {
                test: /\.tsx?$/, 
                loaders: [ "babel-loader", "awesome-typescript-loader" ]
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