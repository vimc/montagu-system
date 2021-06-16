# Touchstones
## GET /touchstones/
Returns an enumeration of all touchstones and their versions.

Required permissions: `touchstones.read`. To see touchstone versions that are `in-preparation` the user further requires `touchstones.prepare`.

If the user does not have permission to see in-preparation touchstone versions,
these will not be returned. If all versions of a touchstone are in preparation
the whole touchstone will be omitted.

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
                    "status": "finished"
                },
                {
                    "id": "201710gavi-2",
                    "name": "201710gavi",
                    "version": 2,            
                    "description": "October 2017 touchstone v2",
                    "status": "open"
                }
            ]
        },
        {
            "id": "201804rfp",
            "description": "2018 April Request for Proposal",
            "comment": "2018 April Open Call touchstone for PCV Rota Hib HPV HepB",
            "versions": [
                {
                    "id": "201804rfp-1",
                    "name": "201804rfp",
                    "version": 1,
                    "description": "2018 April Request for Proposal v1",
                    "status": "open"
                }
            ]            
        }
    ]
    

## GET /touchstones/{touchstone-id}/responsibilities/
Returns all responsibility sets associated with the touchstone.

Required permissions: `touchstones.read`, `responsibilities.read`, `scenarios.read`.

Additionally, to view responsibilities for an in-preparation touchstone, `touchstones.prepare` is required.

Schema: [`ResponsibilitySets.schema.json`](../schemas/ResponsibilitySets.schema.json)

### Example
    [{
        "touchstone_version": "2017-op-1",
        "status": "incomplete",
        "modelling_group_id": "IC-Garske",
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
                     "outcomes": [ 
                        { "code": "cohort_size", "name": "cohort size" },
                        { "code": "cases", "name": "cases" },
                        { "code": "deaths", "name": "deaths" },
                        { "code": "dalys", "name": "DALYs" } 
                    ]
                },
                "applicable_scenarios": [
                    "menA-novacc", 
                    "menA-gavi"
                ],
                "disease": "menA"             
            }
        ]
    }]

## GET /touchstones/{touchstone-id}/responsibilities/comments/
Returns the latest annotations for responsibility sets associated with the touchstone.

Required permissions: `touchstones.read`, `responsibilities.review`.

Schema: [`ResponsibilitySetsWithComments.schema.json`](../schemas/ResponsibilitySetsWithComments.schema.json)

### Example
    [{
        "touchstone_version": "2017-op-1",
        "modelling_group_id": "IC-Garske",
        "responsibilities": [
            {
                "scenario_id": "menA-novacc",
                "comment": {
                    "comment": "An annotation for novacc",
                    "added_by": "test.user",
                    "added_on": "2017-10-06T11:18:06Z"
                }
            },
            {
                "scenario_id": "menA-gavi",
                "comment": {
                    "comment": "An annotation for gavi",
                    "added_by": "test.user",
                    "added_on": "2017-10-06T11:19:10Z"
                }
            }
        ]
    }]

## POST /touchstones/{touchstone-id}/responsibilities/{group-id}/{scenario-id}/comments/
Adds an annotation to the responsibility associated with the touchstone, modelling group and scenario.

Required permissions: `touchstones.read`, `responsibilities.review`.

Schema: [`ResponsibilityComment.schema.json`](../schemas/ResponsibilityComment.schema.json)

### Example
    {
        "comment": "An annotation for novacc"
    }

## GET /touchstones/{touchstone-id}/scenarios/
Returns all scenarios associated with the touchstone.

Required permissions: `touchstones.read`, `scenarios.read`.

Additionally, to view scenarios for an in-preparation touchstone, `touchstones.prepare` is required.

If the user has global `coverage.read` permission then coverage sets metadata will be returned. Otherwise just the
 scenario will be returned.

Schema: [`ScenariosInTouchstone.schema.json`](../schemas/ScenariosInTouchstone.schema.json)

### Example
#### with coverage.read
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
                    "touchstone_version": "2017-op-1",
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
                    "touchstone_version": "2017-op-1",
                    "name": "Yellow fever birth dose (with GAVI support)",
                    "vaccine": "YF",
                    "gavi_support": "total",
                    "activity_type": "routine"
                },
                { 
                    "id": 643,
                    "touchstone_version": "2017-op-1",
                    "name": "Yellow fever reactive campaign (with GAVI support)",
                    "vaccine": "YF",
                    "gavi_support": "total",
                    "activity_type": "campaign"
                }
            ]
        }
    ]
    
### without coverage.read
    [
        {
            "scenario": {
                "id": "menA-novacc",
                "touchstones": [ "2016-op-1", "2017-wuenic-1", "2017-op-1" ],
                "description": "Menigitis A, No vaccination",
                "disease": "MenA"
            }
        },
        {
            "scenario": {
                "id": "yf-campaign-reactive-nogavi",
                "touchstones": [ "2017-wuenic-1", "2017-op-1" ],
                "description": "Yellow Fever, Reactive campaign, SDF coverage without GAVI support",
                "disease": "YF"
            }
        }
    ]

Note that the coverage sets returned are just those that belong to the touchstone in the URL.
In other words, if the same scenario is associated with other coverage
sets in a different touchstone, those are not returned here.

Coverage sets are returned in the order they are to be applied.

The returned scenarios can be filtered using the same query parameters as `GET /scenarios`, with the exception that the touchstone parameter is ignored.

## GET /touchstones/{touchstone-id}/scenarios/{scenario-id}/
Returns a single scenario associated with a touchstone.

Required permissions: `touchstones.read`, `scenarios.read`,

Additionally, to view scenarios for an in-preparation touchstone, `touchstones.prepare` is required.

If the user has `coverage.read` permission, either globally scoped or for a modelling-group that is responsible
for the given scenario in the given touchstone, then coverage sets metadata will be returned. Otherwise just touchstone
and scenario will be returned.

Schema: [`ScenarioAndCoverageSets.schema.json`](../schemas/ScenarioAndCoverageSets.schema.json)

### Example 
### with coverage.read
    {
        "touchstone_version": { 
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
                "touchstone_version": "2017-op-1",
                "name": "Menigitis no vaccination",
                "vaccine": "MenA",
                "gavi_support": "no vaccine",
                "activity_type": "none"
            }
        ]
    }

### without coverage.read
    {
        "touchstone_version": { 
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
        }
    }
