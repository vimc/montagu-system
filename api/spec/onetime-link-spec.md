# Onetime Links
Onetime links exist because for large file downloads we want the user to 
directly rely on the browser's file streaming capabilities, rather than going
via the single-page webapps.

As the browser is not authenticated against the API, we instead use the 
webapp to obtain a onetime, randomized link that requires no additional
authentication. The webapp then provides this URL as an ordinary anchor element
for the user to click on.

Each link:

* Is for a particular action, and a particular combination of URL parameters
* Works only once
* Expires after ten minutes if not used

## Getting a onetime link token
Given an ordinary endpoint `/some-endpoint/` that provides data download, the 
API will normally provide an additional endpoint in the form 
`/some-endpoint/get_onetime_link/`. This secondary endpoint will require the
same permissions as the first endpoint, but instead of returning the data, it
instead returns a string. This is a onetime link token.

### Anatomy of a onetime link token
This section is only relevant to the server implementation.

The token is a signed Json Web Token. It contains these claims:

- sub: The text `onetime_link`
- action: An action, which is from a predefined set: e.g. `coverage`
- payload: URL encoded parameters. For example: 
  `group-id=IC-Garske&touchstone-id=2017A-1&scenario_id=yf-novacc`
- nonce: A 256-bit nonce, encoded in base64. This prevents replay attacks by
  ensuring a token generated for the same URL is always different.
- exp: The timestamp the token expires
- iss: The text `vaccineimpact.org`
- username: The requester's username

The server stores the signed token in the database table 'onetime_token'.

## Using a onetime link token
Once you have a token, you always use it with one of:
`GET /onetime_link/{token}/`, `POST /onetime_link/{token}/`.

This will verify the token, perform the original action, invalidate the token, 
and return the data as if the original URL had been invoked. Note that if there
are errors in the user input - for example, an unknown touchstone ID - these 
will only be checked at this point, not when the token is requested.

### Redirection

If making a POST request via a browser, we need to request a redirect back to the web app
after the action has been performed. To do this, append a query parameter `redirectUrl` 
to the original request for a token. The API will throw a 400 error if the redirect is not 
one of our allowed domains: http://localhost, https://localhost, 
https://support.montagu.dide.ic.ac.uk, https://montagu.vaccineimpact.org or https://129.31.26.29.

The last is the IP address of Montagu in production, added to debug an issue with Cloudflare
preventing uploads of large files. This may change.

Example: `/some-endpoint/get_onetime_link/?redirectUrl=http://localhost`

### Server implementation details
The server will:

1. Check the token is present and signed and hasn't expired
2. Check the subject is `onetime_link`
3. Check the token exists in the database and then removes it from the database 
   so it can't be reused.
4. Creates an IActionContext that contains the parsed payload as its "params", 
   but otherwise delegates as normal to `request` and `response` objects.
5. Based on the `action` claim invokes a controller action directly and returns 
   its contents (via the standard transformer)