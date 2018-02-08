# Burden estimates
## GET /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/estimate-sets/
Returns metadata for all burden estimates that have been uploaded for this 
responsibility.

Required permissions: Scoped to modelling group: `estimates.read`, `responsibilities.read`. If the estimates belong to a touchstone that is `open` then they are only returned if the user has `estimates.read-unfinished` (again scoped to the modelling group)

Schema: [`BurdenEstimates.schema.json`](../schemas/BurdenEstimates.schema.json)

### Example
    [
        {
            "id": 1,
            "uploaded_by": "tgarske",
            "uploaded_on": "2017-10-06T11:18:06Z",
            "type": {
                "type": "central-averaged",
                "details": "Mean over all stochastic runs"
            },
            "problems": [],
            "status": "complete"
        }
    ]

## GET /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/estimate-sets/{estimate-id}/
Returns the full burden estimate data.

Required permissions: Scoped to modelling group: `estimates.read`, `responsibilities.read`. If the estimates belong to a touchstone that is `open` then they are only returned if the user has `estimates.read-unfinished` (again scoped to the modelling group)

If the client sends an Accept header of `application/json` then it returns 
multipart data with two sections, separated by a line of three dashes. The first
section is JSON metadata; the second section is CSV data. If the client sends
an Accept header of `text/csv` only the CSV data is returned.

### JSON metadata
Schema: [`BurdenEstimateSet.schema.json`](../schemas/BurdenEstimateSet.schema.json)

### Example
    {
        "id": 1,
        "uploaded_by": "tgarske",
        "uploaded_on": "2017-10-06T11:18:06Z",
        "type": {
            "type": "central-averaged",
            "details": "Mean over all stochastic runs"
        },
        "problems": [],
        "status": "empty"
    }

### CSV data
The last four columns will vary based on which outcomes are present in the 
database. There may be more or fewer columns.

    "disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
       "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
       "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
       "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
       "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870

## POST /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/estimate-sets/
Creates a new, empty burden estimate set.

Can only by invoked if:

* The touchstone is `open`
* The relevant responsibility set is `incomplete`

Required permissions: Scoped to modelling group: `estimates.write`, `responsibilities.read`.

Returns the integer id of the new set.

### JSON metadata
Schema: [`CreateBurdenEstimateSet.schema.json`](../schemas/CreateBurdenEstimateSet.schema.json)

### Example
    {
        "type": {
            "type": "central-averaged",
            "details": "Mean over 100 runs"
        },
        "model_run_parameter_set": 1
    }

## POST /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/estimate-sets/{set-id}/
Populates an empty or partially filled burden estimate set.

Can only by invoked if:

* The set status is `empty` or `partial`
* The touchstone is `open`
* The relevant responsibility set is `incomplete`

Required permissions: Scoped to modelling group: `estimates.write`, `responsibilities.read`.

Takes CSV data in the following format. Note that the last four columns are
based on which outcomes you wish to upload values for. More or fewer columns
are allowed so long as all the outcome columns correspond to allowed burden
outcomes in the database.

    "disease", "year", "age", "country", "country_name", "cohort_size", "deaths", "cases", "dalys"
       "Hib3",   1996,    50,     "AFG",  "Afghanistan",         10000,     1000,    2000,      NA
       "Hib3",   1997,    50,     "AFG",  "Afghanistan",         10500,      900,    2000,      NA
       "Hib3",   1996,    50,     "AGO",       "Angola",          5000,     1000,      NA,    5670
       "Hib3",   1997,    50,     "AGO",       "Angola",          6000,     1200,      NA,    5870

If the burden estimate set was created with type 'stochastic' then an additional
column, `run_id`, is expected between `disease` and `year`. See 
[BurdenEstimate.csvschema.json](../schemas/BurdenEstimate.csvschema.json) and 
[StochasticBurdenEstimate.csvschema.json](../schemas/StochasticBurdenEstimate.csvschema.json)
for a strict definition.

### Keep open
This endpoint takes `keepOpen=true|false` as a query parameter. If omitted, 
defaults to `false`. If `keepOpen` is `true`, the burden estimate set is moved 
into the `partial` status (if it is not already in that status). Otherwise
the burden estimate set is moved into the `complete` status (meaning no more
estimates can be added).

In a future version of the API, burden estimate sets will always stay in the
`partial` state after population, the `keepOpen` parameter will be removed, 
and all clients will have to explicitly mark the set as `complete` via another
endpoint. Clients should begin following that scheme now.

## POST /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/estimate-sets/{set-id}/actions/clear/
Deletes all burden estimates from an burden estimate set, leaving metadata
unchanged. This can only be invoked if:

* The set status is `empty` or `partial`
* The touchstone is `open`
* The relevant responsibility set is `incomplete`

Required permissions: Scoped to modelling group: `estimates.write`, `responsibilities.read`.

## POST /modelling-groups/{modelling-group-id}/responsibilities/{touchstone-id}/{scenario-id}/estimate-sets/{set-id}/actions/close/
Marks a burden estimate set as `complete`. This can only be invoked if:

* The touchstone is `open`
* The relevant responsibility set is `incomplete`
* The burden estimate set is **valid** - currently this is not implemented, but
  in the future at this point we will check there is no missing data, no 
  suspicious values, etc.

Required permissions: Scoped to modelling group: `estimates.write`, `responsibilities.read`.