# Vaccines
The vaccine API is identical to the disease API, but uses `/vaccines` as its 
base URI and `vaccines.write` as its required permissions.

# Countries
## GET /countries/
Returns all countries.

Note that countries gain other data when associated
with a particular point in time, via a touchstone. This part of the API
just tracks countries in their abstract sense, using ISO codes.

Required permissions: none

Schema: [`Countries.schema.json`](../schemas/Countries.schema.json)

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

Schema: [`Country.schema.json`](../schemas/Country.schema.json)

### Example
    {
        "id": "MDG",
        "name": "Madagascar"
    }

# Scenarios
## GET /scenarios/
Returns all scenarios.

Required permissions: `scenarios.read`, `touchstones.read`

Schema: [`Scenarios.schema.json`](../schemas/Scenarios.schema.json)

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

Schema: [`CreateScenario.schema.json`](../schemas/CreateScenario.schema.json)

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

Schema: [`UpdateScenario.schema.json`](../schemas/UpdateScenario.schema.json)

### Example

    {
        "description": "DESCRIPTION",
        "disease": "VALID-DISEASE-ID"
    }

## GET /scenarios/{scenario-id}/responsible-groups/{touchstone-id}/
Returns an enumeration (potentially empty) of modelling groups who are responsible for this 
scenario in the given touchstone.

Required permissions: `scenarios.read`, `modellinggroups.read`, `responsibilities.read`

Schema: [`ModellingGroups.schema.json`](../schemas/ModellingGroups.schema.json)

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

See `POST /modelling-groups/{modelling-group-id}/actions/associate-responsibility/` for editing 
this data.

# Touchstones
## POST /touchstones/
POST creates a new, empty touchstone in the 'in-preparation' state.

Required permissions: `touchstones.prepare`

Schema: [`CreateTouchstone.schema.json`](../schemas/CreateTouchstone.schema.json)

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

Schema: [`UpdateTouchstone.schema.json`](../schemas/UpdateTouchstone.schema.json)

### Example
    {
        "status": "finished"
    }

## GET /touchstones/{touchstone-id}/scenarios/{scenario-id}/coverage/
Returns the amalgamated coverage data of all the coverage sets associated with this scenario in this touchstone.

Required permissions: `touchstones.read`, `scenarios.read`, `coverage.read`

This data is returned in two parts: First the metadata, then the coverage in CSV format.

### Metadata
Schema: [`ScenarioAndCoverageSets.schema.json`](../schemas/ScenarioAndCoverageSets.schema.json)

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

## POST /touchstones/{touchstone-id}/actions/associate-scenario/
Associate or unassociate a scenario with a touchstone.

Required permissions: `touchstones.prepare`, `scenarios.read`

Schema: [`AssociateScenario.schema.json`](../schemas/AssociateScenario.schema.json)

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

Schema: [`CountriesWithDetails.schema.json`](../schemas/CountriesWithDetails.schema.json)

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

Schema: [`SetCountriesWithDetails.schema.json`](../schemas/SetCountriesWithDetails.schema.json)

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

Schema: [`CountriesWithDetails.schema.json`](../schemas/CountriesWithDetails.schema.json)

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

Schema: [`CountryIds.schema.json`](../schemas/CountryIds.schema.json)

### Example
    [ "AFG", "AGO" ]

The countries set here must:

* Exist overall (see `/countries`)
* Exist in this touchstone (see `/touchstones/{touchstone-id}/countries/`)

# Coverage data
## GET /touchstones/{touchstone-id}/coverage-sets/
Returns the coverage data sets associated with the touchstone

Required permissions: `coverage.read`

Schema: [`CoverageSets.schema.json`](../schemas/CoverageSets.schema.json)

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

Example: `/touchstones/2017-op-1/coverage-sets/?scenario=64`

#### activity_type
Optional. Takes either 'routine' or 'campaign'. The coverage sets are filtered to the specified coverage type.

Example: `/touchstones/2017-op-1/coverage-sets/?activity_type=campaign`

#### vaccine
Optional. Takes a valid vaccine identifier. The coverage sets are filtered to the specified vaccine.

Example: `/touchstones/2017-op-1/coverage-sets/?vaccine=MCV1`

## GET /touchstones/{touchstone-id}/coverage-sets/{coverage-set-id}/
Returns a single coverage set and its coverage data.

Required permissions: `coverage.read`

Returns HTTP multipart data with two sections. The first section has `Content-Type: application/json`
and conforms to this schema.

Schema: [`CoverageSet.schema.json`](../schemas/CoverageSet.schema.json)

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

Example: `/touchstones/2017-op-1/coverage-sets/189/?countries=AFG,ANG,CHN`

## POST /touchstones/{touchstone-id}/coverage-sets/
Adds a new coverage set to the touchstone

Required permissions: `coverage.write`

Takes HTTP multipart data with two sections. The first section must have
`Content-Type: application/json` and must conform to this schema.

Schema: [`CreateCoverageSet.schema.json`](../schemas/CreateCoverageSet.schema.json)

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

## PUT /touchstones/{touchstone-id}/coverage-sets/{coverage-set-id}/
Replaces the data in an existing coverage set.

Required permissions: `coverage.write`

Takes HTTP multipart data with two sections. The first section must have
`Content-Type: application/json` and must conform to this schema.

Schema: [`CreateCoverageSet.schema.json`](../schemas/CreateCoverageSet.schema.json)

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

## POST /touchstones/{touchstone-id}/actions/associate-coverage-set/
Associates or unassociates a given scenario and coverage set.

Required permissions: `touchstones.prepare`

Schema: [`AssociateCoverageSet.schema.json`](../schemas/AssociateCoverageSet.schema.json)

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

# Modelling groups
## POST /modelling-groups/
Creates a new modelling group.

Required permissions: `modelling-groups.write`

Schema: [`ModellingGroup.schema.json`](../schemas/ModellingGroup.schema.json)

### Example
    {
        "id": "NEW-UNIQUE-ID",
        "description": "DESCRIPTION"
    }

## GET /modelling-groups/{modelling-group-id}/members/
Returns all users in the modelling group.

Required permissions: `users.read`, `modelling-groups.read`. Additionally, roles are only included if the user has `roles.read`, scoped to this group (or to *)

Schma: [`Users.schema.json`](../schemas/Users.schema.json)

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

## POST /modelling-groups/{modelling-group-id}/actions/associate-responsibility/
Adds or removes a responsibility for a given modelling group, scenario, and touchstone.

Required permissions: `responsibilities.write`

Schema: [`AssociateResponsibility.schema.json`](../schemas/AssociateResponsibility.schema.json)

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
Schema: [`TouchstoneOverview.schema.json`](../schemas/TouchstoneOverview.schema.json)

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
Schema: [`TouchstoneOverview.schema.json`](../schemas/TouchstoneOverview.schema.json)

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
