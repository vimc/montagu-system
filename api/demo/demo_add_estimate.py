#!/usr/bin/env python3
import json
import requests

url = "http://localhost:8080/v1/modellers/IC-Garske/estimates/"
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
	"scenario_id": "yf-yf-routine-gavi",
	"model_name": "YF burden estimate - without herd effect",
	"model_version": "no version information",
	"outcomes": outcomes
}

res = requests.post(url, data=json.dumps(data))
print("Status: {}".format(res.status_code))
print(res.text)