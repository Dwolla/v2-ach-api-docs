# Introduction

Welcome to the [Dwolla API](https://www.dwolla.com/platform) documentation. This API will give you the ability to connect your software to banking infrastructure to move money, store funds, validate customer identities, and verify bank accounts.

## Making requests

All requests should supply the `Accept: application/vnd.dwolla.v1.hal+json` header. `POST` requests must specify the `Content-Type: application/vnd.dwolla.v1.hal+json` header. Request and response bodies are JSON encoded.

Requests must be made over HTTPS.  Any non-secure requests are met with a redirect (HTTP 302) to the HTTPS equivalent URI.

<ol class = "alerts">
    <li class="alert icon-alert-info">
      Dwolla has discontinued support for TLS 1.0 and TLS 1.1 across the platform as of June 30, 2018. This impacts a small number of integrations; however, to avoid service disruption, you will need to ensure that you’re connecting to the Dwolla API using TLS v1.2 or higher.
  </li>
</ol>

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

All requests require either an OAuth access token or a `client_id` and `client_secret`.  OAuth access tokens are passed via the `Authorization` HTTP header:

`Authorization: Bearer {access_token_here}`

### API Host
**Production:** `https://api.dwolla.com`

**Sandbox:** `https://api-sandbox.dwolla.com`

## Idempotency key

To prevent an operation from being performed more than once, Dwolla supports passing in an `Idempotency-Key` header with a unique key as the value. Multiple `POSTs` with the same idempotency key won't result in multiple resources being created. It is recommended to use a random value for the idempotency key, like a UUID (i.e. - `Idempotency-Key: d2adcbab-4e4e-430b-9181-ac9346be723a`).

For example, if a request to [initiate a transfer](#initiate-a-transfer) fails due to a network connection issue, you can reattempt the request with the same idempotency key to guarantee that only a single transfer is created.

If you reattempt a `POST` request with the same value for the `Idempotency-Key`, rather than creating new or potentially duplicate resources, you will receive a `201 Created`, with the original response of the created resource. If the Dwolla server is still processing the original `POST` request, you will receive a `409 Conflict` error response on the subsequent request. Idempotency keys are intended to prevent conflicts over a short period of time, therefore keys will expire after 24 hours.

<ol class = "alerts">
   <li class="alert icon-alert-info">
     To prevent resources from being created more than once, we highly recommend making all requests idempotent.
   </li>
</ol>

#### Example transfer using an Idempotency Key
```noselect
POST https://api-sandbox.dwolla.com/transfers
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
Idempotency-Key: 19051a62-3403-11e6-ac61-9e71128cae77

{
    "_links": {
        "destination": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/04173e17-6398-4d36-a167-9d98c4b1f1c3"
        },
        "source": {
            "href": "http://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
        }
    },
    "amount": {
        "currency": "USD",
        "value": "1337.00"
    }
}
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
                "message": "FirstName required.",
                "path": "/firstName",
                "_links": {}
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
  "lastName": "doe",
  "email": "jdoe@nomail.com",
  "type": "personal",
  "status": "retry",
  "created": "2015-09-29T19:47:28.920Z"
}
```

## Tools

The following section will outline development tools you can take advantage of to assist in your integration with the Dwolla API. The available tools can help to improve your testing and development workflow, as well as aid in solving a difficult problem (e.g. UI generation) when integrating Dwolla into your application.

### Dwolla Hal-Forms
[Dwolla HAL-Forms](https://github.com/Dwolla/hal-forms) is an extension of the [HAL spec](http://stateless.co/hal_specification.html) and was created to describe how Dwolla represents forms in the API. The extension starts with the media type. The media type should be used as a profile link as part of the `Accept` header of the request in conjunction with the Dwolla HAL style media type. By including these two media-type identifiers in the Accept header, the API knows that you’re looking for a form for the given resource.

##### Example Accept header value
`application/vnd.dwolla.v1.hal+json; profile="https://github.com/dwolla/hal-forms"`

The primary benefit is the ability to dynamically generate your UI based on the state of a particular resource. Your application can easily transition state without knowing Dwolla's business rules and what information needs to included in the actual request to transition state. When an `"edit-form"` link relation is returned on the resource, then your application can follow the link by making a GET request to that resource, including the header shown above. The response will include a simple JSON response body that contains information on the HTTP method, message content-type, and the request parameters used when sending the request to the Dwolla API. **Note:** Currently, forms are only returned for creating & editing customers, but we’re looking forward to expanding them across our existing and future endpoints.

Reference [the spec](https://github.com/Dwolla/hal-forms) for more information on the properties that can be returned in the Dwolla HAL-FORMS response. Or read a [blog post](https://www.dwolla.com/updates/simplified-customer-onboarding-through-a-better-formed-api/) from one of our developers on building out this functionality.

* * *
