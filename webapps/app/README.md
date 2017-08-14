# Portals
There are three portals.

## Modellers' contribution portal
Short name: `contrib`

This portal allows modellers to download coverage and other input data, 
and then upload burden estimates.

## Admin portal
Short name: `admin`

This portal allows administrative staff to set up touchstones with all the
necessary input data, responsibilities and recipes. It's also where we do user
management.

## Reporting portal
Short name: `report`

This portal makes Orderly reports available to funders and modellers. Staff can
also review and publish unpublished reports.

# Build & run
1. Make a containerised build environment: `scripts/make-build-env.sh`
2. Use the build environment to build (and push) a containerised app: `scripts/run-build.sh`
3. Run the containerised app
   ```
   docker run -p 8080:80 montagu.dide.ic.ac.uk/montagu-contrib-portal:CURRENT_GIT_BRANCH
   ```
4. Browse to `http://localhost:8080/`

# Development
1. Run `npm install` to get dependencies and `npm install webpack --global` to 
   install webpack
2. Run `webpack` to build, or `webpack --watch` to continuously monitor files 
   and rebuild as needed.
3. Run `npm run SHORT_NAME` to run a development server serving one of the three
   portals on port 5000.