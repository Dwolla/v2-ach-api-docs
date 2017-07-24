# Funding sources

Add and retrieve ACH bank account information via funding sources.  Customers can have a maximum of 6 funding sources. Funding sources can be created for both the [Accounts](#create-a-funding-source-for-an-account) and [Customers](#create-a-funding-source-for-a-customer) resources.

### Funding source resource

Parameter | Description
----------|------------
id | The funding source unique identifier.
status | A status of either `unverified` or `verified` specifying if the funding source has completed verification.
type | Type of funding source. Either `bank` or `balance`.
name | Customer’s arbitrary nickname for the funding source.
created | ISO-8601 timestamp.
removed | A value of `true` if the funding source has been [removed](#remove-a-funding-source) or `false` if the funding source is not removed.
channels | An array containing a list of processing channels.  ACH is the default processing channel for bank transfers. Can be either `ach` or `wire`.
bankName | The financial institution name.

```noselect
{
    "routingNumber": "222222226",
    "accountNumber": "123456789",
    "type": "checking",
    "name": "My Bank"
}
```

## Retrieve a funding source

This section covers how to retrieve a funding source by id.

### HTTP request
`GET https://api.dwolla.com/funding-sources/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | id of funding source to retrieve. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Funding source not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c"
    },
    "customer": {
      "href": "https://api-sandbox.dwolla.com/customers/36e9dcb2-889b-4873-8e52-0c9404ea002a"
    },
    "initiate-micro-deposits": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c/micro-deposits"
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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

funding_source = app_token.get funding_source_url
funding_source.name # => "Test checking account"
```
```php
<?php
$fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fundingSource = $fsApi->id($fundingSourceUrl);
$fundingSource->name; # => "Test checking account"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

funding_source = app_token.get(funding_source_url)
funding_source.body['name'] # => 'Test checking account'
```
```javascript
var fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';

appToken
  .get(fundingSourceUrl)
  .then(res => res.body.name); // => "Test checking account"
```

## Update a funding source

This section covers how to update a `bank` funding source. The `accountNumber`, `routingNumber`, and `name` are all optional attributes that can be updated on a funding source when it has an `unverified` status. You can choose to update only name, name and routingNumber, name and accountNumber, or all three attributes. Any attribute that isn't updated remains the same as it was prior to update, including the funding source id. The `name` attribute can be updated when a funding source has either an `unverified` or `verified` status.

### HTTP request
`POST https://api.dwolla.com/funding-sources/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | id of funding source to update. |
| name | no | string | Arbitrary nickname for the funding source. Must be 50 characters or less. |
| routingNumber | no | string | The bank account's routing number. |
| accountNumber | no | string | The bank account number. |

### HTTP Status and Error Codes
| HTTP Status | Code | Description |
|--------------|-------------|-------------------|
| 404 | NotFound | Funding source not found. |
| 400 | ValidationError | Only funding sources of type="bank" can be updated. |
| 400 | ValidationError | Invalid bank name. |
| 403 | InvalidResourceState | A removed bank cannot be updated. |

### Request and response

```raw
POST https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "name": "Test Checking - 1234"
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'
request_body = {
      "name" => "Test Checking - 1234",
}

funding_source = app_token.post "#{funding_source_url}", request_body
funding_source.name # => "Test Checking - 1234"
```
```php
/**
 *  No example for this language yet. Coming soon.
 **/
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'
request_body = {
  "name": "Test Checking - 1234"
}

funding_source = app_token.post('funding-sources', request_body)
funding_source.body['name'] # => 'Test Checking - 1234'
```
```javascript
var fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';
var requestBody = {
  name: "Test Checking - 1234"
};

appToken
  .post(fundingSourceUrl, requestBody)
  .then(res => res.body.name); // => "Test Checking - 1234"
```

## Retrieve a funding source balance

This section covers how to retrieve the `balance` of a funding source. The funding source can be either of type `balance` or `bank`.

### HTTP request
`GET https://api.dwolla.com/funding-sources/{id}/balance`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | id of funding source to retrieve a balance for. |

### HTTP Status and Error Codes
| HTTP Status | Code | Description |
|--------------|-------------|-------------------|
| 404 | NotFound | Funding source not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/funding-sources/c2eb3f03-1b0e-4d18-a4a2-e552cc111418/balance
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/c2eb3f03-1b0e-4d18-a4a2-e552cc111418/balance",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "balance"
    },
    "funding-source": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/c2eb3f03-1b0e-4d18-a4a2-e552cc111418",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "funding-source"
    }
  },
  "balance": {
    "value": "4616.87",
    "currency": "USD"
  },
  "lastUpdated": "2017-04-18T15:20:25.880Z"
}
```
```ruby
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/c2eb3f03-1b0e-4d18-a4a2-e552cc111418'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
funding_source = app_token.get "#{funding_source_url}/balance"
```
```php
<?php
$fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/c2eb3f03-1b0e-4d18-a4a2-e552cc111418';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fundingSource = $fsApi->getBalance($fundingSourceUrl);
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/c2eb3f03-1b0e-4d18-a4a2-e552cc111418'

funding_source = app_token.get('%s/balance' % funding_source_url)
```
```javascript
var fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/c2eb3f03-1b0e-4d18-a4a2-e552cc111418';

appToken
  .get(`${fundingSourceUrl}/balance`)
  .then(res => res.body.balance.amount);
```

## Initiate micro-deposits

This section covers how to initiate micro-deposits for bank verification. Reference the [funding source verification](https://developers.dwolla.com/resources/funding-source-verification.html) resource article for more information on the micro-deposit method of bank account verification.

### HTTP request
`POST https://api.dwolla.com/funding-sources/{id}/micro-deposits`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | id of funding source to initiate micro-deposits to. |


