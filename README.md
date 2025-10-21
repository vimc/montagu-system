# Montagu System

The Montagu Monorepo

## Directories

* [`api/`](api) - Montagu API. Previously at [`vimc/montagu-api`]()
* [`deploy/`](deploy) - the deploy tool. Previously at [`vimc/montagu-deploy`](https://github.com/vimc/montagu-deploy) and [on PyPi](https://pypi.org/project/montagu-deploy/)
* [`db/`](db) - the database. Previously at [`vimc/montagu-db`](https://github.com/vimc/montagu-db)
* [`webmodels/`](webmodels) - models shared between the API and webapps. Previously at [`vimc/montagu-webmodels`](https://github.com/vimc/montagu-webmodels)

## Still to do
We need to rationalise e2e tests which are reproduced in several component directories. These tests can be brittle and
some are currently being skipped and should be reinstated when we put in one set of e2e tests for everything. The
problematic tests are those which require all component containers to run. Typically these are scenarios where Montagu API needs 
to communicate with Packit - to start a task via the task queue, or to create a new user. These require all containers 
because Packit Auth needs to go through the proxy, and because the proxy requires the web apps to be running..

Tests which are currently skipped or commented out:
- api/src/app/test/kotlin/org/vaccineimpact/api/test/clients/CeleryClientTests.kt "can call task" l.52-53

