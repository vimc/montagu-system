# VIMC draft API
# General points
* All data returned is in JSON format. POST and PUT data is expected as a string containing JSON-formatted data.
* Dates and times are returned as strings according to the ISO 8601 standard.
* Unless otherwise noted, URLs and IDs embedded in URLs are case-sensitive.
* The canonical form for all URLs (not including query string) ends in a slash: `/`.
* The API will be versioned via URL. So for version 1, all URLs will begin `/v1/`. e.g. `http://vimc.dide.ic.ac.uk/api/v1/diseases/`

# Issues to be resolved:
* CSV options for some endpoints

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
        "id": "NEW-DISEASE-ID",
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

# Countries
## GET /countries/
Returns all countries.

Note that countries only gain names and other data when associated
with a particular point in time, via a touchstone. This part of the API
just tracks countries in their abstract sense, using ISO codes.

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

Schema: [`Country.schema.json`](Country.schema.json)

### Example
    {
        "id": "MDG",
        "name": "Madagascar"
    }

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

## GET /scenarios/{scenario-id}/responsible_groups/{touchstone-id}
Returns an enumeration (potentially empty) of modelling groups who are responsible for this 
scenario in the given touchstone.

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

Schema: [`UpdateTouchstone.schema.json`](UpdateTouchstone.schema.json)

### Example
    {
        "status": "finished"
    }

## GET /touchstones/{touchstone-id}/scenarios/
Returns all scenarios associated with the touchstone.

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
                    "coverage_type": "routine",
                    "vaccine": "MenA"
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
                    "vaccine": "YF"
                },
                { 
                    "id": 643,
                    "touchstone": "2017-op",
                    "name": "Yellow fever reactive campaign (with GAVI support)",
                    "coverage_type": "campaign",
                    "vaccine": "YF"
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

Schema: [`CoverageSets.schema.json`](CoverageSets.schema.json)

### Example
    [
        {
            "id": 189,
            "touchstone": "2017-op",
            "name": "Measles 1st Dose",
            "coverage_type": "routine",
            "vaccine": "MCV1"
        },
        {
            "id": 278,
            "touchstone": "2017-op",
            "name": "Measles 2nd Dose",
            "coverage_type": "routine",
            "vaccine": "MCV2"
        },
        {
            "id": 290,
            "touchstone": "2017-op",
            "name": "Yellow Fever reactive campaign (with GAVI support)",
            "coverage_type": "campaign",
            "vaccine": "YF"
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

Schema: [`CoverageSet.schema.json`](CoverageSet.schema.json)

### Example
    {
        "id": 189,
        "touchstone": "2017-op",        
        "name": "Measles 1st Dose",
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

### Query parameters
#### countries
Optional. Takes a list of country codes. The coverage data is filtered to just the specified countries.

Example: `/touchstones/2017-op/coverage_sets/189/?countries=AFG,ANG,CHN`

## POST /touchstones/{touchstone-id}/coverage_sets/
Adds a new coverage set to the touchstone

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

If the touchstone is `open` then users without appropriate admin permissions can only 
see estimates that their modelling group has uploaded. If the touchstone is `finished` 
then all users can see all estimates. There should not be any estimates if
the touchstone is `in-preparation`.

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

Schema: [`ModellingGroup.schema.json`](ModellingGroup.schema.json)

### Example
    {
        "code": "NEW-UNIQUE-CODE",
        "description": "DESCRIPTION"
    }

# Models
## GET /models/
Returns an enumeration of all models

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

Only the owning modelling group can move the responsibility set to `submitted`. They can only do so if:

* The status is `incomplete`
* All responsibilities have the status `valid`

Schema: [`EditResponsibilitySet.schema.json`](EditResponsibilitySet.schema.json)

### Example
    {
        "status": "submitted"
    }

Users in the reviewer role can change the status of the responsibility set when it is in `submitted`. 
They can change it to either `incomplete` or `approved`. If they change it to incomplete, they must include
at least one problem.

Schema: [`EditResponsibilitySet.schema.json`](EditResponsibilitySet.schema.json)

### Example
    {
        "status": "incomplete",
        "problems": "Please review the numbers for Afghanistan - they look much too high"
    }

## POST /modelling-groups/{modelling-group-code}/actions/associate_responsibility
Adds or removes a responsibility for a given modelling group, scenario, and touchstone.

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