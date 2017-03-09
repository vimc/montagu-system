# VIMC draft API
# General points
* All data returned is in JSON format. POST and PUT data is expected as a string containing JSON-formatted data.
* Dates and times are returned as strings according to the ISO 8601 standard.
* Unless otherwise noted, URLs and IDs embedded in URLs are case-sensitive.
* The canonical form for all URLs (not including query string) ends in a slash: `/`.
* The API will be versioned via URL. So for version 1, all URLs will begin `/v1/`. e.g. `http://vimc.dide.ic.ac.uk/api/v1/diseases/`

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

# Diseases
## GET /diseases/
Returns an enumeration of all diseases.

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

Schema: [`Disease.schema.json`](Disease.schema.json)

### Example
    {
        "id": "NEW DISEASE ID",
        "name": "NEW DISEASE NAME"
    }

Diseases cannot be deleted via the API.

## GET /diseases/{disease-id}/
Example URL: `/diseases/YF/`

Returns one disease.

Schema: [`Disease.schema.json`](Disease.schema.json)

### Example
    {
        "id": "YF",
        "name": "Yellow Fever"
    }

## PUT /diseases/{disease-id}/
Update the disease's human-readable name. Request data:

Schema: [`UpdateDisease.schema.json`](UpdateDisease.schema.json)

### Example
    {
        "name": "NEW DISEASE NAME"
    }

You cannot update a disease's ID via the API.

# Vaccines
The vaccine API is identical to the disease API, but uses `/vaccines` as its base URI.

# Scenarios
## GET /scenarios/
Returns all scenarios.

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
            "scenario_type": "none",
            "published": true
        },
        {
            "id": "yf-campaign-reactive-nogavi",
            "touchstones": [ "2017-wuenic", "2017-op" ],
            "description": "Yellow Fever, Reactive campaign, SDF coverage without GAVI support",
            "vaccination_level": "without",
            "disease": "YF",
            "vaccine": "YF",
            "scenario_type": "campaign",
            "published": false
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

### Example
    {
        "id": "ID",
        "description": "DESCRIPTION",
        "vaccination_level": "none",
        "disease": "VALID DISEASE ID",
        "vaccine": "VALID VACCINE ID",
        "scenario_type": "none"
    }
    
## PATCH /scenarios/{scenario-id}/
Updates a scenario's properties. This is only allowed until a scenario is associated with a touchstone. All fields are optional.

Schema: [`UpdateScenario.schema.json`](UpdateScenario.schema.json)

### Example

    {
        "description": "DESCRIPTION",
        "vaccination_level": "none",
        "disease": "VALID DISEASE ID",
        "vaccine": "VALID VACCINE ID",
        "scenario_type": "none"
    }

## DELETE /scenarios/{scenario-id}/
Deletes a scenario. This is only allowed until a scenario is associated with a touchstone.

# Touchstones
## GET /touchstones/
Returns an enumeration of all touchstones.

Schema: [`Touchstones.schema.json`](Touchstones.schema.json)

### Example
    [
        { 
            "id": "2017-wuenic",
            "description": "2017 WUENIC Update",
            "date": "2017-07-15",
            "years": { "start": 1996, "end": 2017 },
            "status": "public"
        },
        { 
            "id": "2017-op",
            "description": "2017 Operational Forecast",
            "date": "2017-07-15",
            "years": { "start": 1996, "end": 2081 },
            "status": "open"
        }
    ]

## POST /touchstones/
POST creates a new, empty touchstone in the 'in-preparation' state.

Schema: [`CreateTouchstone.schema.json`](CreateTouchstone.schema.json)

### Example
    {
         "id": "an-id",
         "description": "A description",
         "date": "2017-06-01",
         "years": {
             "start": 2000,
             "end": 2100
         }
    }

Fails if there is an existing touchstone with that ID.

## PATCH /touchstones/{touchstone-id}/
Updates editable fields on a touchstone (currently just status). 
Changing the status is only allowed if requirements have been met (i.e. cannot move from "open" to "finished" if some responsibilities are unfulfilled).

Schema: [`UpdateTouchstone.schema.json`](UpdateTouchstone.schema.json)

### Example
    {
        "status": "finished"
    }

## GET /touchstones/{touchstone-id}/scenarios/
Returns all scenarios associated with the touchstone.

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
            "scenario_type": "none",
            "published": true
        },
        {
            "id": "yf-campaign-reactive-nogavi",
            "touchstones": [ "2017-wuenic", "2017-op" ],
            "description": "Yellow Fever, Reactive campaign, SDF coverage without GAVI support",
            "vaccination_level": "without",
            "disease": "YF",
            "vaccine": "YF",
            "scenario_type": "campaign",
            "published": false
        }
    ]

The returned scenarios can be filtered using the same query parameters as `GET /scenarios`, with the exception that the touchstone parameter is ignored.

## POST /touchstones/{touchstone-id}/actions/associate_scenario/
Associate or unassociate a scenario with a touchstone.

Schema: [`AssociateScenario.schema.json`](AssociateScenario.schema.json)

### Example
    {
        "action": "add",
        "scenario_id": "menA-novacc"
    }
    
If the action is "add" then the two are associated. If the action is "remove", then they become unassociated.

A scenario can only be associated with a touchstone if the touchstone is in the status 'in-preparation'.
    
## GET /touchstones/{touchstone-id}/scenarios/{scenario-id}/
Returns the coverage data for a scenario that is assciated with the touchstone.

Example URL: `/touchstones/2017-op/scenarios/menA-novacc/`

Schema: [`ScenarioWithCoverageData.schema.json`](ScenarioWithCoverageData.schema.json)

