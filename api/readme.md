# VIMC draft API
## General points
* All data returned is in JSON format. POST and PUT data is expected as a string containing JSON-formatted data.
* Dates and times are returned as strings according to the ISO 8601 standard.
* Unless otherwise noted, URLs and IDs embedded in URLs are case-sensitive.
* The canonical form for all URLs (not including query string) ends in a slash: `/`.

## Touchstones
Here, all `GET` methods are available to modelling groups, but `POST` methods are only available to authorised VIMC central users.

### Touchstones
#### `GET /touchstones/`
Returns an enumeration of all touchstones in this format:

    [
        { 
            id: "2017-wuenic",
            description: "2017 WUENIC Update",
            date: "2017-07-15",
            years: { start: 1996, end: 2017 },
        },
        { 
            id: "2017-op",
            description: "2017 Operational Forecast",
            date: "2017-07-15",
            years: { start: 1996, end: 2081 },
        }
    ]

#### `POST /touchstones/`
POST creates a new, empty touchstone. 
It expects this payload (all fields required):

    {
         id: "ID",
         description: "DESCRIPTION",
         date: "DATE"
    }

Fails if there is an existing touchstone with that ID.

### Countries
#### `GET /touchstones/[touchstone-id]/countries/`
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

#### `POST /touchstones/[touchstone-id]/countries/`
Adds a list of countries to a given touchstone. This can be an incomplete list, including just adding one country. (For example, because it was missed out earlier).

Example URL: `/touchstones/2017-op/countries/`

It expects a payload in the same format as the GET request. It will error if any new country has the same ID or name as an existing country.

#### `GET /touchstones/[touchstone-id]/countries/[country-id]/`
Returns demographic data for the country, as published in the relevant touchstone.

Example URL: `/touchstones/2017-op/countries/AFG/`

It returns data in this format:

    {
        id: "AFG",
        name: "Angola",
        touchstone: "2017-op",
        annualData: [
            {
                year: 1996,
                totalPopulation: 17481800,
                liveBirths: 835399,
                survivingBirths: 750582,
                under5MortalityRate: 148.6,
                infantMortalityRate: 102.7,
                neonatalMortalityRate: 47.5,
                lifeExpectancyAtBirth: 54.171
            },
            ...
        ]
    }

#### `PUT /touchstones/[touchstone-id]/countries/[country-id]/`
Adds demographic data to a country.

Example URL: `/touchstones/2017-op/countries/AFG/`

It expects a payload in this format:

    {
        id: "AFG",
        annualData: [
            {
                year: 1996,
                totalPopulation: 17481800,
                liveBirths: 835399,
                survivingBirths: 750582,
                under5MortalityRate: 148.6,
                infantMortalityRate: 102.7,
                neonatalMortalityRate: 47.5,
                lifeExpectancyAtBirth: 54.171
            },
            ...
        ]
    }

Not all years have to be uploaded in one go.

How to handle existing data? Overwrite? Overwrite with warning? Error, and require a separate call to delete the existing data?

### Scenarios
#### `GET /touchstones/[touchstone-id]/scenarios/`
This expects a touchstone id in the URL. e.g. `/touchstones/2017-op/scenarios/`

It returns an enumeration of scenarios in this touchstone:

    [
        {
            id: "menA-novacc",
            touchstone: "2017-op",
            description: "2017 OP, Menigitis A, No vaccination",
            vaccinationLevel: "none",
            disease: "MenA",
            vaccine: "MenA",
            type: "n/a"
        },
        {
            id: "yf-campaign-reactive-nogavi",
            touchstone: "2017-op",
            description: "2017 OP, Yellow Fever, Reactive campaign, SDF coverage without GAVI support",
            vaccinationLevel: "no-gavi",
            disease: "YF",
            vaccine: "YF",
            type: "campaign"
        }
    ]

Notes:

* `vaccinationLevel` must be one of `[none, no-gavi, gavi]`.
* `type` must be one of `[n/a, routine, campaign]`.

#### `GET /touchstones/[touchstone-id]/scenarios/[scenario-id]/`
Returns a single scenario and its accompanying coverage data.

