# VIMC draft API
# General points
* By default data returned is in JSON format, and POST and PUT data is expected 
  as a string containing JSON-formatted data. Some endpoints return or expect
  CSV data, and some return both JSON and CSV data, as described in the 
  individual endpoint descriptions.
* Dates and times are returned as strings according to the ISO 8601 standard.
* Unless otherwise noted, URLs and IDs embedded in URLs are case-sensitive.
* The canonical form for all URLs (not including query string) ends in a slash: 
  `/`.
* The API will be versioned via URL. So for version 1, all URLs will begin 
  `/v1/`. e.g. `http://vimc.dide.ic.ac.uk/api/v1/diseases/`
* When a POST results in the creation of a new object, the API returns a 
  response in the standard format (see below) with the 'data' field being the 
  URL that identifies the new resource.

# Security
Permissions are listed for each endpoint. All endpoints are assumed to require a
logged in user with the `can-login` permission unless otherwise noted.

See also [Security.md](Security.md).

# Standard response format
All responses are returned in a standard format. Throughout this specification, 
wherever an endpoint describes its response format, it should be assumed the payload is wrapped in
the standard response format, so that the `data` property holds the payload.

## Success
Schema: [`Response.schema.json`](../schemas/Response.schema.json)

### Example
    {
        "status": "success",
        "data": {},
        "errors": []
    }

## Error
Schema: [`Response.schema.json`](../schemas/Response.schema.json)

### Example
    {
        "status": "failure",
        "data": null,
        "errors": [
            { 
                "code": "unique-error-code", 
                "message": "Full, user-friendly error message" 
            }
        ]
    }

# Index
## GET /
The root of the API returns some simple data, which is mainly there to make it 
clear that you have correctly connected to the API. It also tells you what 
endpoints are implemented in the version you are currently connected to.

Required permissions: User does not need to be logged in to access this endpoint.

Schema: [`Index.schema.json`](../schemas/Index.schema.json)

### Example
    {
        "name": "montagu",
        "version": "1.0.0",
        "endpoints": [
            "/v1/authenticate/",
            "/v1/diseases/",
            "/v1/diseases/:id/",
            "/v1/touchstones/",
            "/v1/modelling-groups/",
            "/v1/modelling-groups/:group-id/responsibilities/:touchstone-id/"
        ]
    }

# Endpoints
For all other endpoints, see these files:

* [Authentication](Authentication.md)
* [Users](Users.md)
* [Diseases](Diseases.md)
* [Touchstones](Touchstones.md)
    - [Demographics](Demographics.md)
* [Models](Models.md)
* [Modelling groups](ModellingGroups.md)
    - [Responsibilities](Responsibilities.md)
    - [Coverage](Coverage.md)
    - [Burden estimates](BurdenEstimates.md)
    - [Model run parameters](ModelRunParameters.md)
* [Onetime links](OnetimeLink.md)
* [Unimplemented sections of the original spec design](NotImplemented.md)

# Onetime Link
Various endpoints can have `/get_onetime_link/` appended to the end of the
URL. This will return a JSON Web Token (JWT). A client can then make a GET or
POST request to `/onetime_link/{token}`, substituting the token received into
the URL. This will behave identically to having made the original request
without the `/get_onetime_link/` suffix, but it will require no authentication.
See [onetime-link-spec.md](onetime-link-spec.md) for more technical details.

Essentially, this is only useful as an implementation detail for the portals, so
if you are working directly with the API, don't worry about it. 

Which endpoints support this behavior is not clearly documented currently - see
the list of implemented endpoints in your API instance by browsing to the root 
URL.