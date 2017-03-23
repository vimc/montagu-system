# Modelling groups contribution portal
This portal allows modelling groups to download coverage and other input data, 
and then upload burden estimates.

# Build & run
1. Make a containerised build environment: `scripts/make-build-env.sh`
2. Use the build environment to build (and push) a containerised app: `scripts/run-build.sh`
3. Run the containerised app

    docker run fi--didelx05.dide.ic.ac.uk/montagu-contrib-portal:COMMIT_HASH

Note that currently the app doesn't actually run - I've only got as far as 
copying the build website over and installing nginx. Next step is to configure
nginx to serve the site.

# Development
1. Run `npm install` to get dependencies and `npm install webpack --global` to install webpack
2. Run `webpack` to build, or `webpack --watch` to continuously monitor files and
rebuild as needed.
3. Run `npm start` to run a development server on port 5000.

