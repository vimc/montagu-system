# VIMC draft API
# General points
* All data returned is in JSON format. POST and PUT data is expected as a string containing JSON-formatted data.
* Dates and times are returned as strings according to the ISO 8601 standard.
* Unless otherwise noted, URLs and IDs embedded in URLs are case-sensitive.
* The canonical form for all URLs (not including query string) ends in a slash: `/`.
* The API will be versioned via URL. So for version 1, all URLs will begin `/v1/`. e.g. `http://vimc.dide.ic.ac.uk/api/v1/diseases/`

# Issues to be resolved:
* CSV options for some endpoints

# Security
Permissions are listed for each endpoint. All endpoints are assumed to require the `can-login` permission unless otherwise noted.

See also [Security.md](Security.md).

# Standard response format
All responses are returned in a standard format. Throughout this specification, 
wherever an endpoint describes its response format, it should be assumed the payload is wrapped in
the standard response format, so that the `data` property holds the payload.

## Success
Schema: [`Response.schema.json`](Response.schema.json)

Example

    {
        "status": "success",
        "data": {},
        "errors": []
    }

## Error
Schema: [`Response.schema.json`](Response.schema.json)

Example

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

* The role specified must match have a scope prefix that matches `SCOPE_PREFIX`
* The scope_id must be specified and must match `SCOPE_ID`

For simple roles (see [Security.md](Security.md)) no scope should be specified.

Schema: [`AssociateRole.schema.json`](AssociateRole.schema.json)

### Example
    {
        "action": "add",
        "scope_prefix": null,
        "name": "touchstones.open"
    }

For complex roles, the scope_id must be provided. When removing an association, if the scope
and role do not both match an existing association, no change is made. Note that you just
provide a scope_id here - the scope prefix is automatically added.

Schema: [`AssociateRole.schema.json`](AssociateRole.schema.json)

### Example
    {
        "action": "remove",
        "scope_prefix": "modelling-group",
        "name": "member",
        "scope_id": "IC-YellowFever"
    }

## POST /users/{username}/actions/remove_all_access/
Removes all roles from a user that match the given scope. If the scope is `*`, all roles are removed.

Required permissions: `roles.write` with scope matching scope in URL.

For example, to remove all permissions from user `martin` for modelling group `IC-YellowFever`, the URL
would be `/users/martin/actions/remove_all_access/modelling-group:IC-YellowFever/`

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
            "touchstones": [ "2016-op", "2017-wuenic", "2017-op" ],
            "description": "Menigitis A, No vaccination",
            "vaccination_level": "none",
            "disease": "MenA",
            "vaccine": "MenA",
            "scenario_type": "none"
        },
        {
            "id": "yf-campaign-reactive-nogavi",
            "touchstones": [ "2017-wuenic", "2017-op" ],
            "description": "Yellow Fever, Reactive campaign, SDF coverage without GAVI support",
            "vaccination_level": "without",
            "disease": "YF",
            "vaccine": "YF",
            "scenario_type": "campaign"
        }
    ]

### Query parameters:

#### touchstone
Optional. A touchstone id. Only returns scenarios that belong to that touchstone.

#### vaccine
Optional. A vaccine id. Only returns scenarios that match that vaccine.

Example: `/scenarios/?vaccine=MenA`

#### disease
Optional. A disease id. Only returns scenarios that match that disease.

Example: `/scenarios/?disease=YF`

#### vaccination_level
Optional. A vaccination level (none, without, with). Only returns scenarios that match that vaccination level.

Example: `/scenarios/?vaccination_level=with`

#### scenario_type
Optional. A scenario type (none, routine, campaign). Only returns scenarios that match that scenario type.

Example: `/scenarios/?scenario_type=routine`

## POST /scenarios/
Creates a new scenario. Request format:

Schema: [`CreateScenario.schema.json`](CreateScenario.schema.json)

Required permissions: `scenarios.write`

### Example
    {
        "id": "ID",
        "description": "DESCRIPTION",
        "vaccination_level": "none",
        "disease": "VALID-DISEASE-ID",
        "vaccine": "VALID-VACCINE-ID",
        "scenario_type": "none"
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
        "vaccination_level": "none",
        "disease": "VALID-DISEASE-ID",
        "vaccine": "VALID-VACCINE-ID",
        "scenario_type": "none"
    }

## DELETE /scenarios/{scenario-id}/
Deletes a scenario. This is only allowed if the scenario is 
not associated with any touchstone.

Required permissions: `scenarios.write`

