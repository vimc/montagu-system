# Demographics
## GET /touchstones/{touchstone-id}/demographics/

Returns a list of available demographic data sets for this touchstone, including for each data set
whether multiple gender options are available.

Required permissions: `demographics.read`.

Schema: [`Demographics.schema.json`](Demographics.schema.json)

### Example
    [{ 
        "id" : "as-fert",
        "name": "Age-specific fertility",
        "source" : "unwpp2015",
        "gender_is_applicable": false
     },
     { 
        "id" : "tot-pop",
        "name" : "Total population",        
        "source" : "unwpp2015",
        "gender_is_applicable": true
     }]

## GET /touchstones/{touchstone-id}/demographics/{source-code}/{demographic-type-code}/

Returns the data set with given type. This data is returned in two parts: First the metadata, then the coverage in CSV format.

### Metadata
Schema: [`DemographicDataForTouchstone.schema.json`](DemographicDataForTouchstone.schema.json)

#### Example
    {
        "touchstone": { 
            "id": "2017-op-1",
            "name": "2017-op",
            "version": 1,            
            "description": "2017 Operational Forecast",
            "status": "finished"
        },
        "demographic_data":  { 
            "id" : "as-fert",
            "name": "Age-specific fertility",
            "source" : "UNWPP 2015",
            "countries" : ["AFG"],
            "age_interpretation": "age of mother (years)",
            "unit" : "avg births/mother"
        }
    }
    
### CSV
    
    "country_code_numeric", "country_code", "country","age of mother (years)",  "year", "avg births/mother"
    004,                    "AFG",          "Afghanistan",           "15-19",    1950,                 1.2
    004,                    "AFG",          "Afghanistan",           "15-19",    1955,                 1.2
    004,                    "AFG",          "Afghanistan",           "15-19",    1960,                 1.2   
    004,                    "AFG",          "Afghanistan",           "15-19",    1965,                 1.1   
    004,                    "AFG",          "Afghanistan",           "15-19",    1970,                 1.1   
    004,                    "AFG",          "Afghanistan",           "15-19",    1975,                 1.1  
    004,                    "AFG",          "Afghanistan",           "15-19",    1980,                 1.1  
    004,                    "AFG",          "Afghanistan",           "15-19",    1985,                 1.1  
    004,                    "AFG",          "Afghanistan",           "15-19",    1990,                 1.1 
    004,                    "AFG",          "Afghanistan",           "15-19",    1995,                 1.1 
         
### Example
    {
        "touchstone": { 
            "id": "2017-op-1",
            "name": "2017-op",
            "version": 1,            
            "description": "2017 Operational Forecast",
            "status": "finished"
        },
        "demographic_data":  { 
            "id" : "tot-pop",
            "name": "Total population",
            "source" : "UNWPP 2015",
            "countries" : ["AFG"],
            "age_interpretation": "age (years)",
            "unit" : "people",
            "gender" : "both"
        }
    }
    
Total population:
         
     "country_code_numeric", "country_code", "country",     "age (years)",  "gender",  "year",   "people"
      004,                   "AFG",          "Afghanistan", "0-0",    "both",    1950,      82724
      004,                   "AFG",          "Afghanistan", "0-0",    "both",    1951,      84699
      004,                   "AFG",          "Afghanistan", "0-0",    "both",    1952,      87807
      004,                   "AFG",          "Afghanistan", "0-0",    "both",    1953,      89014
      004,                   "AFG",          "Afghanistan", "0-0",    "both",    1954,      89993
                

### Query parameters:

#### gender
Optional. The gender to return, either `female`, `male`, or `both`. Defaults to `both`.

#### format
Optional. A format to return the CSV in, either `wide` or `long`. Defaults to `long`.

Example:
`/touchstones/2017-op-1/demographics/unwpp2015/tot_pop/?format=wide&gender=female`

Total population:

                "",       "",      "", "people"
         "country_code_numeric", "country_code", "country",     "gender",   "age",    1950,    1951,    1952,    1953,    1954, ...                             
         004,                    "AFG",          "Afghanistan", "female",   "0-0",   82724,    84699,   87807,   89014,  89993, ... 
         004,                    "AFG",          "Afghanistan", "female",   "1-1",   88021,    89725,   91720,   91726,  91727, ...   
         004,                    "AFG",          "Afghanistan", "female",   "2-2",   91720,    91784,   91884,   91920,  92679, ...   
         004,                    "AFG",          "Afghanistan", "female",   "3-3",   95671,    95612,   95700,   95724,  95780, ...   
         004,                    "AFG",          "Afghanistan", "female",   "4-4",   96103,    97724,   99720,  100120, 101103, ...   
