# Montagu Database
<<<<<<< HEAD
[![Build status](https://badge.buildkite.com/4d056eb9896833e8eec68d737724324f683077ce0d6286dcad.svg?branch=master)](https://buildkite.com/mrc-ide/montagu-db)
=======
>>>>>>> d916e76d1 (Fix some old references)

## View the documentation
You can view the full documentation for the master branch
[here](https://vimc.github.io/montagu-db-docs/latest) (see [here](https://vimc.github.io/montagu-db-docs) for previous versions).

The closest equivalent to the old diagram is [here](https://vimc.github.io/montagu-db-docs/latest/diagrams/summary/relationships.real.compact.png),
which you can also navigate to by clicking the "Relationships" tab. But I 
encourage you to explore the full documentation. In particular, if you click on 
any one table you will get a mini diagram explaining its relationships to other 
tables, which is often clearer.

## Updating the data model and docs
<<<<<<< HEAD
See [migrations](migrations/README.md).
=======
See [migrations](db/migrations/README.md).
>>>>>>> d916e76d1 (Fix some old references)

## Starting an empty copy of the database

Run the empty database mapped to port 8888

```
<<<<<<< HEAD
docker pull vimc/montagu-db:master
docker run --rm -p 8888:5432 vimc/montagu-db:master
=======
docker pull ghcr.io/vimc/montagu-db:master
docker run --rm -p 8888:5432 ghcr.io/vimc/montagu-db:master
>>>>>>> d916e76d1 (Fix some old references)
```

## Restore a dump (from backup)

See the [montagu-backup](https://github.com/vimc/montagu-backup) repo for information on backing up and restoring.  Once done, you should have database file at `/montagu/db.dump`

```
<<<<<<< HEAD
docker run --rm -d --name montagu_db vimc/montagu-db:master
=======
docker run --rm -d --name montagu_db ghcr.io/vimc/montagu-db:master
>>>>>>> d916e76d1 (Fix some old references)
docker cp /montagu/db.dump montagu_db:/tmp/import.dump
docker exec montagu_db /montagu-bin/restore-dump.sh /tmp/import.dump
```

## Using an alternative configuration

There is only one at present `/etc/montagu/postgresql.test.conf`, to use it add this as an argument when running a container, e.g.

```
<<<<<<< HEAD
docker run --rm vimc/montagu-db:master /etc/montagu/postgresql.test.conf
=======
docker run --rm ghcr.io/vimc/montagu-db:master /etc/montagu/postgresql.test.conf
>>>>>>> d916e76d1 (Fix some old references)
```

## Streaming backups

<<<<<<< HEAD
Backup infrastructure is available in the [montagu-db-backup](https://github.com/vimc/montagu-db-backup)
=======
Backup infrastructure is available in the [montagu-db-backup](https://github.com/ghcr.io/vimc/montagu-db-backup)
>>>>>>> d916e76d1 (Fix some old references)
