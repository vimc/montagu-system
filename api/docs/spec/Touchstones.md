# Touchstones
## GET /touchstones/
Returns an enumeration of all touchstones.

Required permissions: `touchstones.read`. To see touchstones that are `in-preparation` the user further requires `touchstones.prepare`.

Schema: [`Touchstones.schema.json`](../schemas/Touchstones.schema.json)

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

## GET /touchstones/{touchstone-id}/scenarios/
Returns all scenarios associated with the touchstone.

Required permissions: `touchstones.read`, `scenarios.read`, `coverage.read`

Additionally, to view scenarios for an in-preparation touchstone, `touchstones.prepare` is required.

Schema: [`ScenariosInTouchstone.schema.json`](../schemas/ScenariosInTouchstone.schema.json)

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

Schema: [`ScenarioAndCoverageSets.schema.json`](../schemas/ScenarioAndCoverageSets.schema.json)

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