#!/usr/bin/env python
import json
import requests

url = "http://localhost:8080/v1/modellers/imperial/estimates/"
outcomes = [
	{ 
		"country_id": "AFG",
		"data": [
			{ "year": 1996, "number_of_deaths": 78946 },
			{ "year": 1997, "number_of_deaths": 72345 },
		]
	},
	{ 
		"country_id": "AGO",
		"data": [
			{ "year": 1996, "number_of_deaths": 12345 },
			{ "year": 1997, "number_of_deaths": 13435 },
		]
	}
]

data = {
	"scenario_id": "menA-novacc",
	"model_version": "SuperModel 1.2",
	"outcomes": outcomes
}

res = requests.post(url, data=json.dumps(data))
print(res.text)