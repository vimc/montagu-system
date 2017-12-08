# VIMC draft API
# General points
* All data returned is in JSON format. POST and PUT data is expected as a string containing JSON-formatted data.
* Dates and times are returned as strings according to the ISO 8601 standard.
* Unless otherwise noted, URLs and IDs embedded in URLs are case-sensitive.
* The canonical form for all URLs (not including query string) ends in a slash: `/`.
* The API will be versioned via URL. So for version 1, all URLs will begin `/v1/`. e.g. `http://vimc.dide.ic.ac.uk/api/v1/diseases/`
* When a POST results in the creation of a new object, the API returns a response in the standard format (see below) with the 'data' field being the URL that identifies the new resource.

# Issues to be resolved:
* CSV options for some endpoints

# Security
Permissions are listed for each endpoint. All endpoints are assumed to require a logged in user
with the `can-login` permission unless otherwise noted.

See also [Security.md](Security.md).

# Standard response format
All responses are returned in a standard format. Throughout this specification, 
wherever an endpoint describes its response format, it should be assumed the payload is wrapped in
the standard response format, so that the `data` property holds the payload.

## Success
Schema: [`Response.schema.json`](Response.schema.json)

### Example
    {
        "status": "success",
        "data": {},
        "errors": []
    }

## Error
Schema: [`Response.schema.json`](Response.schema.json)

### Example
    {
        "status": "failure",
        "data": null,
        "errors": [
            { 
                "code": "unique-error-code", 
                "message": "Full, user-friendly error message" 
            }
        ]
    }

# Index
## GET /
The root of the API returns some simple data, which is mainly there to make it clear that you
have correctly connected to the API. It also tells you what endpoints are implemented in the
version you are currently connected to.

Required permissions: User does not need to be logged in to access this endpoint.

Schema: [`Index.schema.json`](Index.schema.json)

### Example
    {
        "name": "montagu",
        "version": "1.0.0",
        "endpoints": [
            "/v1/authenticate/",
            "/v1/diseases/",
            "/v1/diseases/:id/",
            "/v1/touchstones/",
            "/v1/modelling-groups/",
            "/v1/modelling-groups/:group-id/responsibilities/:touchstone-id/"
        ]
    }

# Authentication
## POST /authenticate
Required permissions: User does not need to be logged in to access this endpoint.