### HTTP Status and Error Codes
| HTTP Status | Code | Description |
|--------------|-------------|-------------------|
| 201 | Created | Micro deposits initiated |
| 404 | NotFound | Funding source not found |

#### Request and response

```raw
POST https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909/micro-deposits
Authorization: Bearer 8tJjM7iTjujLthkbVPMUcHLqMNw4uv5kG712g9j1RRBHplGpwo
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909/micro-deposits
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'

app_token.post "#{funding_source_url}/micro-deposits"
```
```javascript
var fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909';

appToken.post(`#{fundingSourceUrl}/micro-deposits`);
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'

app_token.post('%s/micro-deposits' % funding_source_url)
```
```php
<?php
$fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fsApi->microDeposits(null, $fundingSourceUrl);
?>
```

## Verify micro-deposits

This section covers how to verify micro-deposits for bank verification. Reference the [funding source verification](https://developers.dwolla.com/resources/funding-source-verification.html) resource article for more information on the micro-deposit method of bank account verification.

### HTTP request
`POST https://api.dwolla.com/funding-sources/{id}/micro-deposits`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | id of funding source to verify micro-deposits on. |
| amount1 | yes | string | An amount JSON object of first micro-deposit. Contains `value` and `currency`. |
| amount2 | yes | string | An amount JSON object of second micro-deposit. Contains `value` and `currency`. |


### HTTP Status and Error Codes
| HTTP Status | Code | Description |
|--------------|-------------|-------------------|
| 200 | OK | Micro deposits verified  |
| 202 | TryAgainLater | "Invalid wait time." |
| 400 | ValidationError | InvalidAmount |
| 400 | ValidationError | "Wrong amount(s)." |
| 403 | InvalidResourceState | "Too many attempts." |
| 403 | InvalidResourceState | "Bank already verified." |
| 404 | NotFound | Micro deposits not initiated |
| 404 | NotFound | Funding source not found |
| 500 | Unknown | "Verify microdeposits returned an unknown error." |

#### Request and response

```raw
POST https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909/micro-deposits
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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'
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

app_token.post "#{funding_source_url}/micro-deposits", request_body
```
```javascript
var fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909';
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

appToken.post(`${fundingSourceUrl}/micro-deposits`, requestBody);
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'
request_body = {
    "amount1": {
        "value": "0.03",
        "currency": "USD"
    },
    "amount2": {
        "value": "0.09",
        "currency": "USD"
    }
}

app_token.post('%s/micro-deposits' % funding_source_url, request_body)
```
```php
<?php
$fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fsApi->microDeposits([
  'amount1' => [
    'value' => '0.03',
    'currency' => 'USD'
  ],
  'amount2' => [
    'value' => '0.09',
    'currency' => 'USD'
  ]],
  $fundingSourceUrl
);
?>
```

## Retrieve micro-deposits details

This section shows how to retrieve the status of micro-deposits and check if micro-deposits are eligible for verification. If the status of micro-deposits is `failed`, a `failure` object will be returned in the response body which includes the ACH return code and description.

### HTTP request
`GET https://api.dwolla.com/funding-sources/{id}/micro-deposits`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | no | string | id of funding source to check status of validation deposits. |

### HTTP Status and Error Codes
| HTTP Status | Code | Description
|--------------|-------------|-----------|
| 200 | Ok | Pending micro-deposits exist. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/funding-sources/dfe59fdd-7467-44cf-a339-2020dab5e98a/micro-deposits
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/dfe59fdd-7467-44cf-a339-2020dab5e98a/micro-deposits",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "micro-deposits"
    },
    "verify-micro-deposits": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/dfe59fdd-7467-44cf-a339-2020dab5e98a/micro-deposits",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "micro-deposits"
    }
  },
  "created": "2016-12-30T20:56:53.000Z",
  "status": "failed",
  "failure": {
    "code": "R03",
    "description": "No Account/Unable to Locate Account"
  }
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

funding_source = app_token.get "#{funding_source_url}/micro-deposits"
funding_source.status # => "failed"
```
```php
<?php
$fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fundingSource = $fsApi->verifyMicroDepositsExist($fundingSourceUrl);
$fundingSource->status; # => "failed"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

funding_source = app_token.get('%s/micro-deposits' % funding_source_url)
funding_source.body['status'] # => 'failed'
```
```javascript
var fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';

appToken
  .get(`${fundingSourceUrl}/micro-deposits`)
  .then(res => res.body.status); // => "failed"
```

## Remove a funding source

Remove a funding source by id. A removed funding source is soft deleted and can still be accessed when retrieved.

### HTTP request

`POST https://api.dwolla.com/funding-sources/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | id of funding source to delete. |
| removed | yes | Specify a value of `true` to remove the associated funding source. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Funding source not found. |

### Request and response

```raw
POST https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
{
    "removed": true
}

...

HTTP 200 OK
{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c",
      "type": "funding-source"
    }
  },
  "id": "692486f8-29f6-4516-a6a5-c69fd2ce854c",
  "status": "verified",
  "type": "bank",
  "name": "Test bank account",
  "created": "2016-06-08T21:37:30.000Z",
  "removed": true
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

request_body = {
  :removed => true
}

app_token.post "#{funding_source_url}", request_body
```
```php
<?php
$fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fsApi->softDelete(['removed' => true ], $fundingSourceUrl);
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'
request_body = {
  "removed": true
}

funding_source = app_token.post('funding-sources', request_body)
```
```javascript
var fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';
var requestBody = {
  removed: true
};

appToken.post(fundingSourceUrl, requestBody);
```
* * *
