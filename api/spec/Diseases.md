# Diseases
## GET /diseases/
Returns an enumeration of all diseases.

Required permissions: none

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

## GET /diseases/{disease-id}/
Returns one disease.

Required permissions: none

Schema: [`Disease.schema.json`](Disease.schema.json)

### Example
    {
        "id": "YF",
        "name": "Yellow Fever"
    }

## POST /diseases/
**NOT IMPLEMENTED**

Adds a new disease. Request data:

Required permissions: `diseases.write`

Schema: [`Disease.schema.json`](Disease.schema.json)

### Example
    {
        "id": "NEW-DISEASE-ID",
        "name": "NEW DISEASE NAME"
    }

Diseases cannot be deleted via the API.

## PATCH /diseases/{disease-id}/
**NOT IMPLEMENTED**

Update the disease's human-readable name. Request data:

Required permissions: `diseases.write`

Schema: [`UpdateDisease.schema.json`](UpdateDisease.schema.json)

### Example
    {
        "name": "NEW DISEASE NAME"
    }

You cannot update a disease's ID via the API.