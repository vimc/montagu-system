# Modelling groups contribution portal
This portal allows modelling groups to download coverage and other input data, 
and then upload burden estimates.

# Build & run
1. Make a containerised build environment: `scripts/make-build-env.sh`
2. Use the build environment to build (and push) a containerised app: `scripts/run-build.sh`
3. Run the containerised app

```
docker run -p 8080:80 fi--didelx05.dide.ic.ac.uk/montagu-contrib-portal:CURRENT_GIT_BRANCH
```

4. Browse to `http://localhost:8080/`

# Development
1. Run `npm install` to get dependencies and `npm install webpack --global` to install webpack
2. Run `webpack` to build, or `webpack --watch` to continuously monitor files and
rebuild as needed.
3. Run `npm start` to run a development server on port 5000.

Or, build using docker (`docker build -f dev.dockerfile .`) and then run the 
resulting image.
