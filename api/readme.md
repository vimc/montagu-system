# VIMC draft API
## General points
* All data returned is in JSON format. POST and PUT data is expected as a string containing JSON-formatted data.
* Dates and times are returned as strings according to the ISO 8601 standard.
* Unless otherwise noted, URLs and IDs embedded in URLs are case-sensitive.

## Touchstones
Here, all `GET` methods are available to modelling groups, but `POST` methods are only available to authorised VIMC central users.

### Touchstones
#### `GET /touchstones/`
Returns an enumeration of all touchstones in this format:

    [
        { 
            id: "2017-wuenic",
            description: "2017 WUENIC Update",
            date: "2017-07-15"
        },
        { 
            id: "2017-op",
            description: "2017 Operational Forecast",
            date: "2017-07-15"
        }
    ]
#### `POST /touchstones/`
Creates a new, empty touchstone. It expects this payload (all fields required):

    {
         id: "ID",
         description: "DESCRIPTION",
         date: "DATE"
    }

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

## Questions
1. Do we need a "published" flag on reference data sets which hides them (and their sub-objects) from ordinary users until they have been completed?
2. Should coverage be an integer or a decimal?
3. Is there a better way of returning a 2D table of coverage data?
4. Do users actually want the coverage data for all countries, or would they handle them one at a time?
5. Should we return all years in the data set, or just the min and max? i.e. Can there be holes in the data? Perhaps we should define the years covered in the touchstone (with a start and an end) and reject any uploaded coverage data that doesn't provide numbers for every year in the touchstone?
6. Is it better to POST/PUT a blob of JSON, or http-encoded form data?
7. Do we add new diseases/vaccines/countries: Via the REST API? As part of adding a scenario (seems like a bad idea)? Or directly to the database? Are disease, vaccine and country codes specific to a given touchstone?