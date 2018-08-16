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
If the username and password are correct, and the user has the `can-login` 
permission then a JSON web token is returned that can be used in future 
requests. It is returned in two ways, as a cookie and in the body of the 
response. The cookie is for use in the browser. To use the token 
programmatically, include the access token using the Authorization header,
with this format: `Authorization: Bearer TOKEN` in future requests to other 
endpoints.

Schema: [`LoginSuccessful.schema.json`](../schemas/LoginSuccessful.schema.json)

#### Example

    {
        "access_token": "2YotnFZFEjr1zCsicMWpAA",
        "token_type": "bearer",
        "expires_in": 3600
    }

Otherwise an error response is returned, as per [this part of the OAuth2 Spec](https://tools.ietf.org/html/rfc6749#section-5.2).

## GET /set-shiny-cookie/
Required permissions: `can-login`.
This request can be made by a browser to set a cookie that allows authorized users to access Montagu shiny apps through
 their browser

### Request
When making an ajax request to this endpoint the Request `credentials` property must be set to `include`:
https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials

### Response
If the user is successfully authenticated, the response contains a `Set-Cookie` header, which sets a cookie called 
`jwt_token` containing a JSON web token with a single claim, `allowed_shiny` which is true iff the user has the 
`reports.review` permission. The cookie is HttpOnly, Secure, and lasts only as long as the browser session.

## GET /logout/
Does not require authentication.
This request can be made by a browser to clear the main auth cookie 
(`montagu_jwt_token`), as well as the `jwt_token` cookie set by a request to the 
`set-shiny-cooke` endpoint.

### Request
When making an ajax request to this endpoint the Request `credentials` property must be set to `include`:
https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials

### Response
The response contains `Set-Cookie` headers, which sets the cookies to an empty 
string.