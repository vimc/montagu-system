# Onetime Tokens
Onetime tokens exist because for large file downloads we want the user to
directly rely on the browser's file streaming capabilities, rather than going
via the single-page webapps.

As the browser is not authenticated against the API, we instead use the webapp
to obtain a onetime, randomized token that requires no additional
authentication, and which can be passed back to the API as a query parameter.
The webapp then provides this URL as an ordinary anchor element for the user to
click on.

Each token:

* Is for a particular action, and a particular combination of URL parameters
* Works only once
* Expires after ten minutes if not used

## Getting a onetime token
Let's say you want a onetime token for the URL `/v1/some-url/?param=value`. You
can get a onetime token by making a GET request to `/v1/onetime_token?url=XXX`,
where XXX is a URL encoded version of your original URL. Note that you should
include the URL path, including the `v1`, but not the domain name or port.

The server will return a standard API response, and the `data` part will be a
string. This string is the onetime token.

When making a request to get a onetime token, you should [authenticate as usual](Authentication.md)
with a bearer token in the authentication header.

## Using a onetime token
Once you have the token, you can use it simply by making a request to the
original URL (GET, POST, or any other action), passing any POST data as normal,
and just append the onetime token as an additional query parameter
`access_token`. e.g. `/v1/some-url/?param=value&access_token=ABCDEF...`

This will perform the normal action for this URL, as well as invalidating the
token. Note that if there are errors in the user input - for example, an unknown
touchstone ID - these will only be checked at this point, not when the token is
requested.

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