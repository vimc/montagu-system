# Montagu Reporting portal
This portal allows funders (and anyone else) to access the reports in the Montagu Reports Orderly store.

# Development
1. Run `npm install` to get dependencies and `npm install webpack --global` to install webpack
2. Run `webpack` to build, or `webpack --watch` to continuously monitor files and
rebuild as needed.
3. Run the Montagu API using the included script `runAPIForWebappDev.` This needs to be run as sudo to have write access to `etc` and will generate a keypair in `/etc/montagu/api/token_key.`
4. Run the Montagu Reporting API using the included script `runAPIForWebappDev.` As above this needs to be run with sudo and will copy the contents of `/etc/montagu/api/token_key` (which will just contain the public key after Montagu API has started) to `/etc/montagu/report_api/token_key.`
5. Run `npm run report` to run a development server on port 5000.

