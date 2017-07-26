# Montagu reverse proxy
A reverse proxy for Montagu. This allows us to expose a single port (443) and 
map different paths to different apps (containers).

## Build and run locally
Run `./dev.sh`. Note that unless this is run in a constellation with the 
dependent services, ngnix will fail to start with `host not found in upstream "api"`.
I've been getting round this in development by just commenting out the config
relevant to the other services.

See also `./ci.sh` to see what else happens on TeamCity.