## GET /scenarios/{scenario-id}/responsible_groups/{touchstone-id}
Returns an enumeration (potentially empty) of modelling groups who are responsible for this 
scenario in the given touchstone.

Required permissions: `scenarios.read`, `modellinggroups.read`, `responsibilities.read`

Schema: [`ModellingGroups.schema.json`](ModellingGroups.schema.json)

### Example
    [
        {
            "code": "IC-YellowFever",
            "description": "Imperial College, Yellow Fever, PI: Tini Garske"
        },
        {
            "code": "LSHTM-Jit",
            "description": "London School of Hygiene and Tropical Medicine, PI: Mark Jit"
        }
    ]

See `POST /modelling-groups/{modelling-group-code}/actions/associate_responsibility` for editing 
this data.

# Touchstones
## GET /touchstones/
Returns an enumeration of all touchstones.

Required permissions: `touchstones.read`. To see touchstones that are `in-preparation` the user further requires `touchstones.prepare`.

Schema: [`Touchstones.schema.json`](Touchstones.schema.json)

### Example
    [
        { 
            "id": "2017-wuenic",
            "description": "2017 WUENIC Update",
            "years": { "start": 1996, "end": 2017 },
            "status": "finished"
        },
        { 
            "id": "2017-op",
            "description": "2017 Operational Forecast",
            "years": { "start": 1996, "end": 2081 },
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
         "description": "A description",
         "years": { "start": 2000, "end": 2100 }
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

Schema: [`ScenariosInTouchstone.schema.json`](ScenariosInTouchstone.schema.json)

### Example
    [
        {
            "scenario": {
                "id": "menA-novacc",
                "touchstones": [ "2016-op", "2017-wuenic", "2017-op" ],
                "description": "Menigitis A, No vaccination",
                "vaccination_level": "none",
                "disease": "MenA",
                "vaccine": "MenA",
                "scenario_type": "none"
            },
            "coverage_sets": [ 
                { 
                    "id": 101,
                    "touchstone": "2017-op",
                    "name": "Menigitis no vaccination",
                    "coverage_type": "none",
                    "vaccine": "MenA",
                    "vaccination_level": "none"
                }
            ]
        },
        {
            "scenario": {
                "id": "yf-campaign-reactive-nogavi",
                "touchstones": [ "2017-wuenic", "2017-op" ],
                "description": "Yellow Fever, Reactive campaign, SDF coverage without GAVI support",
                "vaccination_level": "without",
                "disease": "YF",
                "vaccine": "YF",
                "scenario_type": "campaign"
            },
            "coverage_sets": [
                { 
                    "id": 643,
                    "touchstone": "2017-op",
                    "name": "Yellow fever birth dose (with GAVI support)",
                    "coverage_type": "routine",
                    "vaccine": "YF",
                    "vaccination_level": "with"
                },
                { 
                    "id": 643,
                    "touchstone": "2017-op",
                    "name": "Yellow fever reactive campaign (with GAVI support)",
                    "coverage_type": "campaign",
                    "vaccine": "YF",
                    "vaccination_level": "with"
                }
            ]
        }
    ]

Note that the coverage sets returned are just those that belong to the touchstone in the URL.
In other words, if the same scenario is associated with other coverage
sets in a different touchstone, those are not returned here.

The returned scenarios can be filtered using the same query parameters as `GET /scenarios`, with the exception that the touchstone parameter is ignored.

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
            "touchstone": "2017-op",
            "name": "Measles 1st Dose (without GAVI support)",
            "coverage_type": "routine",
            "vaccine": "MCV1",
            "vaccination_level": "without"
        },
        {
            "id": 278,
            "touchstone": "2017-op",
            "name": "Measles 2nd Dose (without GAVI support)",
            "coverage_type": "routine",
            "vaccine": "MCV2",
            "vaccination_level": "without"
        },
        {
            "id": 290,
            "touchstone": "2017-op",
            "name": "Yellow Fever reactive campaign (with GAVI support)",
            "coverage_type": "campaign",
            "vaccine": "YF",
            "vaccination_level": "with"
        }
    ]

### Query parameters
#### coverage_type
Optional. Takes either 'routine' or 'campaign'. The coverage sets are filtered to the specified coverage type.

Example: `/touchstones/2017-op/coverage_sets/?coverage_type=campaign`

#### vaccine
Optional. Takes a valid vaccine identifier. The coverage sets are filtered to the specified vaccine.

Example: `/touchstones/2017-op/coverage_sets/?vaccine=MCV1`

