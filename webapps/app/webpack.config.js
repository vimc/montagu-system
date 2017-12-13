const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const helper = require("./webpack.common");

const development = {
    public_path_prefix: false
};
const production = {
    public_path_prefix: true
};
let settings = development;

if (process.env.MONTAGU_PORTAL_PROFILE == "docker") {
    settings = production;
}

function makePortalConfig(name, urlPrefix) {
    let public_path = "/";
    if (settings.public_path_prefix) {
        public_path = "/" + urlPrefix + "/";
    }
    console.log(name + " public path: " + public_path);

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
                { from: 'node_modules/react/dist/react.js', to: 'react.js' },
                { from: 'node_modules/react-dom/dist/react-dom.js', to: 'react-dom.js' },
            ])
        ]
    }, helper.commonConfig(name, public_path));
}

module.exports = [
    makePortalConfig("admin", "admin"),
    makePortalConfig("contrib", "contribution"),
    makePortalConfig("report", "reports")
];