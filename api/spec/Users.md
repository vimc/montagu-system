# Users
## GET /users/
Returns an enumeration of all users in the system.

Required permissions: `users.read`. Additionally, the `roles` section is not included unless the logged in user has the `roles.read` permission. If the user has `roles.read` in a specific scope, only roles with a matching scope are returned.

Schema: [`Users.schema.json`](Users.schema.json)

### Example
    [
        {
            "username": "tini",
            "name": "Tini Garske",
            "email": "example@imperial.ac.uk",
            "last_logged_in": "2017-10-06T11:06:22Z",
            "roles": [ 
                { 
                    "name": "user", 
                    "scope_prefix": null, 
                    "scope_id": null 
                },
                { 
                    "name": "touchstone-preparer",
                    "scope_prefix": null,
                    "scope_id": null
                }, 
                {
                    "name": "touchstone-reviewer", 
                    "scope_prefix": null,
                    "scope_id": null
                }, 
                { 
                    "name": "user-manager",
                    "scope_prefix": null,
                    "scope_id": null
                },
                { 
                    "name": "estimates-reviewer",
                    "scope_prefix": null,
                    "scope_id": null
                },
                { 
                    "name": "modelling-group.member",
                    "scope_prefix": "modelling-group",
                    "scope_id": "IC-YellowFever" 
                }
            ]
        }
    ]

## GET /users/{username}/
Returns a particular user.

Required permissions: `users.read`. Additionally, the `roles` section is not included unless the logged in user has the `roles.read` permission. If the user has `roles.read` in a specific scope, only roles with a matching scope are returned.

Schema: [`User.schema.json`](User.schema.json)

### Example
    {
        "username": "tini",
        "name": "Tini Garske",
        "email": "example@imperial.ac.uk",
        "last_logged_in": "2017-10-06T11:06:22Z",
        "roles": [ 
            { 
                "name": "user", 
                "scope_prefix": null, 
                "scope_id": null 
            },
            { 
                "name": "touchstone-preparer",
                "scope_prefix": null,
                "scope_id": null
            }, 
            {
                "name": "touchstone-reviewer", 
                "scope_prefix": null,
                "scope_id": null
            }, 
            { 
                "name": "user-manager",
                "scope_prefix": null,
                "scope_id": null
            },
            { 
                "name": "estimates-reviewer",
                "scope_prefix": null,
                "scope_id": null
            },
            { 
                "name": "modelling-group.member",
                "scope_prefix": "modelling-group",
                "scope_id": "IC-YellowFever" 
            }
        ]
    }

## POST /users/
Creates a new user.

Required permissions: `users.create`

Schema: [`CreateUser.schema.json`](CreateUser.schema.json)

### Example
    {
        "username": "tini",
        "name": "Tini Garske",
        "email": "example@imperial.ac.uk"
    }

## PATCH /users/{username}/
Updates an existing user. All fields are optional.

Required permissions: `users.edit-all`, or none if the logged in user matches the user being edited.

Schema: [`UpdateUser.schema.json`](UpdateUser.schema.json)

### Example
    {
        "name": "Tini Garske",
        "email": "example@imperial.ac.uk"
    }

## POST /users/{username}/actions/associate-role/
Adds or removes a role from a user.

Required permissions: `roles.write`. If the logged in user only has `roles.write` with a scope `SCOPE_PREFIX/SCOPE_ID` then the following restrictions apply:

* The scope_prefix specified must match `SCOPE_PREFIX`
* The scope_id must be specified and must match `SCOPE_ID`

For simple roles (see [Security.md](Security.md)) no scope should be specified 
(which means they can't be used if the user only has a scoped `roles.write` permission).

Schema: [`AssociateRole.schema.json`](AssociateRole.schema.json)

### Example
    {
        "action": "add",
        "scope_prefix": null,
        "name": "touchstones.open"
    }

For complex roles, the `scope_id` must be provided. When removing an association, if the scope_prefix,
name, and scope_id do not both match an existing association, no change is made.

Schema: [`AssociateRole.schema.json`](AssociateRole.schema.json)

### Example
    {
        "action": "remove",
        "scope_prefix": "modelling-group",
        "name": "member",
        "scope_id": "IC-YellowFever"
    }

The scope_id is additionally constrained to be a valid ID of the appropriate kind. If the scope_prefix
is "modelling-group" then the scope_id must be the ID of a modelling group.

## POST /users/{username}/actions/remove-all-access/
Removes all roles from a user that match the given scope. If the scope is `*`, all roles are removed.

Required permissions: `roles.write` with scope matching scope in URL.

For example, to remove all permissions from user `martin` for modelling group `IC-YellowFever`, the URL
would be `/users/martin/actions/remove-all-access/modelling-group:IC-YellowFever/`

## POST /password/set/
Changes the password for the currently logged in user.

Required permissions: `can-login`.

Schema: [`SetPassword.schema.json`](SetPassword.schema.json)

### Example
    {
        "password": "new_password"
    }

## POST /password/request-link/?email={email}
If the email provided is associated with a user account, sends an email to the 
provided email address. This email contains a link to the set password page in 
the portal and includes as a query string parameter a onetime token for the 
`/password/set/` endpoint that allows the portal to make the change without
the user being logged in.

Required permissions: None. You do not need to be logged in to use this endpoint.