## GET /touchstones/{touchstone-id}/coverage_sets/{coverage-set-id}/
Returns a single coverage set and its coverage data.

Required permissions: `coverage.read`

Schema: [`CoverageSet.schema.json`](CoverageSet.schema.json)

### Example
    {
        "metadata": {
            "id": 189,
            "touchstone": "2017-op",        
            "name": "Measles 1st Dose (With GAVI support)",
            "coverage_type": "routine",
            "vaccine": "Measles",
            "vaccination_level": "with"
        },
        "data": [
            { "country": "AFG", "year": 2006, "age_from": 0, "age_to": 2, "coverage":  0.0 },
            { "country": "AFG", "year": 2007, "age_from": 0, "age_to": 2, "coverage": 64.0 },
            { "country": "AFG", "year": 2008, "age_from": 0, "age_to": 2, "coverage": 63.0 },
            { "country": "AGO", "year": 2006, "age_from": 0, "age_to": 1, "coverage":  0.0 },
            { "country": "AGO", "year": 2007, "age_from": 0, "age_to": 1, "coverage": 83.0 },
            { "country": "AGO", "year": 2008, "age_from": 0, "age_to": 1, "coverage": 81.0 }
        ]
    }

### Query parameters
#### countries
Optional. Takes a list of country codes. The coverage data is filtered to just the specified countries.

Example: `/touchstones/2017-op/coverage_sets/189/?countries=AFG,ANG,CHN`

## POST /touchstones/{touchstone-id}/coverage_sets/
Adds a new coverage set to the touchstone

Required permissions: `coverage.write`

Schema: [`CreateCoverageSet.schema.json`](CreateCoverageSet.schema.json)

### Example
    {
        "name": "Measles 1st dose",
        "vaccine": "MCV1",
        "coverage_type": "routine",
        "data": [
            { "country": "AFG", "year": 2006, "age_from": 0, "age_to": 2, "coverage":  0.0 },
            { "country": "AFG", "year": 2007, "age_from": 0, "age_to": 2, "coverage": 64.0 },
            { "country": "AFG", "year": 2008, "age_from": 0, "age_to": 2, "coverage": 63.0 },
            { "country": "AGO", "year": 2006, "age_from": 0, "age_to": 1, "coverage":  0.0 },
            { "country": "AGO", "year": 2007, "age_from": 0, "age_to": 1, "coverage": 83.0 },
            { "country": "AGO", "year": 2008, "age_from": 0, "age_to": 1, "coverage": 81.0 }
        ]
    }

This adds a new coverage set for this touchstone. It then needs to be associated with 1 or more
scenarios. This can only be invoked if the touchstone is in `in-preparation`. An error
occurs if the name matches an existing coverage set in this touchstone.

## PUT /touchstones/{touchstone-id}/coverage_sets/{coverage-set-id}/
Replaces the data in an existing coverage set.

Required permissions: `coverage.write`

Schema: [`CreateCoverageSet.schema.json`](CreateCoverageSet.schema.json)

### Example
    {
        "name": "Measles 1st dose",
        "vaccine": "MCV1",
        "coverage_type": "routine",
        "data": [
            { "country": "AFG", "year": 2006, "age_from": 0, "age_to": 2, "coverage":  0.0 },
            { "country": "AFG", "year": 2007, "age_from": 0, "age_to": 2, "coverage": 64.0 },
            { "country": "AFG", "year": 2008, "age_from": 0, "age_to": 2, "coverage": 63.0 },
            { "country": "AGO", "year": 2006, "age_from": 0, "age_to": 1, "coverage":  0.0 },
            { "country": "AGO", "year": 2007, "age_from": 0, "age_to": 1, "coverage": 83.0 },
            { "country": "AGO", "year": 2008, "age_from": 0, "age_to": 1, "coverage": 81.0 }
        ]
    }

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
## GET /touchstone/{touchstone-id}/estimates/
Returns all burden estimates that have been uploaded for this touchstone.

Required permissions: `estimates.read`, `scenarios.read`, `modelling-groups.read`. If the estimates belong to a touchstone that is `open` then they are only returned if the user has `estimates.read-unfinished` scoped to the uploading modelling group (or to the more permissive * scope)

Schema: [`BurdenEstimates.schema.json`](BurdenEstimates.schema.json)

