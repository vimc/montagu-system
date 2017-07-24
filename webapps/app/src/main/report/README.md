# Montagu Reporting portal
This portal allows funders (and anyone else) to access the reports in the Montagu Reports Orderly store.

# Development
1. Run `npm install` to get dependencies and `npm install webpack --global` to install webpack
2. Run `webpack` to build, or `webpack --watch` to continuously monitor files and
rebuild as needed.
3. You will need to run both the Montagu API and the Montagu Reporting API using a shared RSA keypair. 
Each of these contain a script called `runAPIForWebappDev` and running both of these in either order will set everything up. 
Note that these scripts need to be run as `sudo` and will generate a keypair in `/etc/montagu/api/token_key.`
3. Run `npm run report` to run a development server on port 5000.

