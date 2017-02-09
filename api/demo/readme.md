To run this web application, open a terminal and run: `gradlew run`. You will need JDK 1.8 installed, but you shouldn't need anything else.

You can then browse to `http://localhost:8080/` to start using the API. A listing of available endpoints is included at the root URL.

To stop the application, press Ctrl+C at the command line and wait a few seconds.

There are no tests at present.

Build and run from a docker container:

```
docker build --rm --tag vimc-api --file docker/Dockerfile .
docker run -p 8080:8080 vimc-api
```