### Example
    [
        {
            "id": 1,
            "scenario": {
                "id": "menA-novacc",
                "touchstones": [ "2016-op", "2017-wuenic", "2017-op" ],
                "description": "Menigitis A, No vaccination",
                "vaccination_level": "none",
                "disease": "MenA",
                "vaccine": "MenA",
                "scenario_type": "none"
            },
            "responsible_group": {
                "code": "IC-YellowFever",
                "description": "Imperial College, Yellow Fever, PI: Tini Garske"
            },
            "uploaded_by": "tgarske",
            "uploaded_on": "2017-10-06T11:18:06Z"
        }
    ]

## GET /touchstone/{touchstone-id}/estimates/{estimate-id}/
Returns the full burden estimate data.

If the touchstone is `open` then users without appropriate admin permissions can only 
see estimates that their modelling group has uploaded. If the touchstone is `finished` 
then all users can see all estimates. There should not be any estimates if
the touchstone is `in-preparation`.

Required permissions: `estimates.read`, `scenarios.read`, `modelling-groups.read`. If the estimate belongs to a touchstone that is `open` then it are only returned if the user has `estimates.read-unfinished` scoped to the uploading modelling group (or to the more permissive * scope)

Schema: [`BurdenEstimateWithData.schema.json`](BurdenEstimateWithData.schema.json)

### Example
    {
        "metadata": {
            "id": 1,
            "scenario": {
            "id": "menA-novacc",
                "touchstones": [ "2016-op", "2017-wuenic", "2017-op" ],
                "description": "Menigitis A, No vaccination",
                "vaccination_level": "none",
                "disease": "MenA",
                "vaccine": "MenA",
                "scenario_type": "none"
            },
            "responsible_group": {
                "code": "IC-YellowFever",
                "description": "Imperial College, Yellow Fever, PI: Tini Garske"
            },
            "uploaded_by": "tgarske",
            "uploaded_on": "2017-10-06T11:18:06Z"
        },
        "data": [
            { 
                "country_id": "AFG",
                "data": [
                    { "year": 1996, "deaths": 1000, "cases": 2000 },
                    { "year": 1997, "deaths":  900, "cases": 2050 }
                ]
            },
            { 
                "country_id": "AGO",
                "data": [
                    { "year": 1996, "deaths": 1000, "dalys": 5670 },
                    { "year": 1997, "deaths": 1200, "dalys": 5870 }
                ]
            }
        ]
    }

## POST /touchstone/{touchstone-id}/estimates/
Adds a new burden estimate.

Can only by invoked if:

* The touchstone is `open`
* The modelling group is responsible for the given scenario in the touchstone
* The relevant responsibility set is `incomplete`

Required permissions: `estimates.write`, scoped to the responsible group (or the more permissive * scope)

Schema: [`CreateBurdenEstimate.schema.json`](CreateBurdenEstimate.schema.json)

### Example
    {
        "scenario_id": "menA-novacc",
        "responsible_group_code": "IC-YellowFever",
        "data": [
            { 
                "country_id": "AFG",
                "data": [
                    { "year": 1996, "deaths": 1000, "cases": 2000 },
                    { "year": 1997, "deaths":  900, "cases": 2050 }
                ]
            },
            { 
                "country_id": "AGO",
                "data": [
                    { "year": 1996, "deaths": 1000, "dalys": 5670 },
                    { "year": 1997, "deaths": 1200, "dalys": 5870 }
                ]
            }
        ]
    }

# Modelling groups
## GET /modelling-groups/
Returns an enumeration of all modelling groups.

Required permissions: `modelling-groups.read`

Schema: [`ModellingGroups.schema.json`](ModellingGroups.schema.json)

### Example
    [
        {
            "code": "IC-YellowFever",
            "description": "Imperial College, Yellow Fever, PI: Tini Garske"
        },
        {
            "code": "LSHTM-Measles",
            "description": "London School of Hygiene and Tropical Medicine, PI: Mark Jit"
        }
    ]

## GET /modelling-groups/{modelling-group-code}/
Returns the identified modelling group, their model(s), and any touchstones they have responsibilities for.

Schema: [`ModellingGroupDetails.schema.json`](ModellingGroupDetails.schema.json)

Required permissions: `modelling-groups.read`, `models.read`, `responsibilities.read`.

### Example
    {
        "code": "IC-YellowFever",
        "description": "Imperial College, Yellow Fever, PI: Tini Garske",
        "models": [
            {
                "id": "IC-YF-WithoutHerd",
                "name": "YF burden estimate - without herd effect",
                "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
                "description": "Yellow Fever model",
                "modelling_group": "IC-YellowFever"
            }
        ],
        "responsibilities": [ "wuenic-2017", "2017-op" ]
    }

## POST /modelling-groups/
Creates a new modelling group.

