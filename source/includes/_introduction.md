# Introduction

Welcome to the Dwolla API V2 documentation, with ongoing updates as functionality is released to the API. We plan to implement API V1 functionality in API V2, but in the meantime, the two versions will operate in parallel.

The initial focus of API Version 2 centers around a premium product: [white label](https://www.dwolla.com/white-label), and provides different functionality from API Version 1. Over time, we are adding the same functionality currently available in V1 to V2.

Official SDKs for Java, Node.JS, PHP, Ruby, and Python are being actively developed.

Please note: white label is a premium product that cannot be activated in our production environment until you’ve received our approval to use it and have entered into an agreement with us. Please [contact a sales representative](https://www.dwolla.com/contact?b=apidocs) to find a package that best meets your needs.

## Making requests

All requests should supply the `Accept: application/vnd.dwolla.v1.hal+json` header. `POST` requests must have a JSON encoded body and the `Content-Type: application/vnd.dwolla.v1.hal+json` header.

Requests must be made over HTTPS.  Any non-secure requests are met with a redirect (HTTP 302) to the HTTPS equivalent URI.

```noselect
POST https://api.dwolla.com/customers
Content-Type: application/json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer myOAuthAccessToken123

{
  "foo": "bar"
}

... or ...

GET https://api.dwolla.com/accounts/a84222d5-31d2-4290-9a96-089813ef96b3/transfers
```

### Authorization

Request and response bodies are JSON encoded.

All requests require either an OAuth access token or a `client_id` and `client_secret`.  OAuth access tokens are passed via the `Authorization` HTTP header:

`Authorization: Bearer {access_token_here}`

Requests that require an client_id and client_secret are passed in the JSON request body for `POST` requests or as querystring parameters for `GET` requests:

`GET https://api.dwolla.com/example?client_id={client_id}&client_secret={client_secret}`

### API Host
**Production:** https://api.dwolla.com

**Sandbox:** https://api-uat.dwolla.com

## Idempotency key

To prevent an operation from being performed more than once, Dwolla supports passing in an `Idempotency-Key` header with a unique key as the value. Multiple `POSTs` with the same idempotency key won't result in multiple resources being created.

For example, if a request to [initiate a transfer](#initiate-transfer) fails due to a network connection issue, you can reattempt the request with the same idempotency key to guarantee that only a single transfer is created.

If you reattempt a `POST` request with the same value for the `Idempotency-Key`, you will receive the original response. It is recommended to use a random value for the idempotency key, like a UUID (i.e. - `Idempotency-Key: d2adcbab-4e4e-430b-9181-ac9346be723a`). Idempotency keys are intented to prevent conflicts over a short period of time, therefore keys will expire after 24 hours. If the Dwolla server is still processing the original `POST`, you will receive a `409 Conflict` error response on the subsequent request.

#### Example transfer using an Idempotency Key
```noselect
curl -X POST -H "Content-Type: application/vnd.dwolla.v1.hal+json" -H "Accept: application/vnd.dwolla.v1.hal+json" -H "Authorization: Bearer asdfwXTdDQFimVQOMdn9bOGHJh8KrqnFi34sugYqgrULRCb" -H "Idempotency-Key: d2adcbab-4e4e-430b-9181-ac9346be723a" -d '{
    "_links": {
        "destination": {
            "href": "https://api-uat.dwolla.com/customers/d795f696-2cac-4662-8f16-95f1db9bddd8"
        },
        "source": {
            "href": "http://api-uat.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
        }
    },
    "amount": {
        "currency": "USD",
        "value": "1337.00"
    }
}' "https://api-uat.dwolla.com/transfers" -v

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

#### _embedded JSON object

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

Some links, such as `funding-sources`, give you a URL which you can follow to access related resources.  For example, the customer resource has a `funding-sources` link which, when followed, will list the customer's available funding sources.

Responses which contain a collection of resources have pagination links, `first`, `next`, `last`, and `prev`.

```noselect
{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/customers/132681FA-1B4D-4181-8FF2-619CA46235B1"
    },
    "funding-sources": {
      "href": "https://api.dwolla.com/customers/132681FA-1B4D-4181-8FF2-619CA46235B1/funding-sources"
    },
    "transfers": {
      "href": "https://api.dwolla.com/customers/132681FA-1B4D-4181-8FF2-619CA46235B1/transfers"
    },
    "retry-verification": {
      "href": "https://api.dwolla.com/customers/132681FA-1B4D-4181-8FF2-619CA46235B1"
    }
  },
  "id": "132681FA-1B4D-4181-8FF2-619CA46235B1",
  "firstName": "Jane",
  "lastName": "Jones",
  "email": "jjones@nomail.com",
  "type": "personal",
  "status": "retry",
  "created": "2015-09-29T19:47:28.920Z"
}
```