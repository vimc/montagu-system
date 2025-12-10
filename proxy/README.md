# Montagu reverse proxy
A reverse proxy for Montagu. This allows us to expose a single port (443) and 
map different paths to different apps (containers).

## SSL configuration files

`nginx.montagu.conf` contains references to an X509 certificate and a private
key, which it expects at `/etc/montagu/proxy/certificate.pem` and
`/etc/montagu/proxy/key.pem`, respectively. The `/etc/montagu/proxy`
directory can be mounted from a volume providing these certificates, or they
can be injected into the container using `docker copy`.

These certificates can be provisioned using Let's Encrypt (or another ACME
provider). The `/var/www/.well-known/acme-challenge` directory inside the
container will be exposed under the `/.well-known/acme-challenge` path. This
directory can be mounted from a volume that is shared with a certbot image.

When the container starts, if no certificate is present, a self-signed
certificate will be generated. This helps avoid a chicken and egg problem where
nginx cannot start without a certificate, and a certificate cannot be obtained
without nginx running.

When a new the certificate is obtained and written to `/etc/montagu/proxy`,
nginx needs to be reloaded by entering the container and running
`nginx -s reload`.

## Packit authentication

Montagu integrates with Packit via Packit's `preauth` authentication method, using Montagu as the auth provider. 
`nginx.montagu.conf` is configured to redirect `/packit` requests to the packit containers. Requests for Packit's login
page are redirected to Montagu's homepage (`index.html`). When the user has logged into Montagu, the page make a request
to `/packit/api/auth/login/montagu` providing the Montagu token. This route is configured in nginx to verify the token
with Montagu, then send user details to the `/packit/api/auth/login/preauth` endpoint in request headers. This is the "trusted
headers" approach - Packit assumes that these user details are valid without its own means of verifying them, so this endpoint
must not be externally available - nginx will return a 404 for any such external request.

## Build and run locally
Run `./scripts/dev.sh`. This runs up the proxy along with the apis and portals, in order to manually test links, logins etc. 
The test user with email `test.user@example.com` and password `password` is added by default.
Optionally include 'data' parameter (`./scripts/dev.sh data`) to include generating Montagu test data.

Demo orderly data is expected to be found in `../packit/demos/orderly` so it is necessary to have 
[packit](https://github.com/mrc-ide/packit) cloned in the same parent directory as this repo.

## Testing
Run unit tests with `npm run test`. Jest will pick up test in files with the `.test.js` extension.

To run integration tests:
 
1. Make sure you have Chrome (or Chromium) installed. Depending on the platform you may also need to install chromedriver.
    - On Ubuntu, `sudo apt install chromium-browser chromium-chromedriver` will install both.
1. Run the proxy and dependencies with `./scripts/dev.sh`
1. Then run tests with `npm run integration-test`

Jest will pick up tests in files with the `.itest.js` extension.

## Buildkite
1. `./scripts/make-integration-test-image.sh` makes the integration tests image which contains all selenium test 
dependencies
1. `./scripts/build-image.sh`: builds and pushes the main app image to docker hub
1. `./scripts/run-integration-tests.sh`: runs the app image created in the previous step along with all dependencies and 
then runs the integration tests image created in step 2.
1. `./dev/build-minimal-image.sh`: builds an image `montagu-proxy-minimal` that just provides login functionality.
 This is used for testing OrderlyWeb login integration without having to run an entire Montagu deployment.
