# Importing existing work into montagu-system

(These instructions can be deleted once we finish moving things around)

Suppose we are working on the repository `montagu-deploy` which we want to appear in the monorepo as `deploy/`

1. Locally clone the repo

`git clone git@github.com:vimc/montagu-deploy`

2. Rewrite the history so that the entire project appears to have been done within `deploy/`

```
git filter-repo --to-subdirectory-filter deploy
```

3. Add this local copy as a remote into your local copy of montagu-system (perform this within `montagu-system`)

```
git checkout main
git pull
git remote add deploy ~/tmp/montagu-deploy/
git fetch deploy
```

4. Merge the history of the deploy project into the system project, allowing unrelated histories

```
git merge --allow-unrelated-histories deploy/main
```

(this will be `master` on many older projects, just use that - the upstream name3 does not matter)

5. Finally remove the remote (we won't need that any more and can delete the local sources too)

```
git remote rm deploy
```

6. The project can then be pushed to `montagu-system`

```
git push
```

The actions will need fixing at this point; they will be in `deploy/.github/` and not in `.github` and they will certainly be broken.  It's probably best to make all these changes on a branch so that the journey can be squashed away if wanted.

7. Get actions passing (or add them if needed); see below for some pointers.  Delete the buildkite steps from the new repo

8. Archive the build from buildkite https://buildkite.com/mrc-ide; this preserves history but prevents any new builds

9. Archive the old repository on github

# Updating actions

Adding, as a top-level yaml element:

```
defaults:
  run:
    working-directory: deploy
```

will cause all `run` steps to run from this directory by default, which is very useful.

**WARNING**: This does not apply to `upload-artefact` or `docker/build-push-action` (which use `run`); these need paths to be full paths from the root.

For `docker/build-push-action`, the `context` argument is useful (see for example actions for `db`)
