# Notice of deprecation

Dwolla will soon be discontinuing support for the legacy V1 // Transfer API across the platform.  

* On October 1, 2018, users will no longer be able to create accounts full Dwolla accounts and direct Dwolla accounts in the old Dwolla interface.
* On December 3, 2018 businesses will no longer be able to use the legacy Dwolla dashboard for any type of transaction.  

<ol class = "alerts">
  <li class="alert icon-alert-info">
    Dwolla will soon be discontinuing support for the legacy V1 // Transfer API across the platform.
  </li>
</ol>

**To avoid service disruption, your business will need to consider integrating with [Dwolla's V2 API](https://www.dwolla.com/pricing) or you will need to consider other payment services sooner than later.**

# Introduction

Welcome to the Dwolla Transfer documentation. Connect your software to the banking infrastructure. Transfer is for customers building applications where the end user interacts with the Dwolla branded interface. Transfer integrations leverage OAuth to facilitate user on-boarding and Dwolla account authorization. Upgrades to additional features like Next Day ACH, increased transaction limits, and priority support are available. Platforms requiring full customization of the payments experience should [contact Sales](http://dwolla.com/contact) to learn more about our [Dwolla API](https://www.dwolla.com/platform).

## Making requests

All requests should supply the `Accept: application/vnd.dwolla.v1.hal+json` header. `POST` requests must specify the `Content-Type: application/vnd.dwolla.v1.hal+json` header. Request and response bodies are JSON encoded.

Requests must be made over HTTPS.  Any non-secure requests are met with a redirect (HTTP 302) to the HTTPS equivalent URI.

```noselect
POST https://api.dwolla.com/funding-sources/a84222d5-31d2-4290-9a96-089813ef96b3
Content-Type: application/json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer myOAuthAccessToken

{
  "name": "John Doe - Checking"
}

... or ...

GET https://api.dwolla.com/accounts/a84222d5-31d2-4290-9a96-089813ef96b3/transfers
```

### Authorization

All requests require either an OAuth access token or a `client_id` and `client_secret` (Application Key and Secret). OAuth access tokens are passed via the `Authorization` HTTP header:

`Authorization: Bearer {access_token_here}`

Requests that require a client_id and client_secret can be sent using the `application/x-www-form-urlencoded` Content-Type or via a JSON body with the `application/json` Content-Type.

### API Host
**Production:** https://api.dwolla.com

**Sandbox:** https://api-sandbox.dwolla.com

## Idempotency key

To prevent an operation from being performed more than once, Dwolla supports passing in an `Idempotency-Key` header with a unique key as the value. Multiple `POSTs` with the same idempotency key won't result in multiple resources being created.

For example, if a request to [initiate a transfer](#initiate-a-transfer) fails due to a network connection issue, you can reattempt the request with the same idempotency key to guarantee that only a single transfer is created.

If you reattempt a `POST` request with the same value for the `Idempotency-Key`, you will receive the original response. It is recommended to use a random value for the idempotency key, like a UUID (i.e. - `Idempotency-Key: d2adcbab-4e4e-430b-9181-ac9346be723a`). Idempotency keys are intented to prevent conflicts over a short period of time, therefore keys will expire after 24 hours. If the Dwolla server is still processing the original `POST`, you will receive a `409 Conflict` error response on the subsequent request.

#### Example transfer using an Idempotency Key
```noselect
curl -X POST -H "Content-Type: application/vnd.dwolla.v1.hal+json" -H "Accept: application/vnd.dwolla.v1.hal+json" -H "Authorization: Bearer asdfwXTdDQFimVQOMdn9bOGHJh8KrqnFi34sugYqgrULRCb" -H "Idempotency-Key: d2adcbab-4e4e-430b-9181-ac9346be723a" -d '{
    "_links": {
        "source": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/28baca50-12ef-4a26-a14b-adf75af694d4"
        },
        "destination": {
            "href": "http://api-sandbox.dwolla.com/accounts/dee319e6-26d0-4dc6-a5bf-f1e0f4c677ad"
        }
    },
    "amount": {
        "currency": "USD",
        "value": "1337.00"
    }
}' "https://api-sandbox.dwolla.com/transfers" -v

```

## Errors

Error responses use HTTP status codes to indicate the type of error. The JSON response body will contain a top-level error code and a message with a detailed description of the error. Errors will contain their own media type and will closely align with [this spec](https://github.com/blongden/vnd.error).

### Example HTTP 401 error

```noselect
{
  "code": "InvalidAccessToken",
  "message": "Invalid access token."
}
```

### Common errors
The following errors are common across all API endpoints.

| HTTP Status | Error Code | Description
|-------------|------|-------------
| 400 | BadRequest | The request body contains bad syntax or is incomplete. |
| 400 | ValidationError | Validation error(s) present. See embedded errors list for more details. ([See below](#validation-errors)) |
| 401 | InvalidCredentials | Missing or invalid Authorization header. |
| 401 | InvalidAccessToken | Invalid access token. |
| 401 | ExpiredAccessToken | Generate a new access token using a valid refresh token. |
| 401 | InvalidAccountStatus | Invalid access token account status. |
| 401 | InvalidApplicationStatus | Invalid application status. |
| 401 | InvalidScopes | Missing or invalid scopes for requested endpoint. |
| 403 | Forbidden | The supplied credentials are not authorized for this resource. |
| 403 | InvalidResourceState | Resource cannot be modified. |
| 404 | NotFound | The requested resource was not found. |
| 405 | MethodNotAllowed | (varies) |
| 406 | InvalidVersion | Missing or invalid API version. |
| 500 | ServerError | A server error occurred. Error ID: 63e92a2a-fb48-4a23-ab4c-24a6764f1593. |
| 500 | RequestTimeout | The request timed out. |

### Validation errors
Responses with a top-level error code of `ValidationError` are returned when it’s possible to correct a specific problem with your request. The response will include a message: "Validation error(s) present. See embedded errors list for more details." At least one, but possibly more, detailed error will be present in the list of embedded errors. Multiple errors are represented in a collection of embedded error objects.

#### `_embedded` JSON object

| Parameter | Description
|-----------|------------|
|errors | An array of JSON object(s) that contain a `code`, `message`, and `path`.

The `path` field is a JSON pointer to the specific field in the request that has a problem. The `message` is a human readable description of the problem. The `code` is a detailed error code that can have one of the following values:

- Required
- Invalid - not a valid value for this field
- InvalidFormat - chars in an amount field, for instance
- Duplicate - "A customer with the specified email already exists."
- ReadOnly - this field is not allowed to be modified
- NotAllowed - value, while valid/exists, is not allowed to be used
- Restricted - account or customer restricted from this activity
- InsufficientFunds - used on source or destination fields of transfer endpoint
- RequiresFundingSource - used on destination field of transfer endpoint to indicate customer needs a bank
- FileTooLarge - used on document upload

#### Example HTTP 400 validation error

```noselect
{
    "code": "ValidationError",
    "message": "Validation error(s) present. See embedded errors list for more details.",
    "_embedded": {
        "errors": [
            {
                "code": "Required",
                "message": "FirstName is required.",
                "path": "/firstName",
            }
        ]
    }
}
```

## Links

Relationships and available actions for a resource are represented with links.  All resources have a `_links` attribute.  At a minimum, all resources will have a `self` link which indicates the URL of the resource itself.

Some links, such as `funding-sources`, give you a URL which you can follow to access related resources.  For example, the Account resource has a `funding-sources` link which, when followed, will list the Account's available funding sources.

Responses which contain a collection of resources have pagination links, `first`, `next`, `last`, and `prev`.

```noselect
{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/accounts/07844b76-bfeb-4a81-87ec-adebc7fa6cfe",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "account"
    },
    "receive": {
      "href": "https://api-sandbox.dwolla.com/transfers",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    },
    "funding-sources": {
      "href": "https://api-sandbox.dwolla.com/accounts/07844b76-bfeb-4a81-87ec-adebc7fa6cfe/funding-sources",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "funding-source"
    },
    "transfers": {
      "href": "https://api-sandbox.dwolla.com/accounts/07844b76-bfeb-4a81-87ec-adebc7fa6cfe/transfers",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    },
    "send": {
      "href": "https://api-sandbox.dwolla.com/transfers",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    }
  },
  "id": "07844b76-bfeb-4a81-87ec-adebc7fa6cfe",
  "name": "Dwolla Sandbox",
  "timezoneOffset": 0
}
```

* * *