Example URL: `/touchstones/2017-op/scenarios/menA-novacc/`

Example response:

    {
        scenario: {
            id: "menA-novacc",
            touchstone: "2017-op",
            description: "2017 OP, Menigitis A, No vaccination",
            vaccinationLevel: "none",
            disease: "MenA",
            vaccine: "MenA",
            type: "n/a",
        },
        countries: [ "AFG", "AGO", "ALB", "ARM", ... ],
        years: [ 1996, ... , 2062 ],
        coverage: [
            { 
                country: "AFG", 
                data: [
                    ...
                    { year: 2006, coverage: 0 },
                    { year: 2007, coverage: 64 },
                    { year: 2008, coverage: 63 },
                    ...
                ]
            },
            { 
                country: "AGO", 
                data: [
                    ...
                    { year: 2006, coverage: 0 },
                    { year: 2007, coverage: 83 },
                    { year: 2008, coverage: 81 },
                    ...
                ]
            },
            ...
        ]
    } 

#### `GET /touchstones/[touchstone-id]/scenarios/[scenario-id]/[country-code]`
Returns coverage data for a given country in a single scenario.

Example URL: `/touchstones/2017-op/scenarios/menA-novacc/AFG`

Example response:

    {
        scenario: "menA-novacc",
        touchstone: "2017-op",
        country: "AFG", 
        data: [
            ...
            { year: 2006, coverage: 0 },
            { year: 2007, coverage: 64 },
            { year: 2008, coverage: 63 },
            ...
        ]
    }

If no data has been uploaded for the given country code (and it is a valid country code) the `data` element will be an empty array. 

#### `POST /touchstones/[touchstone-id]/scenarios/`
Creates a new scenario. It expects data in the following format. All fields are required.

    {
        id: "ID",
        touchstone: "EXISTING TOUCHSTONE ID",
        description: "DESCRIPTION",
        vaccinationLevel: "VACCINATION LEVEL (See above for options),
        disease: "VALID DISEASE CODE",
        vaccine: "VALID VACCINE CODE",
        type: "SCENARIO TYPE (See above for options)"
    }

#### `PUT /touchstones/[touchstone-id]/scenarios/[scenario-id]/[country-code]/`
Adds coverage data to a scenario for a given country. 

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
#### `GET /touchstones/[touchstone-id]/status/`
Returns a summary of the completeness and correctness of the touchstone, so that the VIMC administrator can track progress through uploading a new touchstone.

Example URL: `/touchstones/2017-op/status/`

Returns data in this format:

    {
        id: "2017-op",
        description: "2017 Operational Forecast",
        date: "2017-07-15",
        status: {
            isComplete: false,
            years: { start: 1996, end: 2081 },
            countries: {
                count: 97,
                all: [ "AFG", "ALB", "AGO" ... ],
                problems: {
                    byCountry: [ 
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
                        "There are no scenarios for these vaccines: Hib3, HPV"
                    ],
                    byVaccine: [
                        {
                            id: "YF",
                            problems: [
                                "Expected a Yellow Fever 'No vaccination' scenario",
                                "Expected at least one Yellow Fever 'Routine' scenario",
                            ]
                        },
                        ...
                    ],
                    byScenario: [
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

## Questions
1. Do we need a "published" flag on reference data sets which hides them (and their sub-objects) from ordinary users until they have been completed?
2. Should coverage be an integer or a decimal?
3. Is there a better way of returning a 2D table of coverage data?
4. Do users actually want the coverage data for all countries, or would they handle them one at a time?
5. Should we return all years in the data set, or just the min and max? i.e. Can there be holes in the data? Perhaps we should define the years covered in the touchstone (with a start and an end) and reject any uploaded coverage data that doesn't provide numbers for every year in the touchstone?
6. Is it better to POST/PUT a blob of JSON, or http-encoded form data?
7. Do we add new diseases/vaccines/countries: Via the REST API? As part of adding a scenario (seems like a bad idea)? Or directly to the database? Are disease, vaccine and country codes specific to a given touchstone?
8. camelCase or snake_case?
