# Model run parameters
## GET /modelling-groups/{modelling-group-id}/model-run-parameters/{touchstone-id}/
Returns a list of model run parameter sets that the given modelling group has
uploaded for responsibilities in the  given touchstone.

Required permissions: Scoped to modelling group: `responsibilities.read`.

Schema: [`ModelRunParameterSets.schema.json`](../schemas/ModelRunParameterSets.schema.json)

### Example
    [
        {
            "id": 1,
            "description": "our first set of parameters",
            "model": "HPVGoldie-flat",
            "uploaded_by": "tgarske",
            "uploaded_on": "2017-10-06T11:18:06Z",
            "disease": "YF"
        }
    ]
    

## POST /modelling-groups/{modelling-group-id}/model-run-parameters/{touchstone-id}/
Creates a new model run parameter set for the given model. 

Required permissions: Scoped to modelling group: `estimates.write`.

Accepts multipart/form-data with one text part named "description", which
should a human readable description for the new set, one text part named
"disease", which must be a valid disease  id, and one file part named "file",
which must be CSV data in the following format

    "run_id", "param_1", "param_2", 
       "1",   10,    50,
       "2",   10,    60,
       "3",   20,    50,

## GET /modelling-groups/{modelling-group-id}/model-run-parameters/{touchstone-id}/{model-run-parameter-set-id}/
Returns the model run parameters in a single set as a .csv file.

Required permissions: Scoped to modelling group: `estimates.write` and `responsibilities.read`.

Example of structure of output file is:

    "run_id", "param_1", "param_2", 
       "1",   10,    50,
       "2",   10,    60,
       "3",   20,    50,