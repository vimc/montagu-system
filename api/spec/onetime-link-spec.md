    GET /modelling-groups/{group-id}/responsibilities/{touchstone-id}/{scenario-id}/coverage/get_onetime_link/
    RETURNS token

token is JWT signed token, with claims:

- sub: onetime_link
- action: coverage
- payload: group-id=GROUP_ID&touchstone-id=TOUCHSTONE_ID&scenario_id=SCENARIO_ID
- nonce: gfdgjfdslkgshidcfhglkdcshglkdhglkdsfhglkdxshglkdshg
- exp: [DATE]
- iss: vaccineimpact.org

The token, in its signed form, is stored in the a new database table 'onetime_token'. It has
just one column, which is the token.

`GET /onetime_link/{token}/` does the following:

1. Checks the token is present and signed and hasn't expired
2. Checks the subject is `onetime_link`
3. Checks the token exists in the database and then removes it from the database so it can't be 
   reused
4. Creates an IActionContext that contains the parsed payload as its "params", but otherwise
   delegates as normal to `request` and `response` objects.
5. Based on the `action` claim invokes a controller action directly and returns its contents
   (via the standard transformer)