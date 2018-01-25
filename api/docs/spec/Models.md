# Models
## GET /models/
Returns an enumeration of all models

Required permissions: `models.read`

Schema: [`Models.schema.json`](../schemas/Models.schema.json)

### Example
    [
        { 
            "id": "IC-YF-WithoutHerd",
            "description": "YF burden estimate - without herd effect",
            "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
            "modelling_group": "IC-YellowFever"
        },
        { 
            "id": "LSHTM-DynaMice",
            "description": "DynaMice",
            "citation": "Dynamic Citation",
            "modelling_group": "LSHTML-Jit"
        }
    ]

## GET /models/{model-id}/
Returns a model and all its versions.

Required permissions: `models.read`

Schema: [`ModelDetails.schema.json`](../schemas/ModelDetails.schema.json)

### Example
    {
        "metadata": {
            "id": "IC-YF-WithoutHerd",
            "description": "YF burden estimate - without herd effect",
            "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
            "modelling_group": "IC-YellowFever"
        },
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

Required permissions: `models.write` scoped to the modelling group (or *).

Schema: [`Model.schema.json`](../schemas/Model.schema.json)

### Example
    { 
        "id": "NEW-UNIQUE-ID",
        "description": "DESCRIPTION",
        "citation": "CITATION",
        "modelling_group": "ID-OF-EXISTING-MODELLING-GROUP"
    }

## POST /models/{model-id}/versions/
Adds a new version to a model

Required permissions: `models.write` scoped to the modelling group (or *).

Schema: [`CreateModelVersion.schema.json`](../schemas/CreateModelVersion.schema.json)

### Example
    {
        "version": "5.7-stable",
        "note": "Notes about what's changed in the model",
        "fingerprint": null
    }
    
## GET /modelling-groups/{modelling-group-id}/model-run-parameters/{touchstone-id}/
Returns a list of model run parameter sets that the given modelling group has uploaded for responsibilities in the 
 given touchstone.

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
    