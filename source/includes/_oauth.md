#OAuth

Dwolla's API lets you interact with a user's Dwolla account and act on its behalf to transfer money, add funding sources, and more.  To do so, your application first needs to request authorization from users.  

Dwolla implements the [OAuth 2.0 standard](http://oauth.net/2/) to facilitate this authorization. Similar to Facebook and Twitter's authentication flow, the user is first presented with a permission dialog for your application, at which point the user can either approve the permissions requested, or reject them. Once the user approves, an `authorization_code` is sent to your application, which will then [be exchanged](#finish-user-authorization) for an `access_token` and a `refresh_token` pair.

The `access_token` can then be used to make API calls which require user authentication like [Initiate a Transfer](#initiate-a-transfer) or [List Transfers](#list-and-search-transfers-for-an-account).

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

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| client_id | yes | string | Application key. |
| response_type | yes | string | This must always be set to `code`. |
| redirect_uri | yes | string | URL where the user will be redirected to afterwards. The value of this parameter must match one of the values that appear in your [application details](https://www.dwolla.com/applications) page. (We compare: protocol, subdomain, domain, tld, and file path. Querystring parameters are ignored) |
| scope | yes | string | Permissions you are requesting.  See [below](#oauth-scopes) for list of available scopes.  Scopes are delimited by a pipe ("&#124;") |
| verified_account | no | string | Require new users opting to register for Dwolla to create a fully-verified Dwolla account instead of a default lightweight Direct account. |
| dwolla_landing | no | string | An optional override that force displays either the login or create an account screen. Possible values are: `login`, `register`, or `null`. |

<ol class="alerts">
    <li class="information icon-alert-info">Remember to url-encode all querystring parameters!</li>
</ol>

### OAuth scopes

Applications may request the following permission scopes when generating an access token:

| Scope Name | Description |
|-----------|--------------|
| Transactions | Access the user's transfer data. |
| Send | Transfer money on the user's behalf. |
| Funding | Access names of funding sources the user has connected to Dwolla, access available balance information for Dwolla Balance and Dwolla Credit (if applicable), add new funding sources, verify funding sources, initiate transfers to and from funding sources. |
| ManageCustomers | Includes create Customers, manage their funding sources, and allow related money movement. <br/> **Note:** This is a privileged scope available within our [White Label API](https://www.dwolla.com/white-label?b=apidocs)(v2). While fully available in our testing environment, White Label integrations will not be permitted to launch in production without first agreeing to a paid contract. [Contact sales](https://www.dwolla.com/contact?b=apidocs) to learn more. |

```php
/**
 *  No example for this language yet.
 **/
```
```python
import dwollav2

# you can find your consumer key and secret at dwolla.com/applications
consumer_key = '...'
consumer_secret = '...'
client = dwollav2.Client(id = consumer_key,
                         secret = consumer_secret,
                         environment = 'sandbox') # optional - defaults to production

state = binascii.b2a_hex(os.urandom(15))
client.Auth(redirect_uri = 'https://yoursite.com/callback',
            scope = 'ManageCustomers|Funding',
            state = state)

# redirect the user to dwolla.com for authorization
redirect_to(auth.url)

# exchange the code for a token using the query params provided to the redirect_uri
token = auth.callback(req.GET)
```
```javascript
// where to send the user after they grant permission:
var redirect_uri = "https://www.myredirect.com/redirect";  

// generate OAuth initiation URL
var authUrl = Dwolla.authUrl(redirect_uri);
```
```ruby
# config/initializers/dwolla.rb
require 'dwolla_v2'

# see dwolla.com/applications or uat.dwolla.com/applications (sandbox) for your consumer key and secret
consumer_key = "..."
consumer_secret = "..."
$dwolla = DwollaV2::Client.new(id: consumer_key, secret: consumer_secret) do |config|
  config.environment = :sandbox # optional - defaults to production
end

# app/controllers/your_auth_controller.rb
class YourAuthController
  # redirect the user to dwolla.com/oauth/v2/authenticate
  def authenticate
    redirect_to auth.url
  end

  # exchange the code for a token
  def callback
    account_token = auth.callback(params)
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

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| client_id | yes | string | Application key. |
| client_secret | yes | string | Application secret. |
| code | yes | string | The authorization code included in the redirect URL. Single use `code` with an expiration of 60 seconds. |
| grant_type | yes | string | This must be set to `authorization_code`. |
| redirect_uri | yes | string | The same redirect_uri specified in the intiation step. |

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
POST https://www.dwolla.com/oauth/v2/token
Content-Type: application/json

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

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| client_id | yes | string | Application key. |
| client_secret | yes | string | Application secret. |
| refresh_token | yes | string | A valid refresh token. |
| grant_type | yes | string | This must be set to `refresh_token`. |

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

Some endpoints require an *application access token*, which is different from a user **account access token**.  Application access tokens don't require any particular user's authorization, since they grant an application access to resources which belong to the application itself (i.e. events, webhooks, and webhook-subscriptions), rather than an account. Provide your client credentials to receive an application access token.

**Note:** If an application has the `ManageCustomers` scope enabled, it can also be used to access the API for White Label Customer related functions. Application tokens can be created using the client_credentials OAuth grant type

### HTTP request

**Production:** `POST https://www.dwolla.com/oauth/v2/token`

**UAT:** `POST https://uat.dwolla.com/oauth/v2/token`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| client_id | yes | string | Application key. |
| client_secret | yes | string | Application secret. |
| grant_type | yes | string | This must be set to `client_credentials`. |

### Response parameters

Parameter | Description
----------|------------
access_token | A new access token that is used to authenticate against resources that belong to the app itself.
expires_in | The lifetime of the access token, in seconds.  Default is 3600.
token_type | Always `bearer`.
scope | Pipe <code>&#124;</code> delimited list of permission scopes granted. **Deprecation note:** This response parameter will be removed on **November 23, 2016**.

### Request

```noselect
POST https://www.dwolla.com/oauth/v2/token
Content-Type: application/json

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
* * *
