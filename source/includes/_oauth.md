#OAuth

Dwolla's API lets you interact with a user's Dwolla account and act on its behalf to transfer money, add funding sources, and more.  To do so, your application first needs to request authorization from users.  

Dwolla implements the [OAuth 2.0 standard](http://oauth.net/2/) to facilitate this authorization. Similar to Facebook and Twitter's authentication flow, the user is first presented with a permission dialog for your application, at which point the user can either approve the permissions requested, or reject them. Once the user approves, an `authorization_code` is sent to your application, which will then [be exchanged](#finish-authorization) for an `access_token` and a `refresh_token` pair.

The `access_token` can then be used to make API calls which require user authentication like [Initiate a Transfer](#initiate-transfer) or [List Transfers](#get-transfers-account).

### Token lifetimes

**Access tokens** are *short lived*: 1 hour.

**Refresh tokens** are *long lived*: 60 days.

A refresh token can be used within 60 days to generate a new access_token and refresh_token pair.  So long as you [refresh your authorization](#refresh-authorization) at least every 60 days, your application can maintain authorization indefinitely without requiring the user to re-authorize.

## Request user authorization

To start the OAuth process, construct the initiation URL which the user will visit in order to grant permission to your application.  It describes the permissions your application requires (`scope`), who the client application is (`client_id`), and where the user should be redirected to after they grant or deny permissions to your application (`redirect_uri`).

### URL Format:

#### Production
`
https://www.dwolla.com/oauth/v2/authenticate?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&scope={scope}
`

#### UAT(Sandox)
`
https://uat.dwolla.com/oauth/v2/authenticate?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&scope={scope}
`

Parameter | Optional |Description
----------|----------|------------
client_id | | Application key
response_type | | This must always be set to `code`
redirect_uri | | URL where the user will be redirected to afterwards. The value of this parameter must match one of the values that appear in your [application details](https://www.dwolla.com/applications) page. (We compare: protocol, subdomain, domain, tld, and file path. Querystring parameters are ignored)
scope | | Permissions you are requesting.  See [below](#oauth-scopes) for list of available scopes.  Scopes are delimited by a pipe ("&#124;")
verified_account | yes | Require new users opting to register for Dwolla to create a fully-verified Dwolla account instead of a default lightweight Direct account.
dwolla_landing | yes | An optional override that force displays either the login or create an account screen. Valid values are: `login`, `register`, or `null`.

<ol class="alerts">
    <li class="information icon-alert-info">Remember to url-encode all querystring parameters!</li>
</ol>

### OAuth scopes

Applications may request the following permission scopes when generating an access token:

Scope Name | Description
-----------|-------------
Transactions | Access the user's transfer data
Send | Transfer money on the user's behalf
Funding | Access names of funding sources the user has connected to Dwolla, access available balance information for Dwolla Balance and Dwolla Credit (if applicable), add new funding sources, verify funding sources, initiate transfers to and from funding sources.
ManageCustomers | Includes create Customers, manage their funding sources, and allow related money movement

```php
<?php

$OAuth = new Dwolla\OAuth();
$OAuth->settings->client_id = $apiKey;
$OAuth->settings->client_secret = $apiSecret;

$url = $OAuth->genAuthUrl("https://myredirect.com/redirect");

?>
```
```python
# you can find your client id and secret at dwolla.com/applications
client = dwollav2.Client(id = '...', secret = '...')

state = binascii.b2a_hex(os.urandom(15))
client.Auth(redirect_uri = 'https://yoursite.com/callback',
            scope = 'ManageCustomers|Funding',
            state = state)

# redirect the user to dwolla.com for authorization
redirect_to(auth.url)

# exchange the code for a token
token = auth.callback({'code': '...', 'state': state})
```
```javascript
// where to send the user after they grant permission:
var redirect_uri = "https://www.myredirect.com/redirect";  

// generate OAuth initiation URL
var authUrl = Dwolla.authUrl(redirect_uri);
```
```ruby
# config/initializers/dwolla.rb
# you can find your client id and secret at dwolla.com/applications
$dwolla = DwollaV2::Client.new(id: "...", secret: "...")

# app/controllers/your_auth_controller.rb
class YourAuthController
  # redirect the user to dwolla.com/oauth/v2/authenticate
  def authenticate
    redirect_to auth.url
  end

  # exchange the code for a token
  def callback
    token = auth.callback(params)
  end

  private

  def auth
    $dwolla.auths.new redirect_uri: "https://www.myredirect.com/redirect",
                      scope: "send|funding",
                      state: session[:state] ||= SecureRandom.hex
  end
end
```
```raw
not applicable
```

### Example initiation URL (where you send the user):

```rawnoselect
https://uat.dwolla.com/oauth/v2/authenticate?client_id=PO%2BSzGAsZCE4BTG7Cw4OAL40Tpf1008mDjGBSVo6QLNfM4mD%2Ba&response_type=code&redirect_uri=https://developers.dwolla.com/dev/token/callback?env=sandbox&scope=Balance%7CAccountInfoFull
```

## Finish user authorization

Once the user returns to your application via the `redirect_uri` you specified, there will be a `code` querystring parameter appended to that URL.  Exchange the authorization `code` for an `access_token` and `refresh_token` pair.

### HTTP request
**Production:** `POST https://www.dwolla.com/oauth/v2/token`

**UAT:** `POST https://uat.dwolla.com/oauth/v2/token`

Parameter | Description
----------|------------
client_id | Application key
client_secret | Application secret
code | The authorization code included in the redirect URL. Single use `code` with an expiration of 30 minutes.
grant_type | This must be set to `authorization_code`
redirect_uri | The same redirect_uri specified in the intiation step

### Response parameters

Parameter | Description
----------|------------
_links | Contains a link to the associated user account resource
access_token | A new access token with requested scopes
expires_in | The lifetime of the access token, in seconds.  Default is 3600.
refresh_token | New refresh token
refresh_expires_in | The lifetime of the refresh token, in seconds.  Default is 5184000.
token_type | Always `bearer`.
scope | Pipe <code>&#124;</code> delimited list of permission scopes granted
account_id | A unique user account ID for the associated user account

```noselect
{
  "client_id": "JCGQXLrlfuOqdUYdTcLz3rBiCZQDRvdWIUPkw++GMuGhkem9Bo",
  "client_secret": "g7QLwvO37aN2HoKx1amekWi8a2g7AIuPbD5C/JSLqXIcDOxfTr",
  "code": "h6TvQZH+5BsV//O43uOJ0uRkBLk=",
  "grant_type": "authorization_code",
  "redirect_uri": "https://www.myredirect.com/redirect"
}
```

### Successful response:

```noselect
{
  "_links": {
    "account": {
      "href": "https://api-uat.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
    }
  },
  "access_token": "sdWPNdPyteKlVEmudKa9K2oFGs4s7VpiGfxBGFyDsolvuveafk",
  "expires_in": 3600,
  "refresh_token": "EDidiHt28eRzthBlXvDDECz67wK3rNEA2fGdq46t8jOYqAuC4N",
  "refresh_expires_in": 5184000,
  "token_type": "bearer",
  "scope": "send|transactions|funding|managecustomers",
  "account_id": "ca32853c-48fa-40be-ae75-77b37504581b"
}
```

## Refresh authorization

Use a valid `refresh_token` to generate a new `access_token` and `refresh_token` pair.

**NOTE:** The `refresh_token` you receive will *change* every time you exchange either an `authorization_code` or `refresh_token` for a new token pair. However, If you exchange your last valid `refresh_token` within a short timespan of being issued a new token pair, Dwolla will return most recently issued token pair for a short duration of time.

### HTTP request

**Production:** `POST https://www.dwolla.com/oauth/v2/token`

**UAT:** `POST https://uat.dwolla.com/oauth/v2/token`

Parameter | Description
----------|------------
client_id | Application key
client_secret | Application secret
refresh_token | A valid refresh token
grant_type | This must be set to `refresh_token`

### Response parameters

Parameter | Description
----------|------------
_links | Contains a link to the associated user account resource
access_token | A new access token with requested scopes
expires_in | The lifetime of the access token, in seconds.  Default is 3600.
refresh_token | New refresh token
refresh_expires_in | The lifetime of the refresh token, in seconds.  Default is 5184000.
token_type | Always `bearer`.
scope | Pipe <code>&#124;</code> delimited list of permission scopes granted
account_id | A unique user account ID for the associated user account

```noselect
{
  "client_id": "JCGQXLrlfuOqdUYdTcLz3rBiCZQDRvdWIUPkw++GMuGhkem9Bo",
  "client_secret": "g7QLwvO37aN2HoKx1amekWi8a2g7AIuPbD5C/JSLqXIcDOxfTr",
  "refresh_token": "Pgk+l9okjwTCfsvIvEDPrsomE1er1txeyoaAkTIBAuXza8WvZY",
  "grant_type": "refresh_token"
}
```

### Successful response

```noselect
{
  "_links": {
    "account": {
      "href": "https://api-uat.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
    }
  },
  "access_token": "F3jK4rg7FGlq4yRQ7vWECoXVD4zQq9Xg26VnxzMbHGusZqr7dF",
  "expires_in": 3600,
  "refresh_token": "DRlqGJ0IFsRK8xzjkKhjTOgz3meet6E91T2oacGCefHGU4h1hj",
  "refresh_expires_in": 5184000,
  "token_type": "bearer",
  "scope": "send|transactions|funding|managecustomers",
  "account_id": "ca32853c-48fa-40be-ae75-77b37504581b"
}
```

### Invalid or expired refresh token response

```noselect
{
  "error": "access_denied",
  "error_description": "Invalid refresh token."
}
{
  "error": "access_denied",
  "error_description": "Expired refresh token."
}
```

## Application access token

Some endpoints require an *application access token*, which is different from a user access token.  Application access tokens don't require any particular user's authorization, since they grant your application access to resources which belong to the application itself (i.e. events, webhooks, and webhook-subscriptions), rather than an account. Provide your client credentials to receive an application access token.

### HTTP request

**Production:** `POST https://www.dwolla.com/oauth/v2/token`

**UAT:** `POST https://uat.dwolla.com/oauth/v2/token`

### Request parameters

Parameter | Description
----------|------------
client_id | Application key
client_secret | Application secret
grant_type | This must be set to `client_credentials`

### Response parameters

Parameter | Description
----------|------------
access_token | A new access token with requested scopes
expires_in | The lifetime of the access token, in seconds.  Default is 3600.
token_type | Always `bearer`.
scope | Pipe <code>&#124;</code> delimited list of permission scopes granted

```noselect
{
  "client_id": "JCGQXLrlfuOqdUYdTcLz3rBiCZQDRvdWIUPkw++GMuGhkem9Bo",
  "client_secret": "g7QLwvO37aN2HoKx1amekWi8a2g7AIuPbD5C/JSLqXIcDOxfTr",
  "grant_type": "client_credentials"
}
```

### Successful response

```noselect
{
  "access_token": "SF8Vxx6H644lekdVKAAHFnqRCFy8WGqltzitpii6w2MVaZp1Nw",
  "token_type": "bearer",
  "expires_in": 3600,
  "scope": "AccountInfoFull|ManageAccount|Contacts|Transactions|Balance|Send|Request|Funding"
}
```