### Request
For the request, see [this part of the OAuth2 Spec](https://tools.ietf.org/html/rfc6749#section-4.4.2).
In short, use HTTP Basic authentication, and send content encoded using "application/x-www-form-urlencoded"
(rather than the JSON used elsewhere in the API). The content should always be "grant_type=client_credentials".

Like so:

    POST /token HTTP/1.1
    Host: server.example.com
    Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
    Content-Type: application/x-www-form-urlencoded
    
    grant_type=client_credentials

### Response
If the username and password are correct, and the user has the `can-login` permission:

Schema: [`LoginSuccessful.schema.json`](LoginSuccessful.schema.json)

#### Example

    {
        "access_token": "2YotnFZFEjr1zCsicMWpAA",
        "token_type": "bearer",
        "expires_in": 3600
    }

Future requests to other endpoints should included the access token using the Authorization header,
with this format: `Authorization: Bearer TOKEN`.

Otherwise an error response is returned, as per [this part of the OAuth2 Spec](https://tools.ietf.org/html/rfc6749#section-5.2).

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

## POST /users/{username}/actions/associate_role/
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

## POST /users/{username}/actions/remove_all_access/
Removes all roles from a user that match the given scope. If the scope is `*`, all roles are removed.

Required permissions: `roles.write` with scope matching scope in URL.

For example, to remove all permissions from user `martin` for modelling group `IC-YellowFever`, the URL
would be `/users/martin/actions/remove_all_access/modelling-group:IC-YellowFever/`

## POST /password/set/
Changes the password for the currently logged in user.

Required permissions: `can-login`.

Schema: [`SetPassword.schema.json`](SetPassword.schema.json)

### Example
    {
        "password": "new_password"
    }

## POST /password/request_link?email={email}
If the email provided is associated with a user account, sends an email to the 
provided email address. This email contains a link to the set password page in 
the portal and includes as a query string parameter a onetime token for the 
`/password/set/` endpoint that allows the portal to make the change without
the user being logged in.

Required permissions: None. You do not need to be logged in to use this endpoint.

# Diseases
## GET /diseases/
Returns an enumeration of all diseases.

Required permissions: none

Schema: [`Diseases.schema.json`](Diseases.schema.json)

#### Example

    [
        {
            "id": "HepB",
            "name": "Hepatitis B"
        },
        {
            "id": "YF",
            "name": "Yellow Fever"
        }
    ]

## POST /diseases/
Adds a new disease. Request data:

Required permissions: `diseases.write`

Schema: [`Disease.schema.json`](Disease.schema.json)

### Example
    {
        "id": "NEW-DISEASE-ID",
        "name": "NEW DISEASE NAME"
    }

Diseases cannot be deleted via the API.

## GET /diseases/{disease-id}/
Returns one disease.

Required permissions: none

Schema: [`Disease.schema.json`](Disease.schema.json)

### Example
    {
        "id": "YF",
        "name": "Yellow Fever"
    }

## PATCH /diseases/{disease-id}/
Update the disease's human-readable name. Request data:

Required permissions: `diseases.write`

Schema: [`UpdateDisease.schema.json`](UpdateDisease.schema.json)

### Example
    {
        "name": "NEW DISEASE NAME"
    }

You cannot update a disease's ID via the API.

# Vaccines
The vaccine API is identical to the disease API, but uses `/vaccines` as its base URI and `vaccines.write` as its required permissions.

# Countries
## GET /countries/
Returns all countries.

Note that countries gain other data when associated
with a particular point in time, via a touchstone. This part of the API
just tracks countries in their abstract sense, using ISO codes.

Required permissions: none

Schema: [`Countries.schema.json`](Countries.schema.json)

### Example
    [
        {
            "id": "AFG",
            "name": "Afghanistan"
        },
        {
            "id": "AGO",
            "name": "Angola"
        }
    ]

## POST /countries/
Adds a new country.

Required permissions: `countries.write`

Schema: [`Country.schema.json`](Country.schema.json)

### Example
    {
        "id": "MDG",
        "name": "Madagascar"
    }

# Scenarios
## GET /scenarios/
Returns all scenarios.

Required permissions: `scenarios.read`, `touchstones.read`

Schema: [`Scenarios.schema.json`](Scenarios.schema.json)

### Example
    [
        {
            "id": "menA-novacc",
            "touchstones": [ "2016-op-1", "2017-wuenic-1", "2017-op-1" ],
            "description": "Menigitis A, No vaccination",
            "disease": "MenA"
        },
        {
            "id": "yf-campaign-reactive-nogavi",
            "touchstones": [ "2017-wuenic-1", "2017-op-1" ],
            "description": "Yellow Fever, Reactive campaign, SDF coverage without GAVI support",
            "disease": "YF"
        }
    ]

### Query parameters:

#### touchstone
Optional. A touchstone id. Only returns scenarios that belong to that touchstone.

#### disease
Optional. A disease id. Only returns scenarios that match that disease.

Example: `/scenarios/?disease=YF`

## POST /scenarios/
Creates a new scenario. Request format:

Required permissions: `scenarios.write`

Schema: [`CreateScenario.schema.json`](CreateScenario.schema.json)

### Example
    {
        "id": "ID",
        "description": "DESCRIPTION",
        "disease": "VALID-DISEASE-ID"
    }
    
## PATCH /scenarios/{scenario-id}/
Updates a scenario's properties. This is only allowed if the 
scenario is not associated with any touchstone. 
All fields are optional.

Required permissions: `scenarios.write`

Schema: [`UpdateScenario.schema.json`](UpdateScenario.schema.json)

### Example

    {
        "description": "DESCRIPTION",
        "disease": "VALID-DISEASE-ID"
    }

## GET /scenarios/{scenario-id}/responsible_groups/{touchstone-id}
Returns an enumeration (potentially empty) of modelling groups who are responsible for this 
scenario in the given touchstone.

Required permissions: `scenarios.read`, `modellinggroups.read`, `responsibilities.read`

Schema: [`ModellingGroups.schema.json`](ModellingGroups.schema.json)

### Example
    [
        {
            "id": "IC-YellowFever",
            "description": "Imperial College, Yellow Fever, PI: Tini Garske"
        },
        {
            "id": "LSHTM-Jit",
            "description": "London School of Hygiene and Tropical Medicine, PI: Mark Jit"
        }
    ]

See `POST /modelling-groups/{modelling-group-id}/actions/associate_responsibility` for editing 
this data.

# Touchstones
## GET /touchstones/
Returns an enumeration of all touchstones.

Required permissions: `touchstones.read`. To see touchstones that are `in-preparation` the user further requires `touchstones.prepare`.

Schema: [`Touchstones.schema.json`](Touchstones.schema.json)

### Example
    [
        { 
            "id": "op-2017-1",
            "name": "op-2017",
            "version": 1,            
            "description": "2017 Operational Forecast",
            "status": "finished"
        },
        { 
            "id": "wuenic-2017-1",
            "name": "wuenic-2017",
            "version": 1,
            "description": "2017 Wuenic Update",
            "status": "open"
        }
    ]

## POST /touchstones/
POST creates a new, empty touchstone in the 'in-preparation' state.

Required permissions: `touchstones.prepare`

Schema: [`CreateTouchstone.schema.json`](CreateTouchstone.schema.json)

### Example
    {
         "id": "an-id",
         "name": "a-name",
         "version": 1,
         "description": "A description"
    }

Fails if there is an existing touchstone with that ID.

## PATCH /touchstones/{touchstone-id}/
Updates editable fields on a touchstone (currently just status). 
Changing the status is only allowed if requirements have been met (i.e. cannot move from "open" to "finished" if some responsibilities are unfulfilled).

Required permissions: To change state to `open` the use needs `touchstones.open`.  To change state to `finished` the use needs `touchstones.finish`.

Schema: [`UpdateTouchstone.schema.json`](UpdateTouchstone.schema.json)

### Example
    {
        "status": "finished"
    }

## GET /touchstones/{touchstone-id}/scenarios/
Returns all scenarios associated with the touchstone.

Required permissions: `touchstones.read`, `scenarios.read`, `coverage.read`

Additionally, to view scenarios for an in-preparation touchstone, `touchstones.prepare` is required.

Schema: [`ScenariosInTouchstone.schema.json`](ScenariosInTouchstone.schema.json)

### Example
    [
        {
            "scenario": {
                "id": "menA-novacc",
                "touchstones": [ "2016-op-1", "2017-wuenic-1", "2017-op-1" ],
                "description": "Menigitis A, No vaccination",
                "disease": "MenA"
            },
            "coverage_sets": [ 
                { 
                    "id": 101,
                    "touchstone": "2017-op-1",
                    "name": "Menigitis no vaccination",
                    "vaccine": "MenA",
                    "gavi_support": "no vaccine",
                    "activity_type": "none"
                }
            ]
        },
        {
            "scenario": {
                "id": "yf-campaign-reactive-nogavi",
                "touchstones": [ "2017-wuenic-1", "2017-op-1" ],
                "description": "Yellow Fever, Reactive campaign, SDF coverage without GAVI support",
                "disease": "YF"
            },
            "coverage_sets": [
                { 
                    "id": 643,
                    "touchstone": "2017-op-1",
                    "name": "Yellow fever birth dose (with GAVI support)",
                    "vaccine": "YF",
                    "gavi_support": "total",
                    "activity_type": "routine"
                },
                { 
                    "id": 643,
                    "touchstone": "2017-op-1",
                    "name": "Yellow fever reactive campaign (with GAVI support)",
                    "vaccine": "YF",
                    "gavi_support": "total",
                    "activity_type": "campaign"
                }
            ]
        }
    ]

Note that the coverage sets returned are just those that belong to the touchstone in the URL.
In other words, if the same scenario is associated with other coverage
sets in a different touchstone, those are not returned here.

Coverage sets are returned in the order they are to be applied.

The returned scenarios can be filtered using the same query parameters as `GET /scenarios`, with the exception that the touchstone parameter is ignored.

## GET /touchstones/{touchstone-id}/scenarios/{scenario-id}/
Returns a single scenario associated with a touchstone.

Required permissions: `touchstones.read`, `scenarios.read`, `coverage.read`

Additionally, to view scenarios for an in-preparation touchstone, `touchstones.prepare` is required.

Schema: [`ScenarioAndCoverageSets.schema.json`](ScenarioAndCoverageSets.schema.json)

### Example
    {
        "touchstone": { 
            "id": "2017-op-1",
            "name": "2017-op",
            "version": 1,            
            "description": "2017 Operational Forecast",
            "status": "finished"
        },
        "scenario": {
            "id": "menA-novacc",
            "touchstones": [ "2016-op-1", "2017-wuenic-1", "op-2017-1" ],
            "description": "Menigitis A, No vaccination",
            "disease": "MenA"
        },
        "coverage_sets": [ 
            { 
                "id": 101,
                "touchstone": "2017-op-1",
                "name": "Menigitis no vaccination",
                "vaccine": "MenA",
                "gavi_support": "no vaccine",
                "activity_type": "none"
            }
        ]
    }

## GET /touchstones/{touchstone-id}/scenarios/{scenario-id}/coverage/
Returns the amalgamated coverage data of all the coverage sets associated with this scenario in this touchstone.

Required permissions: `touchstones.read`, `scenarios.read`, `coverage.read`

This data is returned in two parts: First the metadata, then the coverage in CSV format.

### Metadata
Schema: [`ScenarioAndCoverageSets.schema.json`](ScenarioAndCoverageSets.schema.json)

#### Example
    {
        "touchstone": { 
            "id": "2017-op-1",
            "name": "2017-op",
            "version": 1,            
            "description": "2017 Operational Forecast",
            "status": "finished"
        },
        "scenario": {
            "id": "menA-novacc",
            "touchstones": [ "2016-op-1", "2017-wuenic-1", "op-2017-1" ],
            "description": "Menigitis A, No vaccination",
            "disease": "MenA"
        },
        "coverage_sets": [ 
            { 
                "id": 101,
                "touchstone": "2017-op-1",
                "name": "Menigitis without GAVI support",
                "vaccine": "MenA",
                "gavi_support": "no gavi",
                "activity_type": "routine"
            },
            { 
                "id": 136,
                "touchstone": "2017-op-1",
                "name": "Menigitis with GAVI support",
                "vaccine": "MenA",
                "gavi_support": "total",
                "activity_type": "routine"
            }
        ]
    }

Coverage sets are returned in the order they are to be applied.

### Coverage data
CSV data in this format:

       "scenario",                       "set_name", "vaccine", "gavi_support", "activity_type", country_code", "country",    "year","age_first","age_last",  "age_range_verbatim", "target", coverage"
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",      "Afghanistan", 2006,          0,         2,                    NA,       NA,        NA
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",      "Afghanistan", 2007,          0,         2,                    NA,       NA,      64.0
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",      "Afghanistan", 2008,          0,         2,                    NA,       NA,      63.0
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AGO",      "Angola",      2006,          0,         1,                    NA,       NA,       0.0
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AGO",      "Angola",      2007,          0,         1,"school aged children",  1465824,      83.0
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AGO",      "Angola",      2008,          0,         1,                    NA,       NA,      81.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",      "Afghanistan", 2006,          0,         2,                    NA,       NA,        NA
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",      "Afghanistan", 2007,          0,         2,                    NA,       NA,      80.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",      "Afghanistan", 2008,          0,         2,                    NA,       NA,      80.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AGO",      "Angola",      2006,          0,         1,                    NA,       NA,      20.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AGO",      "Angola",      2007,          0,         1,                    NA,       NA,      90.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AGO",      "Angola",      2008,          0,         1,                    NA,       NA,      95.0

The coverage sets are de-normalized and merged into this single table. You can 
identify which coverage set a line is from using `scenario` plus `vaccine`, 
`gavi_support` and `activity_type`. Note that we don't expect the modellers to
need to know which coverage set the data is from.

## POST /touchstones/{touchstone-id}/actions/associate_scenario/
Associate or unassociate a scenario with a touchstone.

Required permissions: `touchstones.prepare`, `scenarios.read`

Schema: [`AssociateScenario.schema.json`](AssociateScenario.schema.json)

### Example
    {
        "action": "add",
        "scenario_id": "menA-novacc"
    }
    
If the action is "add" then the two are associated. If the action is "remove", then they become unassociated.

A scenario can only be associated with a touchstone if the touchstone is in the status 'in-preparation'.

# Touchstone + countries
## GET /touchstones/{touchstone-id}/countries/
Returns all countries associated with the touchstone.

Required permissions: `touchstones.read`

Schema: [`CountriesWithDetails.schema.json`](CountriesWithDetails.schema.json)

### Example
    [
        {
            "id": "AFG",
            "name": "Afghanistan",
            "who_region": "emro",
            "gavi73": true,
            "wuenic": true
        },
        {
            "id": "AGO",
            "name": "Angola",
            "who_region": "afro",
            "gavi73": true,
            "wuenic": true
        }
    ]

## POST /touchstones/{touchstone-id}/countries/
Sets the list of countries associated with the touchstone, and their
touchstone-specific properties (currently just name).

Required permissions: `touchstones.prepare`

Schema: [`SetCountriesWithDetails.schema.json`](SetCountriesWithDetails.schema.json)

### Example
    [
        {   
            "id": "AFG",
            "who_region": "emro",
            "gavi73": true,
            "wuenic": true
        },
        {
            "id": "AGO",
            "who_region": "afro",
            "gavi73": true,
            "wuenic": true
        }
    ]

If a country is referred (by id) that does not exist in the master list
of countries (see `/countries/`), the action fails without effect.

## GET /touchstones/{touchstone-id}/scenarios/{scenario-id}/countries/
**This is likely to change, as Rich and Martin need to have a conversation about more generic validation approaches**

Returns a list of the countries associated with the scenario in this touchstone.

Schema: [`CountriesWithDetails.schema.json`](CountriesWithDetails.schema.json)

### Example
    [
        {
            "id": "AFG",
            "name": "Afghanistan",
            "who_region": "emro",
            "gavi73": true,
            "wuenic": true
        },
        {
            "id": "AGO",
            "name": "Angola",
            "who_region": "afro",
            "gavi73": true,
            "wuenic": true
        }
    ]

## POST /touchstones/{touchstone-id}/scenarios/{scenario-id}/countries/
**This is likely to change, as Rich and Martin need to have a conversation about more generic validation approaches**

Sets the list of countries associated with this scenario in this touchstone.

Schema: [`CountryIds.schema.json`](CountryIds.schema.json)

### Example
    [ "AFG", "AGO" ]

The countries set here must:

* Exist overall (see `/countries`)
* Exist in this touchstone (see `/touchstones/{touchstone-id}/countries/`)

# Coverage data
## GET /touchstones/{touchstone-id}/coverage_sets/
Returns the coverage data sets associated with the touchstone

Required permissions: `coverage.read`

Schema: [`CoverageSets.schema.json`](CoverageSets.schema.json)

### Example
    [
        {
            "id": 189,
            "touchstone": "2017-op-1",
            "name": "Measles 1st Dose (without GAVI support)",
            "activity_type": "routine",
            "vaccine": "MCV1",
            "gavi_support": "no gavi"
        },
        {
            "id": 278,
            "touchstone": "2017-op-1",
            "name": "Measles 2nd Dose (without GAVI support)",
            "activity_type": "routine",
            "vaccine": "MCV2",
            "gavi_support": "no gavi"
        },
        {
            "id": 290,
            "touchstone": "2017-op-1",
            "name": "Yellow Fever reactive campaign (with GAVI support)",
            "activity_type": "campaign",
            "vaccine": "YF",
            "gavi_support": "total"
        }
    ]

### Query parameters
#### scenario
Optional. Takes a scenario id. Returns only those coverage sets that belong to the given scenario.

Example: `/touchstones/2017-op-1/coverage_sets/?scenario=64`

#### activity_type
Optional. Takes either 'routine' or 'campaign'. The coverage sets are filtered to the specified coverage type.

Example: `/touchstones/2017-op-1/coverage_sets/?activity_type=campaign`

#### vaccine
Optional. Takes a valid vaccine identifier. The coverage sets are filtered to the specified vaccine.

Example: `/touchstones/2017-op-1/coverage_sets/?vaccine=MCV1`

## GET /touchstones/{touchstone-id}/coverage_sets/{coverage-set-id}/
Returns a single coverage set and its coverage data.

Required permissions: `coverage.read`

Returns HTTP multipart data with two sections. The first section has `Content-Type: application/json`
and conforms to this schema.

Schema: [`CoverageSet.schema.json`](CoverageSet.schema.json)

### Example
    {
        "id": 189,
        "touchstone": "2017-op-1",        
        "name": "Measles 1st Dose (With GAVI support)",
        "vaccine": "Measles",
        "gavi_support": "total",        
        "activity_type": "routine"
    }

The second section has `Content-Type: text/csv`, and returns CSV data with headers:

    "country","year","age_from","age_to","coverage"
    "AFG",      2006,         0,       2,        NA
    "AFG",      2007,         0,       2,      64.0
    "AFG",      2008,         0,       2,      63.0
    "AGO",      2006,         0,       1,       0.0
    "AGO",      2007,         0,       1,      83.0
    "AGO",      2008,         0,       1,      81.0

### Query parameters
#### countries
Optional. Takes a list of country codes. The coverage data is filtered to just the specified countries.

Example: `/touchstones/2017-op-1/coverage_sets/189/?countries=AFG,ANG,CHN`

## POST /touchstones/{touchstone-id}/coverage_sets/
Adds a new coverage set to the touchstone

Required permissions: `coverage.write`

Takes HTTP multipart data with two sections. The first section must have
`Content-Type: application/json` and must conform to this schema.

Schema: [`CreateCoverageSet.schema.json`](CreateCoverageSet.schema.json)

### Example
    {
        "name": "Measles 1st dose",
        "vaccine": "MCV1",
        "gavi_support": "total",
        "activity_type": "routine"
    }

The second section must have `Content-Type: text\csv` and requires CSV data with headers:

    "country","year","age_from","age_to","coverage"
    "AFG",      2006,         0,       2,        NA
    "AFG",      2007,         0,       2,      64.0
    "AFG",      2008,         0,       2,      63.0
    "AGO",      2006,         0,       1,       0.0
    "AGO",      2007,         0,       1,      83.0
    "AGO",      2008,         0,       1,      81.0

This adds a new coverage set for this touchstone. This can only be invoked if the 
touchstone is in `in-preparation`. An error occurs if the name matches an existing 
coverage set in this touchstone. It then needs to be associated with 1 or more
scenarios.

## PUT /touchstones/{touchstone-id}/coverage_sets/{coverage-set-id}/
Replaces the data in an existing coverage set.

Required permissions: `coverage.write`

Takes HTTP multipart data with two sections. The first section must have
`Content-Type: application/json` and must conform to this schema.

Schema: [`CreateCoverageSet.schema.json`](CreateCoverageSet.schema.json)

### Example
    {
        "name": "Measles 1st dose",
        "vaccine": "MCV1",
        "gavi_support": "total",        
        "activity_type": "routine"
    }

The second section must have `Content-Type: text\csv` and requires CSV data with headers:

    "country","year","age_from","age_to","coverage"
    "AFG",      2006,         0,       2,        NA
    "AFG",      2007,         0,       2,      64.0
    "AFG",      2008,         0,       2,      63.0
    "AGO",      2006,         0,       1,       0.0
    "AGO",      2007,         0,       1,      83.0
    "AGO",      2008,         0,       1,      81.0

This can only be invoked if the touchstone is in `in-preparation`.

## POST /touchstones/{touchstone-id}/actions/associate_coverage_set/
Associates or unassociates a given scenario and coverage set.

Required permissions: `touchstones.prepare`

Schema: [`AssociateCoverageSet.schema.json`](AssociateCoverageSet.schema.json)

### Example
    {
        "action": "add",
        "scenario_id": "Measles-Routine-NoGavi",
        "coverage_set_id": 189
    }

An error occurs (and no changes are made) if:
* The touchstone is not `in-preparation`
* The coverage set does not contain data for all expected countries in the scenario.
* The coverage set has a different vaccine than the scenario.
* The coverage set is `campaign` and the scenario is `routine`. (All other combinations are acceptable)

# Burden estimates
## GET /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/estimate-sets/
Returns metadata for all burden estimates that have been uploaded for this 
responsibility.

Required permissions: Scoped to modelling group: `estimates.read`, `responsibilities.read`. If the estimates belong to a touchstone that is `open` then they are only returned if the user has `estimates.read-unfinished` (again scoped to the modelling group)

Schema: [`BurdenEstimates.schema.json`](BurdenEstimates.schema.json)

### Example
    [
        {
            "id": 1,
            "uploaded_by": "tgarske",
            "uploaded_on": "2017-10-06T11:18:06Z",
            "type": {
                "type": "central-averaged",
                "details": "Mean over all stochastic runs"
            },
            "problems": [],
            "status": "complete"
        }
    ]

## GET /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/estimate-sets/{estimate-id}/
Returns the full burden estimate data.

Required permissions: Scoped to modelling group: `estimates.read`, `responsibilities.read`. If the estimates belong to a touchstone that is `open` then they are only returned if the user has `estimates.read-unfinished` (again scoped to the modelling group)

If the client sends an Accept header of `application/json` then it returns 
multipart data with two sections, separated by a line of three dashes. The first
section is JSON metadata; the second section is CSV data. If the client sends
an Accept header of `text/csv` only the CSV data is returned.

### JSON metadata
Schema: [`BurdenEstimateSet.schema.json`](BurdenEstimateSet.schema.json)

### Example
    {
        "id": 1,
        "uploaded_by": "tgarske",
        "uploaded_on": "2017-10-06T11:18:06Z",
        "type": {
            "type": "central-averaged",
            "details": "Mean over all stochastic runs"
        },
        "problems": [],
        "status": "empty"
    }

### CSV data
The last four columns will vary based on which outcomes are present in the 
database. There may be more or fewer columns.

    "disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
       "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
       "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
       "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
       "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870


## POST /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/estimates/
** DEPRECATED **
Adds a new burden estimate.

Can only by invoked if:

* The touchstone is `open`
* The relevant responsibility set is `incomplete`

Required permissions: Scoped to modelling group: `estimates.write`, `responsibilities.read`.

Takes CSV data in the following format. Note that the last four columns are
based on which outcomes you wish to upload values for. More or fewer columns
are allowed so long as all the outcome columns correspond to allowed burden
outcomes in the database.

    "disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
       "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
       "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
       "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
       "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870
       
       
## POST /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/estimate-sets/
Creates a new, empty burden estimate set.

Can only by invoked if:

* The touchstone is `open`
* The relevant responsibility set is `incomplete`

Required permissions: Scoped to modelling group: `estimates.write`, `responsibilities.read`.

Returns the integer id of the new set.

### JSON metadata
Schema: [`CreateBurdenEstimateSet.schema.json`](CreateBurdenEstimateSet.schema.json)

### Example
    {
        "type": {
            "type": "central-averaged",
            "details": "Mean over 100 runs"
        },
        "model_run_parameter_set": 1
    }

## POST /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/estimate-sets/{set-id}/
Populates an empty burden estimate set.

Can only by invoked if:

* The set status is `empty`
* The touchstone is `open`
* The relevant responsibility set is `incomplete`

Required permissions: Scoped to modelling group: `estimates.write`, `responsibilities.read`.

Takes CSV data in the following format. Note that the last four columns are
based on which outcomes you wish to upload values for. More or fewer columns
are allowed so long as all the outcome columns correspond to allowed burden
outcomes in the database.

    "disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
       "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
       "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
       "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
       "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870

If the burden estimate set was created with type 'stochastic' then an additional
column, `run_id`, is expected between `disease` and `year`. See 
[BurdenEstimate.csvschema.json](BurdenEstimate.csvschema.json) and 
[StochasticBurdenEstimate.csvschema.json]([StochasticBurdenEstimate.csvschema.json])
for a strict definition.
       
# Modelling groups
## GET /modelling-groups/
Returns an enumeration of all modelling groups.

Required permissions: `modelling-groups.read`

Schema: [`ModellingGroups.schema.json`](ModellingGroups.schema.json)

### Example
    [
        {
            "id": "IC-YellowFever",
            "description": "Imperial College, Yellow Fever, PI: Tini Garske"
        },
        {
            "id": "LSHTM-Measles",
            "description": "London School of Hygiene and Tropical Medicine, PI: Mark Jit"
        }
    ]

## GET /modelling-groups/{modelling-group-id}/
Returns the identified modelling group and their model(s).

Required permissions: `modelling-groups.read`, `models.read`.

Schema: [`ModellingGroupDetails.schema.json`](ModellingGroupDetails.schema.json)

### Example
    {
        "id": "IC-YellowFever",
        "description": "Imperial College, Yellow Fever, PI: Tini Garske",
        "models": [
            {
                "id": "IC-YF-WithoutHerd",
                "description": "YF burden estimate - without herd effect",
                "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
                "modelling_group": "IC-YellowFever"
            }
        ],
        "members": [ "john.smith" ]
    }

## POST /modelling-groups/
Creates a new modelling group.

Required permissions: `modelling-groups.write`

Schema: [`ModellingGroup.schema.json`](ModellingGroup.schema.json)

### Example
    {
        "id": "NEW-UNIQUE-ID",
        "description": "DESCRIPTION"
    }

## GET /modelling-groups/{modelling-group-id}/members/
Returns all users in the modelling group.

Required permissions: `users.read`, `modelling-groups.read`. Additionally, roles are only included if the user has `roles.read`, scoped to this group (or to *)

Schma: [`Users.schema.json`](Users.schema.json)

### Example
    [
        {
            "username": "joe",
            "name": "Joe Bloggs",
            "email": "example@imperial.ac.uk",
            "last_logged_in": "2017-10-06T11:06:22Z",
            "roles": [ 
                { 
                    "name": "user", 
                    "scope_prefix": null, 
                    "scope_id": null 
                },
                { 
                    "name": "modelling-group.member",
                    "scope_prefix": "modelling-group",
                    "scope_id": "IC-YellowFever" 
                }
            ],
            "modelling_groups": [ "IC-YellowFever" ]
        }
    ]

## POST /modelling-groups/{modelling-group-id}/actions/associate_member/
Adds or removes a user from a modelling group.

Required permissions: `modelling-groups.manage-members` (scoped to the group or *)

Schema: [`AssociateUser.schema.json`](AssociateUser.schema.json)

### Example
    {
        "action": "add",
        "username": "joe"
    }

# Models
## GET /models/
Returns an enumeration of all models

Required permissions: `models.read`

Schema: [`Models.schema.json`](Models.schema.json)

### Example
    [
        { 
            "id": "IC-YF-WithoutHerd",
            "description": "YF burden estimate - without herd effect",
            "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
            "modelling_group": "IC-YellowFever"
        },
        { 
            "id": "LSHTM-DynaMice",
            "description": "DynaMice",
            "citation": "Dynamic Citation",
            "modelling_group": "LSHTML-Jit"
        }
    ]

## GET /models/{model-id}/
Returns a model and all its versions.

Required permissions: `models.read`

Schema: [`ModelDetails.schema.json`](ModelDetails.schema.json)

### Example
    {
        "metadata": {
            "id": "IC-YF-WithoutHerd",
            "description": "YF burden estimate - without herd effect",
            "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
            "modelling_group": "IC-YellowFever"
        },
        "versions": [
            { 
                "model": "IC-YF-WithoutHerd",
                "version": "1.0.0",
                "note": "Some notes",
                "fingerprint": null
            },
            { 
                "model": "IC-YF-WithoutHerd",
                "version": "1.1.0",
                "note": "Some notes about 1.1 release",
                "fingerprint": "4b0bef9edfb15ac02e7410b21d8ed3398fa52982"
            }
        ]
    }

## POST /models/
Creates a new model.

Required permissions: `models.write` scoped to the modelling group (or *).

Schema: [`Model.schema.json`](Model.schema.json)

### Example
    { 
        "id": "NEW-UNIQUE-ID",
        "description": "DESCRIPTION",
        "citation": "CITATION",
        "modelling_group": "ID-OF-EXISTING-MODELLING-GROUP"
    }

## POST /models/{model-id}/versions
Adds a new version to a model

Required permissions: `models.write` scoped to the modelling group (or *).

Schema: [`CreateModelVersion.schema.json`](CreateModelVersion.schema.json)

### Example
    {
        "version": "5.7-stable",
        "note": "Notes about what's changed in the model",
        "fingerprint": null
    }
    
## GET /modelling-groups/{modelling-group-id}/model_run_parameter_sets/{touchstone-id}/
Returns a list of model run parameter sets that the given modelling group has uploaded for responsibilities in the 
 given touchstone.

Required permissions: Scoped to modelling group: `responsibilities.read`.

Schema: [`ModelRunParameterSets.schema.json`](ModelRunParameterSets.schema.json)

### Example
    [
        {
            "id": 1,
            "description": "our first set of parameters",
            "model": "HPVGoldie-flat",
            "uploaded_by": "tgarske",
            "uploaded_on": "2017-10-06T11:18:06Z"   
        }
    ]
    
## POST /modelling-groups/{modelling-group-id}/model_run_parameter_sets/{touchstone-id}/

Required permissions: Scoped to modelling group: `estimates.write`.

Creates a new model run parameter set for the given model. Accepts multipart/form-data with one text part named "description",
 which should a human readable description for the new set, one text part named "disease", which must be a valid disease
  id, and one file part named "file", which must be CSV data in the following format

    "run_id", "param_1", "param_2", 
       "1",   10,    50,
       "2",   10,    60,
       "3",   20,    50,


# Responsibilities
## GET /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/
Returns an enumerations of the responsibilities of this modelling group in the given touchstone,
and the overall status of this modelling groups work in this touchstone.

If the touchstone is `in-preparation`, and the user does not have permission to see touchstones 
before they are made `open`, then this returns an error 404.

Required permissions: Global scope: `scenarios.read`. Scoped to modelling group: `responsibilities.read`. Additionally, to view responsibilities for an `in-preparation` touchstone, the user needs the `touchstones.prepare` permission.

Schema: [`ResponsibilitySet.schema.json`](ResponsibilitySet.schema.json)

### Example
    {
        "touchstone": "2017-op-1",
        "status": "incomplete",
        "problems": "",
        "responsibilities": [
            {
                "scenario": {
                    "id": "menA-novacc",
                    "touchstones": [ "2016-op-1", "2017-wuenic-1", "2017-op-1" ],
                    "description": "Menigitis A, No vaccination",
                    "disease": "MenA"
                },
                "countries": ["AFG", "AGO"],
                "years": {
                    "start": 1900,
                    "end": 2050
                },
                "status": "empty",
                "problems": [ "No burden estimates have been uploaded" ],
                "current_estimate_set": null
            },        
            {
                "scenario": {
                    "id": "yf-campaign-reactive-nogavi",
                    "touchstones": [ "2017-wuenic-1", "2017-op-1" ],
                    "description": "Yellow Fever, Reactive campaign, SDF coverage without GAVI support",
                    "disease": "YF"
                },
                "countries": ["AFG", "AGO"],
                "years": {
                    "start": 1900,
                    "end": 2050
                },
                "status": "invalid",
                "problems": [
                    "Missing data for these countries: AFG",
                    "There are negative burden numbers for some outcomes."
                ],
                "current_estimate_set": {                    
                    "id": 1,                  
                    "uploaded_on": "2017-10-06T11:18:06Z",
                    "uploaded_by": "tini.garske",
                    "type": {
                        "type": "central-averaged",
                        "details": "Mean over all stochastic runs"
                    },
                    "problems": [],
                    "status": "complete"
                }
            }
        ]
    }

If they have no responsibilities, `status` is null.

Schema: [`ResponsibilitySet.schema.json`](ResponsibilitySet.schema.json)

### Example
    {
        "touchstone": "2017-op-1",
        "status": null,
        "problems": "",
        "responsibilities": []
    }

Note that even if a modelling group has no responsibilities in a given touchstone,
using this endpoint is not an error: an empty array will just be returned.

## PATCH /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/
Allows you to change the status of the responsibility set.

Can only move the responsibility set to `submitted` if:

* The status is `incomplete`
* All responsibilities have the status `valid`

Required permissions: `estimates.submit`, scoped to the modelling group (or *)

Schema: [`EditResponsibilitySet.schema.json`](EditResponsibilitySet.schema.json)

### Example
    {
        "status": "submitted"
    }

Users in the reviewer role can change the status of the responsibility set when it is in `submitted`. 
They can change it to either `incomplete` or `approved`. If they change it to incomplete, they must include
at least one problem.

Required permissions: `estimates.review`, scoped to the modelling group (or *)

Schema: [`EditResponsibilitySet.schema.json`](EditResponsibilitySet.schema.json)

### Example
    {
        "status": "incomplete",
        "problems": "Please review the numbers for Afghanistan - they look much too high"
    }

## GET /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/
Returns the specified responsibility of this modelling group in the given touchstone.

If the touchstone is `in-preparation`, and the user does not have permission to see touchstones 
before they are made `open`, then this returns an error 404.

Required permissions: Global scope: `scenarios.read`. Scoped to modelling group: `responsibilities.read`. Additionally, to view responsibilities for an `in-preparation` touchstone, the user needs the `touchstones.prepare` permission.

Schema: [`ResponsibilityAndTouchstone.schema.json`](ResponsibilityAndTouchstone.schema.json)

### Example
    {
        "touchstone": { 
            "id": "2017-op-1",
            "name": "2017-op",
            "version": 1,            
            "description": "2017 Operational Forecast",
            "status": "finished"
        },
        "responsibility": {
            "scenario": {
                "id": "menA-novacc",
                "touchstones": [ "2016-op-1", "2017-wuenic-1", "2017-op-1" ],
                "description": "Menigitis A, No vaccination",
                "disease": "MenA"
            },
            "countries": ["AFG", "AGO"],
            "years": {
                "start": 1900,
                "end": 2050
            },
            "status": "empty",
            "problems": [ "No burden estimates have been uploaded" ],
            "current_estimate_set": null
        }
    }

## GET /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/coverage_sets/
Returns metadata for the coverage sets associated with the responsibility.

Required permissions: Global scope: `scenarios.read`. Scoped to modelling group: `responsibilities.read` and `coverage.read`.  Additionally, to view coverage sets for an `in-preparation` touchstone, the user needs the `touchstones.prepare` permission.

If the touchstone is `in-preparation`, and the user does not have permission to see touchstones 
before they are made `open`, then this returns an error 404.

Schema: [`ScenarioAndCoverageSets.schema.json`](ScenarioAndCoverageSets.schema.json)

### Example
    {
        "touchstone": { 
            "id": "2017-op-1",
            "name": "2017-op",
            "version": 1,            
            "description": "2017 Operational Forecast",
            "status": "finished"
        },
        "scenario": {
            "id": "menA-novacc",
            "touchstones": [ "2016-op-1", "2017-wuenic-1", "op-2017-1" ],
            "description": "Menigitis A, No vaccination",
            "disease": "MenA"
        },
        "coverage_sets": [ 
            { 
                "id": 101,
                "touchstone": "2017-op-1",
                "name": "Menigitis without GAVI support",
                "vaccine": "MenA",
                "gavi_support": "no gavi",
                "activity_type": "routine"
            },
            { 
                "id": 136,
                "touchstone": "2017-op-1",
                "name": "Menigitis with GAVI support",
                "vaccine": "MenA",
                "gavi_support": "total",
                "activity_type": "routine"
            }
        ]
    }

## GET /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/coverage/
Returns the amalgamated coverage data of all the coverage sets associated with this responsibility.

Required permissions: Global scope: `scenarios.read`. Scoped to modelling group: `responsibilities.read` and `coverage.read`.  Additionally, to view coverage data for an `in-preparation` touchstone, the user needs the `touchstones.prepare` permission.

If the touchstone is `in-preparation`, and the user does not have permission to see touchstones 
before they are made `open`, then this returns an error 404.

Depending on the "Accept" header sent by the client, there are two different
result formats. If "Accept" is "application/json" then both JSON metadata and 
CSV table data are returned, separated by a single line of three dashes. If
"Accept" is "text/csv" then only the CSV table data is returned.

### JSON metadata
Schema: [`ScenarioAndCoverageSets.schema.json`](ScenarioAndCoverageSets.schema.json)

#### Example
    {
        "touchstone": { 
            "id": "2017-op-1",
            "name": "2017-op",
            "version": 1,            
            "description": "2017 Operational Forecast",
            "status": "finished"
        },
        "scenario": {
            "id": "menA-novacc",
            "touchstones": [ "2016-op-1", "2017-wuenic-1", "op-2017-1" ],
            "description": "Menigitis A, No vaccination",
            "disease": "MenA"
        },
        "coverage_sets": [ 
            { 
                "id": 101,
                "touchstone": "2017-op-1",
                "name": "Menigitis without GAVI support",
                "vaccine": "MenA",
                "gavi_support": "no gavi",
                "activity_type": "routine"
            },
            { 
                "id": 136,
                "touchstone": "2017-op-1",
                "name": "Menigitis with GAVI support",
                "vaccine": "MenA",
                "gavi_support": "total",
                "activity_type": "routine"
            }
        ]
    }

Coverage sets are returned in the order they are to be applied.

### CSV table data
CSV data in this format:

       "scenario",                       "set_name", "vaccine", "gavi_support", "activity_type", country",    "year","age_first","age_last",  "age_range_verbatim", "target", coverage"
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",      2006,          0,         2,                    NA,       NA,        NA
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",      2007,          0,         2,                    NA,       NA,      64.0
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",      2008,          0,         2,                    NA,       NA,      63.0
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AGO",      2006,          0,         1,                    NA,       NA,       0.0
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AGO",      2007,          0,         1,"school aged children",  1465824,      83.0
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AGO",      2008,          0,         1,                    NA,       NA,      81.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",      2006,          0,         2,                    NA,       NA,        NA
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",      2007,          0,         2,                    NA,       NA,      80.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",      2008,          0,         2,                    NA,       NA,      80.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AGO",      2006,          0,         1,                    NA,       NA,      20.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AGO",      2007,          0,         1,                    NA,       NA,      90.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AGO",      2008,          0,         1,                    NA,       NA,      95.0

The coverage sets are de-normalized and merged into this single table. You can 
identify which coverage set a line is from using `scenario` plus `vaccine`, 
`gavi_support` and `activity_type`. Note that we don't expect the modellers to
need to know which coverage set the data is from.

### Query parameters:

#### format
Optional. A format to return the CSV in, either `wide` or `long`. Defaults to `long`.

Example wide format:

       "scenario",                       "set_name", "vaccine", "gavi_support", "activity_type", country",    "age_first","age_last",  "age_range_verbatim", "target_2006", "coverage_2006", "target_2007", "coverage_2007"
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",    0,         2,                    NA,                      NA,            83.1,          80.0,            79.1
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",    0,         1,                    NA,                      NA,            86.5,          88.3             82.2
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",    0,         2,                    NA,                      NA,            84.5,          89.4             82.4
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",    0,         1,                    NA,                      NA,            86.5,          90.6             91.7
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "campaign",   "AFG",    0,         2,                    NA,                      NA,            87.5,          93.4             98.2
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "campign",    "AFG",    0,         1,                    NA,                      NA,            88.5,          90.6             98.1


### Onetime Link
A client may make a GET request to 
`/modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/coverage/get_onetime_link/`.
This endpoint requires the same permissions as getting the coverage directly.
It returns a onetime token that can be used to get the coverage data in CSV 
format without authentication. See [Onetime Link](onetime-link-spec.md).

## POST /modelling-groups/{modelling-group-id}/actions/associate_responsibility
Adds or removes a responsibility for a given modelling group, scenario, and touchstone.

Required permissions: `responsibilities.write`

Schema: [`AssociateResponsibility.schema.json`](AssociateResponsibility.schema.json)

### Example
    {
        "action": "add",
        "touchstone_id": "2017-op-1",
        "scenario_id": "menA-novacc"
    }

Removing an responsibility that does not exist, or adding one that already exists, are both allowed
operations that will have no effect.

This can be only be invoked in the touchstone is in the 'in-preparation' or 'open' states
(so not submitted to GAVI).

# Status
## GET /touchstones/{touchstone-id}/overview/
Returns a summary of the completeness and correctness of the touchstone, so that the VIMC 
administrator can track progress. This is useful when the touchstone is `in-preparation` 
and when it is `open` and the modelling groups are working on it.

Example URL: `/touchstones/2017-op-1/status/`

`allowed_state_changes` tells the client which states the touchstone is currently allowed to move in to.

* When the touchstone is `in-preparation` it can move into `open` when there are no outstanding problems. 
* When it is `open`, it can move into `finished` when all responsibility sets are in the `approved` status.

Note that countries cannot have problems in the current version of the spec as I have left
off all details relating to demographic data. The `problems` array is included here, as I expect
later we will want to communicate problems with missing or invalid demographic data.

Required permissions: `touchstones.read`, `scenarios.read`, `modelling-groups.read`

### In preparation
Schema: [`TouchstoneOverview.schema.json`](TouchstoneOverview.schema.json)

#### Example
    {
        "id": "2017-op-1",
        "description": "2017 Operational Forecast",
        "status": "in-preparation",
        "allowed_state_changes": [],
        "sections": {
            "countries": {
                "used": [
                    {
                        "id": "AFG",                    
                        "problems": []
                    },
                    {
                        "id": "AGO",                    
                        "problems": []
                    }
                ],
                "unused": [ "CAF", "MAD" ]
            },
            "scenarios": {
                "used": [
                    {
                        "id": "menA-novacc",
                        "problems": [
                            "Missing coverage data"
                        ]
                    },
                    {
                        "id": "menA-routine-nogavi",
                        "problems": []
                    }
                ],
                "unused": [ "menA-routine-gavi" ]
            },
            "modelling_groups": {
                "used": [
                    { 
                        "id": "IC-YellowFever",
                        "responsibilities_status": null,
                        "responsibilities": [
                            { 
                                "id": "yf-routine-novacc",
                                "status": "empty"
                            },
                            { 
                                "id": "yf-routine-nogavi",
                                "status": "empty"
                            }
                        ]
                    }
                ],
                "unused": [ "LSHTM-Measles" ]
            }
        }
    }

### Open
Schema: [`TouchstoneOverview.schema.json`](TouchstoneOverview.schema.json)

#### Example
    {
        "id": "2017-op-1",
        "description": "2017 Operational Forecast",
        "status": "open",
        "allowed_state_changes": [],
        "sections": {
            "countries": {
                "used": [
                    {
                        "id": "AFG",
                        "problems": []
                    },
                    {
                        "id": "AGO",                    
                        "problems": []
                    }
                ],
                "unused": [ "CAF", "MAD" ]
            },
            "scenarios": {
                "used": [
                    {
                        "id": "menA-novacc",
                        "problems": []
                    },
                    {
                        "id": "menA-routine-nogavi",
                        "problems": []
                    }
                ],
                "unused": [ "menA-routine-gavi" ]
            },
            "modelling_groups": {
                "used": [
                    { 
                        "id": "IC-YellowFever",
                        "responsibilities_status": "submitted",
                        "responsibilities": [
                            { 
                                "id": "yf-routine-novacc",
                                "status": "invalid"
                            },
                            { 
                                "id": "yf-routine-nogavi",
                                "status": "valid"
                            }
                        ]
                    }
                ],
                "unused": [ "LSHTM-Measles" ]
            }
        }
    }

# Demographics
## GET /touchstones/{touchstone-id}/demographics/

Returns a list of available demographic data sets for this touchstone, including for each data set
whether multiple gender options are available.

Required permissions: `demographics.read`.

Schema: [`Demographics.schema.json`](Demographics.schema.json)

### Example
    [{ 
        "id" : "as-fert",
        "name": "Age-specific fertility",
        "source" : "unwpp2015",
        "gender_is_applicable": false
     },
     { 
        "id" : "tot-pop",
        "name" : "Total population",        
        "source" : "unwpp2015",
        "gender_is_applicable": true
     }]

## GET /touchstones/{touchstone-id}/demographics/{source-code}/{demographic-type-code}/

Returns the data set with given type. This data is returned in two parts: First the metadata, then the coverage in CSV format.

### Metadata
Schema: [`DemographicDataForTouchstone.schema.json`](DemographicDataForTouchstone.schema.json)

#### Example
    {
        "touchstone": { 
            "id": "2017-op-1",
            "name": "2017-op",
            "version": 1,            
            "description": "2017 Operational Forecast",
            "status": "finished"
        },
        "demographic_data":  { 
            "id" : "as-fert",
            "name": "Age-specific fertility",
            "source" : "UNWPP 2015",
            "countries" : ["AFG"],
            "age_interpretation": "age of mother (years)",
            "unit" : "avg births/mother"
        }
    }
    
### CSV
    
    "country_code_numeric", "country_code", "country","age of mother (years)",  "year", "avg births/mother"
    004,                    "AFG",          "Afghanistan",           "15-19",    1950,                 1.2
    004,                    "AFG",          "Afghanistan",           "15-19",    1955,                 1.2
    004,                    "AFG",          "Afghanistan",           "15-19",    1960,                 1.2   
    004,                    "AFG",          "Afghanistan",           "15-19",    1965,                 1.1   
    004,                    "AFG",          "Afghanistan",           "15-19",    1970,                 1.1   
    004,                    "AFG",          "Afghanistan",           "15-19",    1975,                 1.1  
    004,                    "AFG",          "Afghanistan",           "15-19",    1980,                 1.1  
    004,                    "AFG",          "Afghanistan",           "15-19",    1985,                 1.1  
    004,                    "AFG",          "Afghanistan",           "15-19",    1990,                 1.1 
    004,                    "AFG",          "Afghanistan",           "15-19",    1995,                 1.1 
         
### Example
    {
        "touchstone": { 
            "id": "2017-op-1",
            "name": "2017-op",
            "version": 1,            
            "description": "2017 Operational Forecast",
            "status": "finished"
        },
        "demographic_data":  { 
            "id" : "tot-pop",
            "name": "Total population",
            "source" : "UNWPP 2015",
            "countries" : ["AFG"],
            "age_interpretation": "age (years)",
            "unit" : "people",
            "gender" : "both"
        }
    }
    
Total population:
         
     "country_code_numeric", "country_code", "country",     "age (years)",  "gender",  "year",   "people"
      004,                   "AFG",          "Afghanistan", "0-0",    "both",    1950,      82724
      004,                   "AFG",          "Afghanistan", "0-0",    "both",    1951,      84699
      004,                   "AFG",          "Afghanistan", "0-0",    "both",    1952,      87807
      004,                   "AFG",          "Afghanistan", "0-0",    "both",    1953,      89014
      004,                   "AFG",          "Afghanistan", "0-0",    "both",    1954,      89993
                

### Query parameters:

#### gender
Optional. The gender to return, either `female`, `male`, or `both`. Defaults to `both`.

#### format
Optional. A format to return the CSV in, either `wide` or `long`. Defaults to `long`.

Example:
`/touchstones/2017-op-1/demographics/unwpp2015/tot_pop/?format=wide&gender=female`

Total population:

                "",       "",      "", "people"
         "country_code_numeric", "country_code", "country",     "gender",   "age",    1950,    1951,    1952,    1953,    1954, ...                             
         004,                    "AFG",          "Afghanistan", "female",   "0-0",   82724,    84699,   87807,   89014,  89993, ... 
         004,                    "AFG",          "Afghanistan", "female",   "1-1",   88021,    89725,   91720,   91726,  91727, ...   
         004,                    "AFG",          "Afghanistan", "female",   "2-2",   91720,    91784,   91884,   91920,  92679, ...   
         004,                    "AFG",          "Afghanistan", "female",   "3-3",   95671,    95612,   95700,   95724,  95780, ...   
         004,                    "AFG",          "Afghanistan", "female",   "4-4",   96103,    97724,   99720,  100120, 101103, ...   