Required permissions: `modelling-groups.write`

Schema: [`ModellingGroup.schema.json`](ModellingGroup.schema.json)

### Example
    {
        "code": "NEW-UNIQUE-CODE",
        "description": "DESCRIPTION"
    }

## GET /modelling-groups/{modelling-group-code}/members/
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
                "user",
                "modelling-group.member"
            ],
            "modelling_groups": [ "IC-YellowFever" ]
        }
    ]

## POST /modelling-groups/{modelling-group-code}/actions/associate_member/
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
            "code": "IC-YF-WithoutHerd",
            "name": "YF burden estimate - without herd effect",
            "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
            "description": "Yellow Fever model",
            "modelling_group": "IC-YellowFever"
        },
        { 
            "code": "LSHTM-DynaMice",
            "name": "DynaMice",
            "citation": null,
            "description": "DynaMice",
            "modelling_group": "LSHTML-Jit"
        }
    ]

## GET /models/{model-code}/
Returns a model and all its versions.

Required permissions: `models.read`

Schema: [`ModelDetails.schema.json`](ModelDetails.schema.json)

### Example
    {
        "code": "IC-YF-WithoutHerd",
        "name": "YF burden estimate - without herd effect",
        "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
        "description": "Yellow Fever model",
        "modelling_group": "IC-YellowFever",
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

Required permissions: `models.write`

Schema: [`Model.schema.json`](Model.schema.json)

### Example
    { 
        "code": "NEW UNIQUE CODE",
        "name": "MODEL NAME",
        "citation": null,
        "description": "DESCRIPTION",
        "modelling_group": "CODE OF EXISTING MODELLING GROUP"
    }

# Responsibilities
## GET /modelling-groups/{modelling-group-code}/responsibilities/{touchstone-id}
Returns an enumerations of the responsibilities of this modelling group in the given touchstone,
and the overall status of this modelling groups work in this touchstone.

If the touchstone is `in-preparation`, and the user does not have permission to see touchstones before they are made `open`,
then this returns an error 404.

Required permissions: `responsibilities.read`, `scenarios.read`

Schema: [`ResponsibilitySet.schema.json`](ResponsibilitySet.schema.json)

### Example
    {
        "touchstone": "2017-op",
        "status": "incomplete",
        "problems": "",
        "responsibilities": [
            {
                "scenario": {
                    "id": "menA-novacc",
                    "touchstones": [ "2016-op", "2017-wuenic", "2017-op" ],
                    "description": "Menigitis A, No vaccination",
                    "vaccination_level": "none",
                    "disease": "MenA",
                    "vaccine": "MenA",
                    "scenario_type": "none"
                },
                "status": "empty",
                "problems": [ "No burden estimates have been uploaded" ],
                "current_estimate": null
            },        
            {
                "scenario": {
                    "id": "yf-campaign-reactive-nogavi",
                    "touchstones": [ "2017-wuenic", "2017-op" ],
                    "description": "Yellow Fever, Reactive campaign, SDF coverage without GAVI support",
                    "vaccination_level": "without",
                    "disease": "YF",
                    "vaccine": "YF",
                    "scenario_type": "campaign"
                },
                "status": "invalid",
                "problems": [
                    "Missing data for these countries: AFG",
                    "There are negative burden numbers for some outcomes."
                ],
                "current_estimate": 37
            }
        ]
    }

If they have no responsibilities, `status` is null.

Schema: [`ResponsibilitySet.schema.json`](ResponsibilitySet.schema.json)

### Example
    {
        "touchstone": "2017-op",
        "status": null,
        "problems": "",
        "responsibilities": []
    }

Note that even if a modelling group has no responsibilities in a given touchstone,
using this endpoint is not an error: an empty array will just be returned.

## PATCH /modelling-groups/{modelling-group-code}/responsibilities/{touchstone-id}
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

## POST /modelling-groups/{modelling-group-code}/actions/associate_responsibility
Adds or removes a responsibility for a given modelling group, scenario, and touchstone.

Required permissions: `responsibilities.write`

Schema: [`AssociateResponsibility.schema.json`](AssociateResponsibility.schema.json)

### Example
    {
        "action": "add",
        "touchstone_id": "2017-op",
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

Example URL: `/touchstones/2017-op/status/`

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
        "id": "2017-op",
        "description": "2017 Operational Forecast",
        "years": { "start": 1996, "end": 2081 },
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
        "id": "2017-op",
        "description": "2017 Operational Forecast",
        "years": { "start": 1996, "end": 2081 },
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