# Coverage
## GET /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/coverage-sets/
Returns metadata for the coverage sets associated with the responsibility.

Required permissions: Global scope: `scenarios.read`. Scoped to modelling group: `responsibilities.read` and `coverage.read`.  Additionally, to view coverage sets for an `in-preparation` touchstone, the user needs the `touchstones.prepare` permission.

If the touchstone is `in-preparation`, and the user does not have permission to see touchstones 
before they are made `open`, then this returns an error 404.

Schema: [`ScenarioAndCoverageSets.schema.json`](ScenarioAndCoverageSets.schema.json)

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
                "name": "Menigitis without GAVI support",
                "vaccine": "MenA",
                "gavi_support": "no gavi",
                "activity_type": "routine"
            },
            { 
                "id": 136,
                "touchstone": "2017-op-1",
                "name": "Menigitis with GAVI support",
                "vaccine": "MenA",
                "gavi_support": "total",
                "activity_type": "routine"
            }
        ]
    }

## GET /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/coverage/
Returns the amalgamated coverage data of all the coverage sets associated with this responsibility.

Required permissions: Global scope: `scenarios.read`. Scoped to modelling group: `responsibilities.read` and `coverage.read`.  Additionally, to view coverage data for an `in-preparation` touchstone, the user needs the `touchstones.prepare` permission.

If the touchstone is `in-preparation`, and the user does not have permission to see touchstones 
before they are made `open`, then this returns an error 404.

Depending on the "Accept" header sent by the client, there are two different
result formats. If "Accept" is "application/json" then both JSON metadata and 
CSV table data are returned, separated by a single line of three dashes. If
"Accept" is "text/csv" then only the CSV table data is returned.

### JSON metadata
Schema: [`ScenarioAndCoverageSets.schema.json`](ScenarioAndCoverageSets.schema.json)

#### Example
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
                "name": "Menigitis without GAVI support",
                "vaccine": "MenA",
                "gavi_support": "no gavi",
                "activity_type": "routine"
            },
            { 
                "id": 136,
                "touchstone": "2017-op-1",
                "name": "Menigitis with GAVI support",
                "vaccine": "MenA",
                "gavi_support": "total",
                "activity_type": "routine"
            }
        ]
    }

Coverage sets are returned in the order they are to be applied during impact
calculations.

### CSV table data
CSV data in this format:

       "scenario",                       "set_name", "vaccine", "gavi_support", "activity_type", country",    "year","age_first","age_last",  "age_range_verbatim", "target", coverage"
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",      2006,          0,         2,                    NA,       NA,        NA
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",      2007,          0,         2,                    NA,       NA,      64.0
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",      2008,          0,         2,                    NA,       NA,      63.0
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AGO",      2006,          0,         1,                    NA,       NA,       0.0
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AGO",      2007,          0,         1,"school aged children",  1465824,      83.0
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AGO",      2008,          0,         1,                    NA,       NA,      81.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",      2006,          0,         2,                    NA,       NA,        NA
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",      2007,          0,         2,                    NA,       NA,      80.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",      2008,          0,         2,                    NA,       NA,      80.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AGO",      2006,          0,         1,                    NA,       NA,      20.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AGO",      2007,          0,         1,                    NA,       NA,      90.0
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AGO",      2008,          0,         1,                    NA,       NA,      95.0

The coverage sets are de-normalized and merged into this single table. You can 
identify which coverage set a line is from using `scenario` plus `vaccine`, 
`gavi_support` and `activity_type`. Note that we don't expect the modellers to
need to know which coverage set the data is from.

### Query parameters:

#### format
Optional. A format to return the CSV in, either `wide` or `long`. Defaults to `long`.

Example wide format:

       "scenario",                       "set_name", "vaccine", "gavi_support", "activity_type", country",    "age_first","age_last",  "age_range_verbatim", "target_2006", "coverage_2006", "target_2007", "coverage_2007"
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",    0,         2,                    NA,                      NA,            83.1,          80.0,            79.1
    "menA-novacc", "Menigitis without GAVI support",    "MenA",      "no gavi",       "routine",    "AFG",    0,         1,                    NA,                      NA,            86.5,          88.3             82.2
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",    0,         2,                    NA,                      NA,            84.5,          89.4             82.4
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "routine",    "AFG",    0,         1,                    NA,                      NA,            86.5,          90.6             91.7
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "campaign",   "AFG",    0,         2,                    NA,                      NA,            87.5,          93.4             98.2
    "menA-novacc",    "Menigitis with GAVI support",    "MenA",        "total",       "campign",    "AFG",    0,         1,                    NA,                      NA,            88.5,          90.6             98.1


