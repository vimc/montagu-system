# Build instructions
## Get the database up and running
In the repository root, run `./scripts/setup-database.sh`

This gives you a Docker instance with a populated database. You'll need to run this again if the instance is stopped - for example, if you reboot your machine.

## Generate the data models
In `./api/demo`, run `gradlew generateFromDatabase`

You will only have to do this step again when the database schema changes (or if you lose the generated code somehow).

## Run the web app
In `./api/demo` run: `gradlew run`. You will need JDK 1.8 installed, but you shouldn't need anything else.

But better, build and run it from a docker container:

```
docker build --rm --tag vimc-api-bare --file docker/Dockerfile .
docker run --name vimc-api-build  --link vimc-db:vimc-db vimc-api-bare ./gradlew generateFromDatabase build
docker commit vimc-api-build vimc-api
docker rm vimc-api-build
docker run -p 8080:8080 --link vimc-db:vimc-db vimc-api ./gradlew run
```

Either way, you can then browse to `http://localhost:8080/` to start using the API. A listing of available endpoints is included at the root URL.

To stop the application, press Ctrl+C at the command line and wait a few seconds / `docker stop vimc-api`.

There are no tests at present.
