# VIMC draft API
## General points
* All data returned is in JSON format. POST and PUT data is expected as a string containing JSON-formatted data.
* Dates and times are returned as strings according to the ISO 8601 standard.
* Unless otherwise noted, URLs and IDs embedded in URLs are case-sensitive.
* The canonical form for all URLs (not including query string) ends in a slash: `/`.
* The API will be versioned via URL. So for version 1, all URLs will begin `/v1/`. e.g. `http://vimc.dide.ic.ac.uk/api/v1/diseases/`

## Reference data
Here, all `GET` methods are available to modelling groups, but `POST` methods are only available to authorised VIMC central users.

### Diseases
#### `GET /diseases/`
Returns an enumeration of all diseases in this format:

    [
        {
            id: "HepB",
            name: "Hepatitis B"
        },
        {
            id: "YF",
            name: "Yellow Fever"
        }
    ]
    
#### `POST /diseases/`
Adds a new disease. Expects data in this format:

    {
    	id: "NEW DISEASE ID",
    	name: "NEW DISEASE NAME"
    }

Diseases cannot be deleted via the API.

#### `GET /diseases/{disease-id}/`
Example URL: `/diseases/YF/`

Returns one disease. e.g.

    {
        id: "YF",
        name: "Yellow Fever"
    }

#### `PUT /diseases/{disease-id}/`
Update the disease's human-readable id. Expects data in this format:

    {
        name: "NEW DISEASE NAME"
    }

You cannot update a disease's ID via the API.

### Vaccines
The vaccine API is identical to the disease API, but uses `/vaccines` as its base URI.

### Scenarios
#### `GET /scenarios/`
Returns all scenarios.

Example response:

    [
        {
            id: "menA-novacc",
            touchstones: [ "2016-op", "2017-wuenic", "2017-op" ],
            description: "Menigitis A, No vaccination",
            vaccination_level: "none",
            disease: "MenA",
            vaccine: "MenA",
            scenario_type: "n/a",
            published: true,
        },
        {
            id: "yf-campaign-reactive-nogavi",
            touchstone: [ "2017-wuenic", "2017-op" ],
            description: "Yellow Fever, Reactive campaign, SDF coverage without GAVI support",
            vaccination_level: "no-gavi",
            disease: "YF",
            vaccine: "YF",
            scenario_type: "campaign",
            published: false,
        }
    ]
    
Notes:

* `vaccinationLevel` must be one of `[none, no-gavi, gavi]`.
* `scenario_type` must be one of `[n/a, routine, campaign]`.
    
##### Query parameters:

###### vaccine
Optional. A vaccine id. Only returns scenarios that match that vaccine.

Example: `/touchstones/2017-op/scenarios/?vaccine=MenA`

###### disease
Optional. A disease id. Only returns scenarios that match that disease.

Example: `/touchstones/2017-op/scenarios/?disease=YF`

###### vaccination_level
Optional. A vaccination level (none, no-gavi, gavi). Only returns scenarios that match that vaccination level.

Example: `/touchstones/2017-op/scenarios/?vaccination_level=gavi`

###### scenario_type
Optional. A scenario type (n/a, routine, campaign). Only returns scenarios that match that scenario type.

Example: `/touchstones/2017-op/scenarios/?scenario_type=gavi`

#### `POST /scenarios/`
Creates a new scenario. It expects data in the following format. All fields are required.

    {
        id: "ID",
        description: "DESCRIPTION",
        vaccination_level: "VACCINATION LEVEL (See above for options)",
        disease: "VALID DISEASE ID",
        vaccine: "VALID VACCINE ID",
        type: "SCENARIO TYPE (See above for options)"
    }
    
#### `PATCH /scenarios/{scenario-id}/`
Updates a scenario's properties. This is only allowed until a scenario is published. All fields are optional.

Any of these fields can be modified:

    {
        description: "DESCRIPTION",
        vaccination_level: "VACCINATION LEVEL (See above for options)",
        disease: "VALID DISEASE ID",
        vaccine: "VALID VACCINE ID",
        type: "SCENARIO TYPE (See above for options)"
    }

#### `DELETE /scenarios/{scenario-id}/`
Deletes a scenario. This is only allowed until a scenario is published.

#### `POST /scenarios/{scenario-id}/publish/`
Publishes an unpublished scenario.

### Touchstones
#### `GET /touchstones/`
Returns an enumeration of all touchstones in this format:

    [
        { 
            id: "2017-wuenic",
            description: "2017 WUENIC Update",
            date: "2017-07-15",
            years: { start: 1996, end: 2017 },
            published: true
        },
        { 
            id: "2017-op",
            description: "2017 Operational Forecast",
            date: "2017-07-15",
            years: { start: 1996, end: 2081 },
            published: false
        }
    ]

#### `POST /touchstones/`
POST creates a new, empty, unpublished touchstone. 
It expects this payload (all fields required):

    {
         id: "ID",
         description: "DESCRIPTION",
         date: "DATE",
         years: {
             start: NUMBER,
             end: NUMBER
         }
    }

Fails if there is an existing touchstone with that ID.

#### `POST /touchstones/{touchstone-id}/publish/`
Publishes an unpublished touchstone.

#### `GET /touchstones/{touchstone-id}/scenarios/`
Returns an enumeration of scenarios associated with this touchstone.

This expects a touchstone id in the URL. e.g. `/touchstones/2017-op/scenarios/`

