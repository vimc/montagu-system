# Authentication
## POST /authenticate/
Required permissions: User does not need to be logged in to access this endpoint.

### Request
For the request, see [this part of the OAuth2 Spec](https://tools.ietf.org/html/rfc6749#section-4.4.2).
In short, use HTTP Basic authentication, and send content encoded using "application/x-www-form-urlencoded"
(rather than the JSON used elsewhere in the API). The content should always be "grant_type=client_credentials".

Like so:

    POST /token HTTP/1.1
    Host: server.example.com
    Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
    Content-Type: application/x-www-form-urlencoded
    
    grant_type=client_credentials

### Response
If the username and password are correct, and the user has the `can-login` permission:

Schema: [`LoginSuccessful.schema.json`](LoginSuccessful.schema.json)

#### Example

    {
        "access_token": "2YotnFZFEjr1zCsicMWpAA",
        "token_type": "bearer",
        "expires_in": 3600
    }

Future requests to other endpoints should included the access token using the Authorization header,
with this format: `Authorization: Bearer TOKEN`.

Otherwise an error response is returned, as per [this part of the OAuth2 Spec](https://tools.ietf.org/html/rfc6749#section-5.2).