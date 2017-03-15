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
A role is defined by a `scope_prefix` and a `name`.

Some roles are 'simple'. You either have them, or you don't, and they apply to all
securables equally. These are stored in the database with a `null` `scope_prefix`. 
When a user is granted a simple role no scope can be specified and the user gets 
the associated permissions with a scope of `*`.

Other roles are 'complex'. They apply to subset of securables. For example, to a 
particular modelling group. They are stored in the database with a non-null 
`scope_prefix`. When a user is granted a complex role a scope identifier must 
be specified and the user gets the associated permissons with a scope of 
`SCOPE_PREFIX:SCOPE_IDENTIFIER`.

This is what should be in the DB, in JSON, for lack of a better option, probably
also with a numeric primary key.

    [
        {
            "name": "user",
            "scope_prefix": null,
            "description": "Log in",
            "permissions": [ "can-login", "scenarios.read", "countries.read", "modelling-groups.read", "models.read", "touchstones.read", "responsibilities.read", "users.read", "estimates.read" ]
        },
        {
            "name": "touchstone-preparer",
            "scope_prefix": null,
            "description": "Prepare touchstones",
            "permissions": [ "diseases.write", "vaccines.write", "scenarios.write", "countries.write", "touchstones.prepare", "responsibilities.write", "coverage.read" ]
        },
        {
            "name": "touchstone-reviewer",
            "scope_prefix": null,
            "description": "Review touchstones before marking as 'open'",
            "permissions": [ "touchstones.open", "coverage.read" ],
        },
        {
            "name": "coverage-provider",
            "scope_prefix": null,
            "description": "Upload coverage data",
            "permissions": [ "coverage.read", "coverage.write" ],
        },
        {
            "name": "user-manager",
            "scope_prefix": null,
            "description": "Manage users and permissions",
            "permissions": [ "users.create", "users.edit-all", "roles.read", "roles.write", "modelling-groups.write" ],
        },
        {
            "name": "estimates-reviewer",
            "scope_prefix": null,
            "description": "Review uploaded burden estimates",
            "permissions": [ "estimates.review", "estimates.read-unfinished" ]
        },
        {
            "name": "member",
            "scope_prefix": "modelling-group",            
            "description": "Member of the group",
            "permissions": [ "estimates.read-unfinished", "coverage.read" ]
        },
        {
            "name": "uploader",
            "scope_prefix": "modelling-group",
            "description": "Upload burden estimates",
            "permissions": [ "estimates.write" ],
        },
        {
            "name": "submitter",
            "scope_prefix": "modelling-group",
            "description": "Mark burden estimates as complete",
            "permissions": [ "estimates.submit" ]
        },
        {
            "name": "user-manager",
            "scope_prefix": "modelling-group",
            "description": "Manage group members and permissions",
            "permissions": [ "modelling-groups.manage-members", "users.create", "roles.write" ]
        }
    ]