Returns data in this format:

    [
        {
            id: "menA-novacc",
            touchstones: [ "2016-op", "2017-wuenic", "2017-op" ],
            description: "Menigitis A, No vaccination",
            vaccination_level: "none",
            disease: "MenA",
            vaccine: "MenA",
            scenario_type: "n/a"
        },
        {
            id: "yf-campaign-reactive-nogavi",
            touchstone: [ "2017-wuenic", "2017-op" ],
            description: "Yellow Fever, Reactive campaign, SDF coverage without GAVI support",
            vaccination_level: "no-gavi",
            disease: "YF",
            vaccine: "YF",
            scenario_type: "campaign"
        }
    ]

##### Query parameters:
The same as `GET /scenarios/`

#### `POST /touchstones/{touchstone-id}/scenarios/`
Associate or unassociate a scenario with a touchstone.

It takes data in this format:

    {
        action: "add" OR "remove",
        scenario_id: "menA-novacc"
    }
    
If the action is "add" then the two are associated. If the action is "remove", then they become unassociated.

A scenario can only be associated with a touchstone if:

1. The scenario IS published
2. The touchstone IS NOT published.
    
#### `GET /touchstones/{touchstone-id}/scenarios/{scenario-id}/`
Returns the coverage data for a scenario that is assciated with the touchstone.

Example URL: `/touchstones/2017-op/scenarios/menA-novacc/`

Example response:

    {
        touchstone: {
            id: "2017-op",
            description: "2017 Operational Forecast",
            years: { start: 1996, end: 2081 },
    	}
        scenario: {
            id: "menA-novacc",
            description: "Menigitis A, No vaccination",
            vaccination_level: "none",
            disease: "MenA",
            vaccine: "MenA",
            scenario_type: "n/a",
        },
        countries: [ "AFG", "AGO", "ALB", "ARM", ... ],
        coverage: [
            { 
                country: "AFG", 
                data: [
                    ...
                    { year: 2006, coverage: 0.0 },
                    { year: 2007, coverage: 64.0 },
                    { year: 2008, coverage: 63.0 },
                    ...
                ]
            },
            { 
                country: "AGO", 
                data: [
                    ...
                    { year: 2006, coverage: 0.0 },
                    { year: 2007, coverage: 83.0 },
                    { year: 2008, coverage: 81.0 },
                    ...
                ]
            },
            ...
        ]
    }
    
##### Query parameters:

###### countries
Optional. Takes a list of country codes. The countries field and coverage data are filtered to just the specified countries.

Example: `/touchstones/2017-op/scenarios/menA-novacc/?countries=AFG,ANG,CHN`

If no data has been uploaded for the given country code (and it is a valid country code) the `data` element will be an empty array. 

### Countries
#### `GET /touchstones/{touchstone-id}/countries/`
Returns all the countries associated with this touchstone. Note that this assumes that countries may change from touchstone to touchstone - e.g. South Sudan did not exist as a UN country before 2011. Change becomes more likely once we add regions within countries.

Example URL: `/touchstones/2017-op/countries/`

It returns data in this format:

    [
        {
            id: "AFG",
            name: "Afghanistan",
            touchstone: "2017-op"
        },
        {
            id: "AGO",
            name: "Angola",
            touchstone: "2017-op"
        }
        ...
    ]

#### `PATCH /touchstones/{touchstone-id}/countries/`
Adds a list of countries to a given touchstone. This can be an incomplete list, including just adding one country. (For example, because it was missed out earlier).

Example URL: `/touchstones/2017-op/countries/`

It expects a payload in the same format as the GET request. It will error if any new country has the same ID or name as an existing country.

#### `GET /touchstones/{touchstone-id}/countries/{country-id}/`
Returns demographic data for the country, as published in the relevant touchstone.

Example URL: `/touchstones/2017-op/countries/AFG/`

It returns data in this format:

    {
        id: "AFG",
        name: "Angola",
        touchstone: "2017-op",
        annual_data: [
            {
                year: 1996,
                total_population: 17481800,
                live_births: 835399,
                surviving_births: 750582,
                under5_mortality_rate: 148.6,
                infant_mortality_rate: 102.7,
                neonatal_mortality_rate: 47.5,
                life_expectancy_at_birth: 54.171
            },
            ...
        ]
    }

#### `PATCH /touchstones/{touchstone-id}/countries/{country-id}/`
Adds demographic data to a country.

Example URL: `/touchstones/2017-op/countries/AFG/`

It expects a payload in this format:

    {
        id: "AFG",
        annual_data: [
            {
                year: 1996,
                total_population: 17481800,
                live_births: 835399,
                surviving_births: 750582,
                under5_mortality_rate: 148.6,
                infant_mortality_rate: 102.7,
                neonatal_mortality_rate: 47.5,
                life_expectancy_at_birth: 54.171
            },
            ...
        ]
    }

Not all years have to be uploaded in one go.

How to handle existing data? Overwrite? Overwrite with warning? Error, and require a separate call to delete the existing data?

#### `PATCH /touchstones/{touchstone-id}/scenarios/{scenario-id}/{country-code}/`
Adds coverage data to a scenario/touchstone combination for a given country. 

Example URL: `/touchstones/2017-op/scenarios/menA-novacc/AFG/`

It expects data in the following format. All fields are required.

    [
        ...
        { year: 2006, coverage: 0 },
        { year: 2007, coverage: 64 },
        { year: 2008, coverage: 63 },
        ...
    ]

### Status
#### `GET /touchstones/{touchstone-id}/status/`
Returns a summary of the completeness and correctness of the touchstone, so that the VIMC administrator can track progress through uploading a new touchstone.

Example URL: `/touchstones/2017-op/status/`

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
