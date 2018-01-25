# Responsibilities
## GET /modelling-groups/{modelling-group-id}/responsibilities/
Will return list of touchstones that this modelling group is responsible for.

Touchstones that are `in-preparation` should not be returned unless the user has
permission to see touchstones before they are made `open`.

Required permissions: Global scope: `touchstones.read`. Scoped to modelling group: `responsibilities.read`. Also see note above about `in-preparation` touchstones - need `touchstones.prepare`.

Schema: [`Touchstones.schema.json`](Touchstones.schema.json)

### Example
    [
        {
            "id": "op-2017-1",
            "name": "op-2017",
            "version": 1,
            "description": "2017 Operational Forecast",
            "status": "finished"
        }
    ]
    
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

If they have no responsibilities, `status` is "not-applicable".

Schema: [`ResponsibilitySet.schema.json`](ResponsibilitySet.schema.json)

### Example
    {
        "touchstone": "2017-op-1",
        "status": "not-applicable",
        "problems": "",
        "responsibilities": []
    }

Note that even if a modelling group has no responsibilities in a given touchstone,
using this endpoint is not an error: an empty array will just be returned.

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


## PATCH /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/
**NOT IMPLEMENTED**

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
