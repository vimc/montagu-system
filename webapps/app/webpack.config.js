const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const helper = require("./webpack.common");

function makePortalConfig(name) {
    return Object.assign({
        name: name,

        entry: [
            "whatwg-fetch",
            "./src/main/" + name + "/index.tsx"
        ],
        output: {
            filename: "bundle.js",
            path: path.join(__dirname, "out", name)
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
                {from: 'node_modules/react/dist/react.js', to: 'react.js'},
                {from: 'node_modules/react-dom/dist/react-dom.js', to: 'react-dom.js'}
            ])
        ]
    }, helper.commonConfig(name));
}

module.exports = [
    makePortalConfig("admin"),
    makePortalConfig("contrib")
];