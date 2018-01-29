# Modelling groups
## GET /modelling-groups/
Returns an enumeration of all modelling groups.

Required permissions: `modelling-groups.read`

Schema: [`ModellingGroups.schema.json`](../schemas/ModellingGroups.schema.json)

### Example
    [
        {
            "id": "IC-YellowFever",
            "description": "Imperial College, Yellow Fever, PI: Tini Garske"
        },
        {
            "id": "LSHTM-Measles",
            "description": "London School of Hygiene and Tropical Medicine, PI: Mark Jit"
        }
    ]

## GET /modelling-groups/{modelling-group-id}/
Returns the identified modelling group and their model(s).

Required permissions: `modelling-groups.read`, `models.read`.

Schema: [`ModellingGroupDetails.schema.json`](../schemas/ModellingGroupDetails.schema.json)

### Example
    {
        "id": "IC-YellowFever",
        "description": "Imperial College, Yellow Fever, PI: Tini Garske",
        "models": [
            {
                "id": "IC-YF-WithoutHerd",
                "description": "YF burden estimate - without herd effect",
                "citation": "Garske T, Van Kerkhove MD, Yactayo S, Ronveaux O, Lewis RF, Staples JE, Perea W, Ferguson NMet al., 2014, Yellow Fever in Africa: Estimating the Burden of Disease and Impact of Mass Vaccination from Outbreak and Serological Data, PLOS MEDICINE, Vol: 11, ISSN: 1549-1676",
                "modelling_group": "IC-YellowFever"
            }
        ],
        "members": [ "john.smith" ]
    }

## POST /modelling-groups/{modelling-group-id}/actions/associate-member/
Adds or removes a user from a modelling group.

Required permissions: `modelling-groups.manage-members` (scoped to the group or *)

Schema: [`AssociateUser.schema.json`](../schemas/AssociateUser.schema.json)

### Example
    {
        "action": "add",
        "username": "joe"
    }

