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
            "modelling_group": "IC-YellowFever",
            "gender_specific": false,
            "gender": "both",
            "current_version: {
                "id":"14",
                "model":"IC-YF-WithoutHerd",
                "version":"v1",
                "note":"Variation withoud herd",
                "fingerprint":"ic-yf-wh",
                "is_dynamic":true,
                "code":"R"
           }
        },
        { 
            "id": "LSHTM-DynaMice",
            "description": "DynaMice",
            "citation": "Dynamic Citation",
            "modelling_group": "LSHTML-Jit",
            "gender_specific": true,
            "gender": "female",
            "current_version": null
        }
    ]

## GET /models/{model-id}/
Returns a model and all its versions.

Required permissions: `models.read`

Schema: [`Model.schema.json`](../schemas/Model.schema.json)

### Example
    { 
        "id": "IC-YF-WithoutHerd",
        "description": "YF burden estimate - without herd effect",
        "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
        "modelling_group": "IC-YellowFever",
        "gender_specific": false,
        "gender": "both",
        "current_version: {
            "id":"14",
            "model":"IC-YF-WithoutHerd",
            "version":"v1",
            "note":"Variation withoud herd",
            "fingerprint":"ic-yf-wh",
            "is_dynamic":true,
            "code":"R"
       }
    }
## POST /models/
**NOT IMPLEMENTED**
Creates a new model.

Required permissions: `models.write` scoped to the modelling group (or *).

Schema: [`Model.schema.json`](../schemas/Model.schema.json)

### Example
    { 
        "id": "NEW-UNIQUE-ID",
        "description": "DESCRIPTION",
        "citation": "CITATION",
        "modelling_group": "ID-OF-EXISTING-MODELLING-GROUP"
        "gender_specific": false,
        "gender": "both"
    }

## POST /models/{model-id}/versions/
**NOT IMPLEMENTED**
Adds a new version to a model

Required permissions: `models.write` scoped to the modelling group (or *).

Schema: [`CreateModelVersion.schema.json`](../schemas/CreateModelVersion.schema.json)

### Example
    {
        "version": "5.7-stable",
        "note": "Notes about what's changed in the model",
        "fingerprint": null
        "is_dynamic":true,
        "code":"R"
    }
    
