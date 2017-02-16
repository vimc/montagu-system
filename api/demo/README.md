# API Demo

## Build instructions
### Get the database up and running
In the repository root, run `./scripts/setup-database.sh`

This gives you a Docker instance with a populated database. You'll need to run this again if the instance is stopped - for example, if you reboot your machine.

### Generate the data models
In `./api/demo`, run `gradlew generateFromDatabase`

You will only have to do this step again when the database schema changes (or if you lose the generated code somehow).

### Run the web app
In `./api/demo` run: `gradlew run`. You will need JDK 1.8 installed, but you shouldn't need anything else.

Or, using docker:
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

## Configuration
Default configuration for Gradle builds resides in `./api/demo/config/default.properties`. Changes here affect all developers and deployment scenarios.

For scenario-specific configuration, if the defaults aren't correct, do the following:

1. `echo "NAME" > config/current_user` where NAME is your name, or the name of the scenario (e.g. "rich", "staging", "live")
2. Create a corresponding `NAME.properties` file in `config/users/`
3. Set property values using Java properties syntax, overriding any keys from `default.properties` that you wish to
