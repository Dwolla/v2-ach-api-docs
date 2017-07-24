# Authorization

Dwolla utilizes the [OAuth 2 protocol](https://oauth.net/2/) to facilitate authorization. OAuth is an authorization framework that enables a third-party application to obtain access to protected resources (Transfers, Funding Sources, etc.) in the Dwolla API. Access to the Dwolla API can be granted to an application either on behalf of a user or on behalf of the application itself. The following section will walk through Dwolla’s implementation of OAuth 2 and the various flows that can be leveraged by your application.  

#### Creating an application
Before you can get started with making OAuth requests, you’ll need to first register an application with Dwolla by logging in and navigating to the applications page. Once an application is registered you will obtain your `client_id` and `client_secret` (aka application Key and Secret), which will be used to identify your application when calling the Dwolla API. The Sandbox environment provides you with a created application once you have signed up for an account. Learn more in our [getting started guide](https://developers.dwolla.com/guides/sandbox-setup/). **Remember:** Your client_secret should be kept a secret! Be sure to store your client credentials securely.

#### Dwolla's authorization flows
The OAuth 2 protocol defines four main authorization grant types, more commonly referred to as OAuth flows. Dwolla implements two of the four grant types depending on how your application accesses data within the API.

* **Flow 1 (Account authorization):** - Using the [authorization code grant flow](/guides/auth/authorization-code-flow.html), your application will redirect the user to Dwolla (typically via a web browser) to authenticate and authorize your application. If the user grants permission, your application will be issued an access token that is used to make requests to the API on the user's behalf. This is a browser-based flow with interaction between an end-user, a third-party application, and the Dwolla API; also known as 3-legged OAuth.
* **Flow 2 (Application authorization):** - Using the [client credentials grant flow](/guides/auth/client-credentials-flow.html), your application will obtain authorization to interact with the API on its own behalf. This is a server-to-server flow with interaction between an application and the Dwolla API; also known as 2-legged OAuth. An application will exchange it’s `client_id`, `client_secret`, and `grant_type=client_credentials` for an application access token. An application access token is for managing webhooks, webhook-subscriptions, and events.

#### Token lifetimes

**Access tokens** are *short lived*: 1 hour.

**Refresh tokens** are *long lived*: 60 days.

A refresh token can be used within 60 days to generate a new OAuth account account access_token and refresh_token pair.  So long as you [refresh your authorization](#refresh-authorization) at least every 60 days, your application can maintain authorization indefinitely without requiring the user to re-authorize.

## Account authorization

### Step 1: Request user authorization
To start the OAuth process, construct the initiation URL which the user will visit in order to grant permission to your application.  It describes the permissions your application requires (`scope`), who the client application is (`client_id`), and where the user should be redirected to after they grant or deny permissions to your application (`redirect_uri`).

### URL Format:
**Production:**`https://www.dwolla.com/oauth/v2/authenticate?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&scope={scope}`

**Sandbox:** `https://sandbox.dwolla.com/oauth/v2/authenticate?client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&scope={scope}`

#### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| client_id | yes | string | Application key. Navigate to `https://www.dwolla.com/applications` (production) or `https://sandbox.dwolla.com/applications` (Sandbox) for your application key and secret. |
| response_type | yes | string | This must always be set to `code`. |
| redirect_uri | yes | string | URL where the user will be redirected to afterwards. The value of this parameter must match one of the values that appear in your [application details](https://www.dwolla.com/applications) page. (We compare: protocol, subdomain, domain, tld, and file path. Querystring parameters are ignored) |
| scope | yes | string | Permissions you are requesting.  See [below](#oauth-scopes) for list of available scopes.  Scopes are delimited by a pipe ("&#124;") |
| state | no | string | Primary purpose is protection against cross-site request forgery (CSRF) attacks. A random value set by the client (you) in the initial OAuth authorization request, and is then made available to you in the redirect (along with the authorization `code`).  |
| verified_account | no | string | Require new users opting to register for Dwolla to create a fully-verified Dwolla account instead of a default lightweight Direct account. |
| dwolla_landing | no | string | An optional override that force displays either the login or create an account screen. Possible values are: `login`, `register`, or `null`. |

<ol class="alerts">
    <li class="information icon-alert-info">Remember to url-encode all querystring parameters!</li>
</ol>

#### OAuth scopes

Applications may request the following permission scopes when requesting authorization:

| Scope Name | Description |
|-----------|--------------|
| Transactions | Access the user's transfer data. |
| Send | Transfer money on the user's behalf. |
| Funding | Access names of funding sources the user has connected to Dwolla, access available balance information for Dwolla Balance and Dwolla Credit (if applicable), add new funding sources, verify funding sources, initiate transfers to and from funding sources. |
| AccountInfoFull | Includes name and Dwolla account ID |

#### Example complete OAuth flow

```php
/**
 *  No example for this language yet.
 **/
```
```python
import dwollav2

# Navigate to https://www.dwolla.com/applications (production) or https://dashboard-sandbox.dwolla.com/applications (Sandbox) for your application key and secret.
app_key = '...'
app_secret = '...'
client = dwollav2.Client(key = app_key,
                         secret = app_secret,
                         environment = 'sandbox') # optional - defaults to production

state = binascii.b2a_hex(os.urandom(15))
client.Auth(redirect_uri = 'https://yoursite.com/callback',
            scope = 'Send|Funding|Transactions|AccountInfoFull',
            state = state)

# redirect the user to dwolla.com for authorization
redirect_to(auth.url)

# exchange the code for a token using the query params provided to the redirect_uri
token = auth.callback(req.GET)
```
```javascript
// where to send the user after they grant permission:
var redirect_uri = "https://www.myredirect.com/redirect";  

var auth = new client.Auth({
  redirect_uri: redirect_uri,
  scope: 'Send|Funding|Transactions|AccountInfoFull',
  state: getRandomHex(), // optional - https://tools.ietf.org/html/rfc6749#section-10.12
  verified_account: false, // optional
  dwolla_landing: 'register', // optional
});

// redirect to `auth.url`
auth.callback(req.query) // pass the code and optional state to the callback
  .then(function(token) {
    return token.get('/');
  })
  .then(function(res) {
    console.log(JSON.stringify(res.body));
  });

```
```ruby
# config/initializers/dwolla.rb
require 'dwolla_v2'

# Navigate to https://www.dwolla.com/applications (production) or https://dashboard-sandbox.dwolla.com/applications (Sandbox) for your application key and secret.
app_key = "..."
app_secret = "..."
$dwolla = DwollaV2::Client.new(key: app_key, secret: app_secret) do |config|
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
                      scope: "Send|Funding|Transactions|AccountInfoFull",
                      state: session[:state] ||= SecureRandom.hex
  end
end
```
```raw
not applicable
```

#### Example initiation URL (where you send the user):

```rawnoselect
https://sandbox.dwolla.com/oauth/v2/authenticate?client_id=PO%2BSzGAsZCE4BTG7Cw4OAL40Tpf1008mDjGBSVo6QLNfM4mD%2Ba&response_type=code&redirect_uri=https://developers.dwolla.com/dev/token/callback?env=sandbox&scope=Balance%7CAccountInfoFull
```

### Step 2: Finish user authorization

Once the user returns to your application via the `redirect_uri` you specified, there will be a `code` querystring parameter appended to that URL.  The `redirect_uri` specified in the initial authorization request is used by Dwolla to handle both the approval of authorization, as well as if the user cancels out of the flow or denies authorization. If the user denies authorization an error will be returned as an `error` querystring parameter. Exchange the authorization `code` for an `access_token` and `refresh_token` pair.

#### HTTP request
**Production:** `POST https://www.dwolla.com/oauth/v2/token`

**sandbox:** `POST https://sandbox.dwolla.com/oauth/v2/token`

Including the `Content-Type: application/x-www-form-urlencoded` header, the request is sent to the token endpoint with the following `form-encoded` parameters:

#### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| client_id | yes | string | Application key. Navigate to `https://www.dwolla.com/applications` (production) or `https://sandbox.dwolla.com/applications` (Sandbox) for your application key. |
| client_secret | yes | string | Application secret. Navigate to `https://www.dwolla.com/applications` (production) or `https://dashboard-sandbox.dwolla.com/applications` (Sandbox) for your application secret. |
| code | yes | string | The authorization code included in the redirect URL. Single use `code` with an expiration of 60 seconds. |
| grant_type | yes | string | This must be set to `authorization_code`. |
| redirect_uri | yes | string | The same redirect_uri specified in the intiation step. |

#### Response parameters

| Parameter | Description |
| ----------|------------|
| _links | Contains a link to the associated user account resource |
| access_token | A new access token with requested scopes |
| expires_in | The lifetime of the access token, in seconds.  Default is 3600. |
| refresh_token | New refresh token |
| refresh_expires_in | The lifetime of the refresh token, in seconds.  Default is 5184000. |
| token_type | Always `bearer`. |
| scope | Pipe <code>&#124;</code> delimited list of permission scopes granted |
| account_id | A unique user account ID for the associated user account |

#### Request

```noselect
POST https://sandbox.dwolla.com/oauth/v2/token
Content-Type: application/x-www-form-urlencoded

client_id=CGQXLrlfuOqdUYdTcLz3rBiCZQDRvdWIUPkwasGMuGhkem9Bo&client_secret=g7QLwvO37aN2HoKx1amekWi8a2g7AIuPbD5CcJSLqXIcDOxfTr&code=h6TvQZHr5BsVcfO43uOJ0uRkBLki&grant_type=authorization_code&redirect_uri=https%3A%2F%2Fwww.myapplication.com%2Fredirect
```

#### Successful response

```noselect
{
  "_links": {
    "account": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
    }
  },
  "access_token": "sdWPNdPyteKlVEmudKa9K2oFGs4s7VpiGfxBGFyDsolvuveafk",
  "expires_in": 3600,
  "refresh_token": "EDidiHt28eRzthBlXvDDECz67wK3rNEA2fGdq46t8jOYqAuC4N",
  "refresh_expires_in": 5184000,
  "token_type": "bearer",
  "scope": "send|transactions|funding|accountinfofull",
  "account_id": "ca32853c-48fa-40be-ae75-77b37504581b"
}
```

## Refresh account authorization

Use a valid `refresh_token` to generate a new `access_token` and `refresh_token` pair.

**NOTE:** The `refresh_token` you receive will *change* every time you exchange either an `authorization_code` or `refresh_token` for a new token pair. However, If you exchange your last valid `refresh_token` within a short timespan of being issued a new token pair, Dwolla will return most recently issued token pair for a short duration of time.

#### HTTP request

**Production:** `POST https://www.dwolla.com/oauth/v2/token`

**Sandbox:** `POST https://sandbox.dwolla.com/oauth/v2/token`

Including the `Content-Type: application/x-www-form-urlencoded` header, the request is sent to the token endpoint with the following `form-encoded` parameters:

#### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| client_id | yes | string | Application key. Navigate to `https://www.dwolla.com/applications` (production) or `https://dashboard-sandbox.dwolla.com/applications` (Sandbox) for your application key. |
| client_secret | yes | string | Application secret. Navigate to `https://www.dwolla.com/applications` (production) or `https://dashboard-sandbox.dwolla.com/applications` (Sandbox) for your application secret. |
| refresh_token | yes | string | A valid refresh token. |
| grant_type | yes | string | This must be set to `refresh_token`. |

#### Response parameters

| Parameter | Description |
|----------|--------------|
| _links | Contains a link to the associated user account resource |
| access_token | A new access token with requested scopes |
| expires_in | The lifetime of the access token, in seconds.  Default is 3600. |
| refresh_token | New refresh token |
| refresh_expires_in | The lifetime of the refresh token, in seconds.  Default is 5184000. |
| token_type | Always `bearer`. |
| scope | Pipe <code>&#124;</code> delimited list of permission scopes granted |
| account_id | A unique user account ID for the associated user account |

#### Request

```noselect
POST https://sandbox.dwolla.com/oauth/v2/token
Content-Type: application/x-www-form-urlencoded

client_id=CGQXLrlfuOqdUYdTcLz3rBiCZQDRvdWIUPkwasGMuGhkem9Bo&client_secret=g7QLwvO37aN2HoKx1amekWi8a2g7AIuPbD5CcJSLqXIcDOxfTr&grant_type=refresh_token&refresh_token=Pgkel9okjwTCfsvIvEDPrsomE1er1txeyoaAkTIBAuXza8WvZY
```

#### Successful response

```noselect
{
  "_links": {
    "account": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
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

#### Invalid or expired refresh token response

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

## Application authorization

Some endpoints require an **application access token**, which is different from a user **account access token**.  Application access tokens don't require any particular user's authorization, since they grant an application access to resources which belong to the application itself (i.e. events, webhooks, and webhook-subscriptions), rather than an account. Provide your client credentials to receive an application access token.

#### HTTP request

**Production:** `POST https://www.dwolla.com/oauth/v2/token`

**Sandbox:** `POST https://sandbox.dwolla.com/oauth/v2/token`

Including the `Content-Type: application/x-www-form-urlencoded` header, the request is sent to the token endpoint with the following `form-encoded` parameters:

#### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| client_id | yes | string | Application key. Navigate to `https://www.dwolla.com/applications` (production) or `https://sandbox.dwolla.com/applications` (Sandbox) for your application key. |
| client_secret | yes | string | Application secret. Navigate to `https://www.dwolla.com/applications` (production) or `https://sandbox.dwolla.com/applications` (Sandbox) for your application secret. |
| grant_type | yes | string | This must be set to `client_credentials`. |

#### Response parameters
Parameter | Description
----------|------------
access_token | A new access token that is used to authenticate against resources that belong to the app itself.
expires_in | The lifetime of the access token, in seconds.  Default is 3600.
token_type | Always `bearer`.

#### Request

```raw
POST https://sandbox.dwolla.com/oauth/v2/token
Content-Type: application/x-www-form-urlencoded

client_id=CGQXLrlfuOqdUYdTcLz3rBiCZQDRvdWIUPkwasGMuGhkem9Bo&client_secret=g7QLwvO37aN2HoKx1amekWi8a2g7AIuPbD5CcJSLqXIcDOxfTr&grant_type=client_credentials
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
# This example assumes you've already intialized the client. Reference the SDKs page for more information: https://developers.dwolla.com/pages/sdks.html
application_token = client.Auth.client()
```
```javascript
// Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-node
// This example assumes you've already intialized the client. Reference the SDKs page for more information: https://developers.dwolla.com/pages/sdks.html
client.auth.client()
  .then(function(appToken) {
    return appToken.get('webhook-subscriptions');
  })
  .then(function(res) {
    console.log(JSON.stringify(res.body));
  });
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
# This example assumes you've already intialized the client. Reference the SDKs page for more information: https://developers.dwolla.com/pages/sdks.html
application_token = $dwolla.auths.client
# => #<DwollaV2::Token client=#<DwollaV2::Client id="..." secret="..." environment=:sandbox> access_token="..." expires_in=3600 scope="...">
```
```php
/**
 *  No support for this language yet. We recommend using an external REST client for making OAuth requests.
 **/
```
* * *
