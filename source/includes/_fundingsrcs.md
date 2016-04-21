# Funding sources

Add and retrieve ACH bank account information via funding sources, which are available to the `Customers` and `Accounts` resources.  Customers can have a maximum of 6 funding sources.

### Funding source resource

Parameter | Description
----------|------------
id | The funding source unique identifier
status | Is the funding source verified?
type | Type of funding source
name | Customer’s arbitrary nickname for the funding source
created | ISO-8601 timestamp

```noselect
{
    "routingNumber": "222222226",
    "accountNumber": "123456789",
    "type": "checking",
    "name": "My Bank"
}
```

## Create a funding source

Create a new funding source for an [Account](#accounts).

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Funding` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`POST https://api.dwolla.com/funding-sources`

Parameter | Optional? | Description
----------|------------|-------------
accountNumber | no | The bank account number.
routingNumber | no | The bank account's routing number.
type | no | Type of bank account: `checking` or `savings`.
name | no | Arbitrary nickname for the funding source.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 400 | Duplicate funding source or validation error.
| 403 | Not authorized to create funding source.


### Request and response

```noselect
POST /funding-sources
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
{
    "routingNumber": "222222226",
    "accountNumber": "123456789",
    "type": "checking",
    "name": "My Bank"
}

...

HTTP/1.1 201 Created
Location: https://api-uat.dwolla.com/funding-sources/04173e17-6398-4d36-a167-9d98c4b1f1c3
```

## Get a funding source by id

This section covers how to retrieve a funding source by id.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Funding` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/funding-sources/{id}`

### Request parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | id of funding source to retrieve.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Funding source not found. |

### Request and response

```raw
GET https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c"
    },
    "customer": {
      "href": "https://api.dwolla.com/customers/36e9dcb2-889b-4873-8e52-0c9404ea002a"
    },
    "initiate-micro-deposits": {
      "href": "https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c/micro-deposits"
    }
  },
  "id": "692486f8-29f6-4516-a6a5-c69fd2ce854c",
  "status": "unverified",
  "type": "bank",
  "name": "Test checking account",
  "created": "2015-10-23T20:37:57.137Z"
}
```
```ruby
funding_source_url = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
funding_source = account_token.get funding_source_url
funding_source.name # => "Test checking account"

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
funding_source = DwollaSwagger::FundingsourcesApi.id(funding_source_url)
funding_source.name # => "Test checking account"
```
```php
<?php
$fundingSourceUrl = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fundingSource = $fsApi->id($fundingSourceUrl);
$fundingSource->name; # => "Test checking account"
?>
```
```python
funding_source_url = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

fs_api = dwollaswagger.FundingsourcesApi(client)
funding_source = fs_api.id(funding_source_url)

funding_source.name # => 'Test checking account'
```
```javascript
var fundingSourceUrl = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';

accountToken
  .get(fundingSourceUrl)
  .then(function(res) {
    res.body.name; // => "Test checking account"
  });
```

## Initiate or verify micro-deposits

This section covers how to initiate and verify micro-deposits for bank verification. Reference the [funding source verification](https://developers.dwolla.com/resources/funding-source-verification.html) resource article for more information on the micro-deposit method of bank account verification.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Funding` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`POST https://api.dwolla.com/funding-sources/{id}/micro-deposits`

### Request parameters

Parameter | Optional? | Description
----------|------------|-------------
amount1 | no | An amount JSON object of first micro-deposit. Contains `value` and `currency`.
amount2 | no | An amount JSON object of first micro-deposit. Contains `value` and `currency`.


### HTTP Status and Error Codes
| HTTP Status | Code | Description |
|--------------|-------------|-------------------|
| 200 | OK | Micro deposits verified  |
| 201 | Created | Micro deposits initiated |
| 202 | TryAgainLater | "Invalid wait time." |
| 400 | NotFound | Funding source not found. |
| 400 | ValidationError | InvalidAmount |
| 400 | ValidationError | "Wrong amount(s)." |
| 403 | InvalidResourceState | "Too many attempts." |
| 403 | InvalidResourceState | "Bank already verified." |
| 404 | NotFound | Micro deposits not initiated |
| 404 | NotFound | Funding source not found |
| 500 | Unknown | "Verify microdeposits returned an unknown error." |

#### Request and response (Initiate)

```raw
POST /funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909/micro-deposits
Authorization: Bearer 8tJjM7iTjujLthkbVPMUcHLqMNw4uv5kG712g9j1RRBHplGpwo
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Cache-Control: no-cache

HTTP/1.1 201 Created
Location: https://api.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909/micro-deposits
```
```ruby
funding_source_url = 'https://api-uat.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
account_token.post "#{funding_source_url}/micro-deposits"

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
DwollaSwagger::FundingsourcesApi.micro_deposits(funding_source_url)
```
```javascript
var fundingSourceUrl = 'https://api-uat.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909';

accountToken.post(`#{fundingSourceUrl}/micro-deposits`);
```
```python
funding_source_url = 'https://api-uat.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'

fs_api = dwollaswagger.FundingsourcesApi(client)

fs_api.micro_deposits(funding_source_url)
```
```php
<?php
$fundingSourceUrl = 'https://api-uat.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fsApi->micro_deposits($fundingSourceUrl);
?>
```

#### Request and response (Verify)

```raw
POST /funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909/micro-deposits
Authorization: Bearer 8tJjM7iTjujLthkbVPMUcHLqMNw4uv5kG712g9j1RRBHplGpwo
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json

{
    "amount1": {
        "value": "0.03",
        "currency": "USD"
    },
    "amount2": {
        "value": "0.09",
        "currency": "USD"
    }
}

HTTP 200 OK
```
```ruby
funding_source_url = 'https://api-uat.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'
request_body = {
  :amount1 => {
    :value => "0.03",
    :currency => "USD"
  },
  :amount2 => {
    :value => "0.09",
    :currency => "USD"
  }
}

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
account_token.post "#{funding_source_url}/micro-deposits", request_body

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
DwollaSwagger::FundingsourcesApi.micro_deposits(funding_source_url, body: request_body)
```
```javascript
var fundingSourceUrl = 'https://api-uat.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909';
var requestBody = {
  amount1: {
    value: '0.03',
    currency: 'USD'
  },
  amount2: {
    value: '0.09',
    currency: 'USD'
  }
};

accountToken.post(`${fundingSourceUrl}/micro-deposits`, requestBody);
```
```python
fs_api = dwollaswagger.FundingsourcesApi(client)

fs_api.micro_deposits(new_fs, body = {
    "amount1": {
        "value": "0.03",
        "currency": "USD"
    },
    "amount2": {
        "value": "0.09",
        "currency": "USD"
    }
})
```
```php
<?php
$fundingSourceUrl = 'https://api-uat.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fsApi->micro_deposits($fundingSourceUrl, [
  'amount1' => [
    'value' => '0.03',
    'currency' => 'USD'
  ],
  'amount2' => [
    'value' => '0.09',
    'currency' => 'USD'
  ]
]);
?>
```

## Verify pending micro-deposits exist

This section shows how to check if pending verification for micro-deposits exists.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Funding` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/funding-sources/{id}/micro-deposits`

### Request parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | id of funding source to check status of validation deposits.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 200 | Pending micro-deposits exist. |

### Request and response

```noselect
GET /funding-sources/ab9cd5de-9435-47af-96fb-8d2fa5db51e8
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "_links": {
    "self": {
      "href": "https://api-uat.dwolla.com/funding-sources/6c7de5af-e73e-45a9-946a-cdadec1ee0bb/micro-deposits"
    },
    "verify-micro-deposits": {
      "href": "https://api-uat.dwolla.com/funding-sources/6c7de5af-e73e-45a9-946a-cdadec1ee0bb/micro-deposits"
    }
  }
}
```

## Remove a funding source

Remove a funding source by id.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Funding` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`DELETE https://api.dwolla.com/funding-sources/{id}`

### Request parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | id of funding source to delete.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Funding source not found. |

### Request and response

```raw
DELETE /funding-sources/6c8ac833-444a-4eff-979c-c56cef6be26b
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

HTTP 200 OK
```
```ruby
funding_source_url = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
account_token.delete funding_source_url

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
DwollaSwagger::FundingsourcesApi.delete(funding_source_url)
```
```php
<?php
$fundingSourceUrl = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fsApi->delete($fundingSourceUrl);
?>
```
```python
funding_source_url = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

fs_api = dwollaswagger.FundingsourcesApi(client)
fs_api.delete(funding_source_url)
```
```javascript
var fundingSourceUrl = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';

accountToken.delete(fundingSourceUrl);
```
