# Expectations
## GET /expectations/
Returns an enumeration of all expectations, along with the touchstone version id, modelling group and disease to which
they apply. Expectations are returned only for open touchstones and responsibilities.

Required permissions: */responsibilities.read

Schema: [`TouchstoneModelExpectations.schema.json`](../schemas/TouchstoneModelExpectations.schema.json)

#### Example

    [
        {
            "touchstone_version": "2017-op-1",
            "modelling_group": "IC-Garkse",
            "disease": "YF",
            "expectation": {
                "id": 12,
                "description": "Expectations for pilot run",
                "years": {
                    "minimum_inclusive": 2000,
                    "maximum_inclusive": 2100
                },
                "ages": {
                    "minimum_inclusive": 0,
                    "maximum_inclusive": 99
                },
                "cohorts": {
                    "minimum_birth_year": 1950,
                    "maximum_birth_year": 2050
                },
                "outcomes": ["cases","deaths"]
            },
            "applicable_scenarios": ["yf-routine", "yf-campaign"]
        },
        {
            "touchstone_version": "2018-op-1",
            "modelling_group": "IC-Garkse",
            "disease": "YF",
            "expectation": {
                "id": 13,
                "description": "Expectations for pilot run",
                "years": {
                    "minimum_inclusive": 2000,
                    "maximum_inclusive": 2100
                },
                "ages": {
                    "minimum_inclusive": 0,
                    "maximum_inclusive": 99
                },
                "cohorts": {
                    "minimum_birth_year": 1960,
                    "maximum_birth_year": 2060
                },
                "outcomes": ["cases"]
            },
            "applicable_scenarios": ["yf-routine"]
        }
    ]
