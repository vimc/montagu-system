## Full list of permissions
This is manually kept in sync with [spec.md](Spec.md).

* `can-login`
* `countries.[read|write]`
* `coverage.[read|write]`
* `diseases.write`
* `estimates.read`
* `estimates.read-unfinished`
* `estimates.review`
* `estimates.submit` 
* `estimates.write`
* `modelling-groups.manage-members`
* `modelling-groups.read`
* `modelling-groups.write`
* `models.[read|write]`
* `responsibilities.[read|write]`
* `roles.[read|write]`
* `scenarios.[read|write]`
* `touchstones.finish`
* `touchstones.open`
* `touchstones.prepare`
* `touchstones.read`
* `users.read`
* `users.edit-all`
* `users.create`
* `vaccines.write`

## Roles
Some roles are `simple`. You either have them, or you don't, and they apply to all
securables equally. These are stored in the database with the `simple_role` flag set
to true, and with `scope_prefix` set to `null`. When a user is granted a simple role
no scope can be specified and the user gets the associated permissions with a scope 
of `*`.

Other roles are `complex`. They apply to subset of securables. For example, to a 
particular modelling group. They are stored in the database with `simple_role` flag
set to false, and with a non-null `scope_prefix`. When a user is granted a complex
role a scope identifier must be specified and the user gets the associated permissons 
with a scope of `SCOPE_PREFIX:SCOPE_IDENTIFIER`.

This is what should be in the DB, in JSON, for lack of a better option:

    [
        {
            "id": "user",
            "description": "Log in",
            "simple_role": true,
            "scope_prefix": null,
            "permissions": [ "can-login", "scenarios.read", "countries.read", "modelling-groups.read", "models.read", "touchstones.read", "responsibilities.read", "users.read", "estimates.read" ]
        },
        {
            "id": "touchstone-preparer",
            "description": "Prepare touchstones",
            "simple_role": true,
            "scope_prefix": null,
            "permissions": [ "diseases.write", "vaccines.write", "scenarios.write", "countries.write", "touchstones.prepare", "responsibilities.write", "coverage.read" ]
        },
        {
            "id": "touchstone-reviewer",
            "description": "Review touchstones before marking as 'open'",
            "simple_role": true,
            "scope_prefix": null,
            "permissions": [ "touchstones.open", "coverage.read" ],
        },
        {
            "id": "coverage-provider",
            "description": "Upload coverage data",
            "simple_role": true,
            "scope_prefix": null,
            "permissions": [ "coverage.read", "coverage.write" ],
        },
        {
            "id": "user-manager",
            "description": "Manage users and permissions",
            "simple_role": true,
            "scope_prefix": null,
            "permissions": [ "users.create", "users.edit-all", "roles.read", "roles.write", "modelling-groups.write" ],
        },
        {
            "id": "estimates-reviewer",
            "description": "Review uploaded burden estimates",
            "simple_role": true,
            "scope_prefix": null,
            "permissions": [ "estimates.review", "estimates.read-unfinished" ]
        },
        {
            "id": "modelling-group.member",
            "description": "Member of the group",
            "simple_role": false,
            "scope_prefix": "modelling-group",
            "permissions": [ "estimates.read-unfinished", "coverage.read" ]
        },
        {
            "id": "modelling-group.uploader",
            "description": "Upload burden estimates",
            "simple_role": false,
            "scope_prefix": "modelling-group",
            "permissions": [ "estimates.write" ],
        },
        {
            "id": "modelling-group.submitter",
            "description": "Mark burden estimates as complete",
            "simple_role": false,
            "scope_prefix": "modelling-group",
            "permissions": [ "estimates.submit" ]
        },
        {
            "id": "modelling-group.user-manager",
            "description": "Manage group members and permissions",
            "simple_role": false,
            "scope_prefix": "modelling-group",
            "permissions": [ "modelling-groups.manage-members", "users.create", "roles.write" ]
        }
    ]
