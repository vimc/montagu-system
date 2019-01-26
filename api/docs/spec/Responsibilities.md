# Responsibilities
## GET /modelling-groups/{modelling-group-id}/responsibilities/
Will return list of touchstones that this modelling group is responsible for.

Touchstones that are `in-preparation` should not be returned unless the user has
permission to see touchstones before they are made `open`.

Required permissions: Global scope: `touchstones.read`. Scoped to modelling group: `responsibilities.read`. Also see note above about `in-preparation` touchstones - need `touchstones.prepare`.

Schema: [`Touchstones.schema.json`](../schemas/Touchstones.schema.json)

### Example
    [
        { 
            "id": "201710gavi",
            "description": "October 2017 touchstone",
            "comment": "Touchstone for 201710gavi",
            "versions": [
                {
                    "id": "201710gavi-1",
                    "name": "201710gavi",
                    "version": 1,            
                    "description": "October 2017 touchstone v1",
                    "status": "open"
                }
            ]
        }
    ]
    
## GET /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/
Returns an enumerations of the responsibilities of this modelling group in the given touchstone,
and the overall status of this modelling groups work in this touchstone.

If the touchstone is `in-preparation`, and the user does not have permission to see touchstones 
before they are made `open`, then this returns an error 404.

Required permissions: Global scope: `scenarios.read`. Scoped to modelling group: `responsibilities.read`. Additionally, to view responsibilities for an `in-preparation` touchstone, the user needs the `touchstones.prepare` permission.

Schema: [`ResponsibilitySet.schema.json`](../schemas/ResponsibilitySet.schema.json)

### Example
    {
        "touchstone_version": "2017-op-1",
        "modelling_group_id": "some-group",
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
                "status": "empty",
                "problems": [ "No burden estimates have been uploaded" ],
                "current_estimate_set": null
            },        
            {
                "scenario": {
                    "id": "menA-gavi",
                    "touchstones": [ "2017-wuenic-1", "2017-op-1" ],
                    "description": "Menigistis A, full GAVI support",
                    "disease": "MenA"
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
        ],
        "expectations": [
            {
                "expectation": {
                    "id": 123,
                    "description": "some-group:menA:standard",
                    "years": { 
                        "minimum_inclusive": 1950,
                        "maximum_inclusive": 2100
                    },
                    "ages": { 
                        "minimum_inclusive": 0,
                        "maximum_inclusive": 99
                    },
                    "cohorts": {
                        "minimum_birth_year": 1950,
                        "maximum_birth_year": null
                    },
                    "countries": [
                        { "id": "AFG", "name": "Afghanistan" },
                        { "id": "AGO", "name": "Angola" }
                    ],
                    "outcomes": [ "cohort_size", "cases", "deaths", "dalys" ]
                },
                "applicable_scenarios": [
                    "menA-novacc", 
                    "menA-gavi"
                ],
                "disease": "menA"
            }
        ]
    }

If they have no responsibilities, `status` is "not-applicable".

Schema: [`ResponsibilitySet.schema.json`](../schemas/ResponsibilitySet.schema.json)

### Example
    {
        "touchstone_version": "2017-op-1",
        "modelling_group_id": "some-group",
        "status": "not-applicable",
        "problems": "",
        "responsibilities": [],
        "expectations": []
    }

Note that even if a modelling group has no responsibilities in a given touchstone,
using this endpoint is not an error: an empty array will just be returned.

## GET /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/
Returns the specified responsibility of this modelling group in the given touchstone.

If the touchstone is `in-preparation`, and the user does not have permission to see touchstones 
before they are made `open`, then this returns an error 404.

Required permissions: Global scope: `scenarios.read`. Scoped to modelling group: `responsibilities.read`. Additionally, to view responsibilities for an `in-preparation` touchstone, the user needs the `touchstones.prepare` permission.

Schema: [`ResponsibilityDetails.schema.json`](../schemas/ResponsibilityDetails.schema.json)

### Example
    {
        "touchstone_version": { 
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
            "status": "empty",
            "problems": [ "No burden estimates have been uploaded" ],
            "current_estimate_set": null
        },
        "expectations": {
            "id": 123,
            "description": "some-group:menA:standard",
            "years": { 
                "minimum_inclusive": 1950,
                "maximum_inclusive": 2100
            },
            "ages": { 
                "minimum_inclusive": 0,
                "maximum_inclusive": 99
            },
            "cohorts": {
                "minimum_birth_year": 1950,
                "maximum_birth_year": null
            },
            "countries": [
                { "id": "AFG", "name": "Afghanistan" },
                { "id": "AGO", "name": "Angola" }
            ],
            "outcomes": [ "cohort_size", "cases", "deaths", "dalys" ]
        }
    }

## GET /modelling-groups/{modelling-group-id}/expectations/{touchstone-id}/{expectation-id}/
Returns the burden estimate template for the requested expectations of this modelling group in the given touchstone. Note that
this call returns *text/csv*, so you must indicate that in the accept-header when making the request, otherwise you will get a
`Error: Unknown resource. Please check the URL` even though your URL may be correct.

Required permissions: Global scope: `scenarios.read`. Scoped to modelling group: `responsibilities.read`. 

### Example CSV
 
CSV data in this format, comma-separated, 

      disease, year, age, country, country_name, cohort_size, deaths, cases, dalys
           YF, 2000,   0,     AGO,       Angola,          NA,     NA,    NA,    NA
           YF, 2001,   0,     AGO,       Angola,          NA,     NA,    NA,    NA
           YF, 2002,   0,     AGO,       Angola,          NA,     NA,    NA,    NA
           YF, 2003,   0,     AGO,       Angola,          NA,     NA,    NA,    NA
           YF, 2004,   0,     AGO,       Angola,          NA,     NA,    NA,    NA
           YF, 2005,   0,     AGO,       Angola,          NA,     NA,    NA,    NA
           YF, 2006,   0,     AGO,       Angola,          NA,     NA,    NA,    NA
           YF, 2007,   0,     AGO,       Angola,          NA,     NA,    NA,    NA
           YF, 2008,   0,     AGO,       Angola,          NA,     NA,    NA,    NA

Country names are quoted where necessary, for example `"Congo, the Democratic Republic of the"` is quoted, since it contains a comma.

### Query parameters:

#### type
Optional. The type of template to return, either `central` or `stochastic`. Defaults to `central`.
Schema: [`BurdenEstimate.csvschema.json`](../schemas/BurdenEstimate.csvschema.json)


## PATCH /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/
**NOT IMPLEMENTED**

Allows you to change the status of the responsibility set.

Can only move the responsibility set to `submitted` if:

* The status is `incomplete`
* All responsibilities have the status `valid`

Required permissions: `estimates.submit`, scoped to the modelling group (or *)

Schema: [`EditResponsibilitySet.schema.json`](../schemas/EditResponsibilitySet.schema.json)

### Example
    {
        "status": "submitted"
    }

Users in the reviewer role can change the status of the responsibility set when it is in `submitted`. 
They can change it to either `incomplete` or `approved`. If they change it to incomplete, they must include
at least one problem.

Required permissions: `estimates.review`, scoped to the modelling group (or *)

Schema: [`EditResponsibilitySet.schema.json`](../schemas/EditResponsibilitySet.schema.json)

### Example
    {
        "status": "incomplete",
        "problems": "Please review the numbers for Afghanistan - they look much too high"
    }