### Example
    {
        "touchstone": {
            "id": "2017-op",
            "description": "2017 Operational Forecast",
            "date": "2017-07-15",
            "years": { "start": 1996, "end": 2017 },
            "status": "public"
    	},
        "scenario": {
            "id": "menA-novacc",
            "touchstones": [ "2016-op", "2017-wuenic", "2017-op" ],
            "description": "Menigitis A, No vaccination",
            "vaccination_level": "none",
            "disease": "MenA",
            "vaccine": "MenA",
            "scenario_type": "none",
            "published": true
        },
        "countries": [ "AFG", "AGO" ],
        "coverage": [
            { 
                "country": "AFG", 
                "data": [
                    { "year": 2006, "coverage": 0.0 },
                    { "year": 2007, "coverage": 64.0 },
                    { "year": 2008, "coverage": 63.0 }
                ]
            },
            { 
                "country": "AGO", 
                "data": [
                    { "year": 2006, "coverage": 0.0 },
                    { "year": 2007, "coverage": 83.0 },
                    { "year": 2008, "coverage": 81.0 }
                ]
            }
        ]
    }
    
### Query parameters:

#### countries
Optional. Takes a list of country codes. The countries field and coverage data are filtered to just the specified countries.

Example: `/touchstones/2017-op/scenarios/menA-novacc/?countries=AFG,ANG,CHN`

If no data has been uploaded for the given country code (and it is a valid country code) the `data` element will be an empty array. 

# Modelling groups
## GET /modelling-groups/
Returns an enumeration of all modelling groups.

Schema: [`ModellingGroups.schema.json`](ModellingGroups.schema.json)

### Example
    [
        {
            "code": "IC-Garske",
            "description": "Imperial College, Yellow Fever, PI: Tini Garske"
        },
        {
            "code": "LSHTM-Jit",
            "description": "London School of Hygiene and Tropical Medicine, PI: Mark Jit"
        }
    ]

## GET /modelling-groups/{modelling-group-code}/
Returns the identified modelling group, their model(s), and any touchstones they have responsibilities for.

Schema: [`ModellingGroupDetails.schema.json`](ModellingGroupDetails.schema.json)

### Example
    {
        "code": "IC-Garske",
        "description": "Imperial College, Yellow Fever, PI: Tini Garske",
        "models": [
            {
                "id": "IC-YellowFever",
                "name": "YF burden estimate - without herd effect",
                "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
                "description": "Yellow Fever model",
                "modelling_group": "IC-Garske"
            }
        ],
        "responsibilities": [ "wuenic-2017", "op-2017" ]
    }

## POST /modelling-groups/
Creates a new modelling group.

Schema: [`ModellingGroup.schema.json`](ModellingGroup.schema.json)

### Example
    {
        "code": "NEW UNIQUE CODE",
        "description": "DESCRIPTION"
    }

# Models
## GET /models/
Returns an enumeration of all models

Schema: [`Models.schema.json`](Models.schema.json)

### Example
    [
        { 
            "code": "IC-YellowFever",
            "name": "YF burden estimate - without herd effect",
            "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
            "description": "Yellow Fever model",
            "modelling_group": "IC-Garske"
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

Schema: [`ModelDetails.schema.json`](ModelDetails.schema.json)

### Example
    {
        "code": "IC-YellowFever",
        "name": "YF burden estimate - without herd effect",
        "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
        "description": "Yellow Fever model",
        "modelling_group": "IC-Garske",
        "versions": [
            { 
                "model": "IC-YellowFever",
                "version": "1.0.0",
                "note": "Some notes",
                "fingerprint": null
            },
            { 
                "model": "IC-YellowFever",
                "version": "1.1.0",
                "note": "Some notes about 1.1 release",
                "fingerprint": "4b0bef9edfb15ac02e7410b21d8ed3398fa52982"
            }
        ]
    }

## POST /models/
Creates a new model.

Schema: [`Model.schema.json`](Model.schema.json)

### Example
    { 
        "code": "NEW UNIQUE CODE",
        "name": "MODEL NAME",
        "citation": null,
        "description": "DESCRIPTION",
        "modelling_group": "CODE OF EXISTING MODELLING GROUP"
    }

# Status
## GET /touchstones/{touchstone-id}/status/
Returns a summary of the completeness and correctness of the touchstone, so that the VIMC administrator can track progress through uploading a new touchstone.

Example URL: `/touchstones/2017-op/status/`

Note the lack of spec. I expect this to change.

Returns data in this format:

    {
        id: "2017-op",
        description: "2017 Operational Forecast",
        date: "2017-07-15",
        status: {
            is_complete: false,
            years: { start: 1996, end: 2081 },
            countries: {
                count: 97,
                all: [ "AFG", "ALB", "AGO" ... ],
                problems: {
                    by_country: [ 
                        { 
                            id: "AFG",
                            problems: [ 
                                "Missing demographic data for the following years: 2077, 2078, 2079, 2080, 2081",
                                "Surviving births is greater than live births for the following years: 2001, 2009",
                            ]
                        },
                        ...
                    ]
                },
            scenarios: {
                count: 22,
                all: [ "menA-novacc", "menA-routine-nogavi", "menA-routine-gavi", ... ],
                problems: {
                    general: [ 
                        "There are no scenarios associated for these vaccines: Hib3, HPV"
                    ],
                    by_vaccine: [
                        {
                            id: "YF",
                            problems: [
                                "Expected a Yellow Fever 'No vaccination' scenario",
                                "Expected at least one Yellow Fever 'Routine' scenario",
                            ]
                        },
                        ...
                    ],
                    by_scenario: [
                        {
                            id: "menA-routine-gavi",
                            problems: [
                                "Missing coverage data for the following countries: AFG, AGO",
                                "Only patial coverage data (missing some years) for the following countries: KGZ, SEN"
                            ]
                        },
                        ...
                    ]
                }
            }
        }
    }
