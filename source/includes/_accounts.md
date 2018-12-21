# Accounts

An `Account` represents your Dwolla Master Account that was established on dwolla.com.

### Account links

| Link | Description|
|------|------------|
| self | URL of the Account resource |
| receive | Follow the link to create a transfer to this Account. |
| funding-sources | GET this link to list the Account's funding sources. |
| transfers | GET this link to list the Account's transfers. |
| customers | (optional) If this link exists, this account is authorized to create and manage Dwolla API Customers. |
| send | Follow the link to create a transfer to this Account. |

```noselect
{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
    },
    "receive": {
      "href": "https://api-sandbox.dwolla.com/transfers"
    },
    "funding-sources": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b/funding-sources"
    },
    "transfers": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b/transfers"
    },
    "customers": {
      "href": "https://api-sandbox.dwolla.com/customers"
    },
    "send": {
      "href": "https://api-sandbox.dwolla.com/transfers"
    }
  },
  "id": "ca32853c-48fa-40be-ae75-77b37504581b",
  "name": "Jane Doe"
}
```

## Retrieve account details

This section shows you how to retrieve basic account information belonging to the authorized Dwolla Master Account.

To retrieve your Account ID, you will need to call the [root](#root) of the API.

### HTTP request

`GET https://api.dwolla.com/accounts/{id}`

### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Account unique identifier. |

### HTTP status and error codes

| HTTP Status | Message |
|--------------|-------------|
| 403 | Not authorized to retrieve an Account by id. |
| 404 | Account not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
    },
    "receive": {
      "href": "https://api-sandbox.dwolla.com/transfers"
    },
    "funding-sources": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b/funding-sources"
    },
    "transfers": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b/transfers"
    },
    "customers": {
      "href": "https://api-sandbox.dwolla.com/customers"
    },
    "send": {
      "href": "https://api-sandbox.dwolla.com/transfers"
    }
  },
  "id": "ca32853c-48fa-40be-ae75-77b37504581b",
  "name": "Jane Doe"
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
account_url = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b'

account = app_token.get account_url
account.name # => "Jane Doe"
```
```php
<?php
$accountUrl = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b';

$accountsApi = new DwollaSwagger\AccountsApi($apiClient);

$account = $accountsApi->id($accountUrl);
print($account->name); # => "Jane Doe"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
account_url = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b'

account = app_token.get(account_url)
account.body['name']
```
```javascript
var accountUrl = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b';

appToken
  .get(accountUrl)
  .then(res => res.body.name); // => 'Jane Doe'
```

## Create a funding source for an account

This section details how to add a bank account to a Dwolla Master account. The bank account will have a status of `unverified` upon creation. Before a Dwolla Master account is eligible to transfer money from their bank or credit union account they need to verify ownership of the account via micro-deposit verification.

For more information on micro-deposit verification, reference the [funding source verification](https://developers.dwolla.com/resources/funding-source-verification.html) resource article.

### HTTP request

`POST https://api.dwolla.com/funding-sources`

### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| accountNumber | yes | string | The bank account number. |
| routingNumber | yes | string | The bank account's routing number. |
| bankAccountType | yes | string | Type of bank account: `checking` or `savings`. |
| name | yes | string | Arbitrary nickname for the funding source. |
| channels | no | array | An array containing a list of processing channels. ACH is the default processing channel for bank transfers. Acceptable value for channels is: "wire". e.g. `“channels”: [ “wire” ]`. A funding source (Bank Account) added using the wire channel only supports a funds transfer going to the bank account from a balance. **Note:** `channels` is a premium feature that must be enabled on your account and is only available to select [Dwolla](https://www.dwolla.com/platform) customers. |

### HTTP status and error codes

| HTTP Status | Message |
|--------------|-------------|
| 400 | Duplicate funding source or validation error.
| 403 | Not authorized to create funding source.


### Request and response

```raw
POST https://api-sandbox.dwolla.com/funding-sources
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
{
    "routingNumber": "222222226",
    "accountNumber": "123456789",
    "bankAccountType": "checking",
    "name": "My Bank"
}

...

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/funding-sources/04173e17-6398-4d36-a167-9d98c4b1f1c3
```
```php
<?php
$fundingApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fundingSource = $fundingApi->createFundingSource([
  "routingNumber" => "222222226",
  "accountNumber" => "123456789",
  "bankAccountType" => "checking",
  "name" => "My Bank"
]);
$fundingSource; # => "https://api-sandbox.dwolla.com/funding-sources/04173e17-6398-4d36-a167-9d98c4b1f1c3"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
request_body = {
  routingNumber: '222222226',
  accountNumber: '123456789',
  bankAccountType: 'checking',
  name: 'My Bank'
}

funding_source = app_token.post "funding-sources", request_body
funding_source.response_headers[:location] # => "https://api-sandbox.dwolla.com/funding-sources/04173e17-6398-4d36-a167-9d98c4b1f1c3"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
request_body = {
  'routingNumber': '222222226',
  'accountNumber': '123456789',
  'bankAccountType': 'checking',
  'name': 'My Bank'
}

funding_source = app_token.post('funding-sources', request_body)
funding_source.headers['location'] # => 'https://api-sandbox.dwolla.com/funding-sources/04173e17-6398-4d36-a167-9d98c4b1f1c3'
```
```javascript
var requestBody = {
  'routingNumber': '222222226',
  'accountNumber': '123456789',
  'bankAccountType': 'checking',
  'name': 'My Bank'
};

appToken
  .post(`funding-sources`, requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/funding-sources/04173e17-6398-4d36-a167-9d98c4b1f1c3'
```

## List funding sources for an account

Retrieve a list of funding sources that belong to an Account. By default, all funding sources are returned unless the `removed` querystring parameter is set to `false` in the request.

### HTTP request

`GET https://api.dwolla.com/accounts/{id}/funding-sources`

### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Account's unique identifier. |
| removed | no | boolean | Filter removed funding sources. Defaults to `true`. Set to `false` to filter out removed funding sources from list (i.e. - /accounts/{id}/funding-sources?removed=false). |

### HTTP status and error codes

| HTTP Status | Message |
|--------------|-------------|
| 403 | Not authorized to list funding sources.
| 404 | Account not found. |

### Request and response

```raw
GET https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b/funding-sources
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...
{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b/funding-sources",
            "resource-type": "funding-source"
        }
    },
    "_embedded": {
        "funding-sources": [
            {
                "_links": {
                    "self": {
                        "href": "https://api-sandbox.dwolla.com/funding-sources/04173e17-6398-4d36-a167-9d98c4b1f1c3",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "funding-source"
                    },
                    "account": {
                        "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "account"
                    }
                },
                "id": "04173e17-6398-4d36-a167-9d98c4b1f1c3",
                "status": "verified",
                "type": "bank",
                "bankAccountType": "checking",
                "name": "My Account - Checking",
                "created": "2017-09-25T20:03:41.000Z",
                "removed": false,
                "channels": [
                    "ach"
                ],
                "bankName": "First Midwestern Bank"
            },
            {
                "_links": {
                    "self": {
                        "href": "https://api-sandbox.dwolla.com/funding-sources/b268f6b9-db3b-4ecc-83a2-8823a53ec8b7",
                    },
                    "account": {
                        "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b",
                    },
                    "with-available-balance": {
                        "href": "https://api-sandbox.dwolla.com/funding-sources/b268f6b9-db3b-4ecc-83a2-8823a53ec8b7",
                    },
                    "balance": {
                        "href": "https://api-sandbox.dwolla.com/funding-sources/b268f6b9-db3b-4ecc-83a2-8823a53ec8b7/balance",
                    }
                },
                "id": "b268f6b9-db3b-4ecc-83a2-8823a53ec8b7",
                "status": "verified",
                "type": "balance",
                "name": "Balance",
                "created": "2017-08-22T18:21:51.000Z",
                "removed": false,
                "channels": []
            }
        ]
    }
}

```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
account_url = 'https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b'

funding_sources = app_token.get "#{account_url}/funding-sources"
funding_sources._embedded['funding-sources'][0].name # => "Jane Doe's Checking"
```
```php
<?php
$accountUrl = 'https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fundingSources = $fsApi->getAccountFundingSources($accountUrl);
$fundingSources->_embedded->{'funding-sources'}[0]->name; # => "Jane Doe’s Checking"
?>
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
account_url = 'https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b'

funding_sources = app_token.get('%s/funding-sources' % account_url)
funding_sources.body['_embedded']['funding-sources'][0]['name'] # => 'Jane Doe’s Checking'
```
```javascript
var accountUrl = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b';

appToken
  .get(`${accountUrl}/funding-sources`)
  .then(res => res.body._embedded['funding-sources'][0].name); // => 'ABC Bank Checking'
```

## List and search transfers for an account

This section covers how to retrieve an Account's list of transfers. Transaction search is supported by passing in optional query string parameters such as: `search` which represents a term to search on, `correlationId`, `startAmount`, `endAmount`, `startDate`, `endDate`, and `status`.

### HTTP request

`GET https://api.dwolla.com/accounts/{id}/transfers`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Account unique identifier to get transfers for. |
| search | no | string | A string to search on fields: `firstName`, `lastName`, `email`, `businessName`, Customer Id, and Account Id. (`/transfers?search=Doe`) |
| startAmount | no | string | Only include transactions with an amount equal to or greater than `startAmount`. Can optionally be used with `endAmount` to specify an amount range. |
| endAmount | no | string | Only include transactions with an amount equal to or less than `endAmount`. Can optionally be used with `startAmount` to specify an amount range. |
| startDate | no | string | Only include transactions created after this date. ISO-8601 format: `YYYY-MM-DD`. Can optionally be used with `endDate` to specify a date range. |
| endDate | no | string | Only include transactions created before than this date. ISO-8601 format: `YYYY-MM-DD`. Can optionally be used with `startDate` to specify a date range. |
| status | no | string | Filter results on transaction status. Possible values: `pending`, `processed`, `failed`, `reclaimed`, or `cancelled`. |
| correlationId | no | string | A string value to search on if a `correlationId` was specified on a transfer or mass payment item. |
| limit | no | integer | Number of search results to return. Defaults to 25. |
| offset | no | integer | Number of search results to skip. Used for pagination. |

### HTTP status and error codes
| HTTP Status | Message |
|--------------|-------------|
| 404 | Account not found. |

### Request and response

```raw
GET https://api.dwolla.com/accounts/62e88a41-f5d0-4a79-90b3-188cf11a3966/transfers
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/accounts/62e88a41-f5d0-4a79-90b3-188cf11a3966/transfers",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    },
    "first": {
      "href": "https://api-sandbox.dwolla.com/accounts/62e88a41-f5d0-4a79-90b3-188cf11a3966/transfers?&limit=25&offset=0",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    },
    "last": {
      "href": "https://api-sandbox.dwolla.com/accounts/62e88a41-f5d0-4a79-90b3-188cf11a3966/transfers?&limit=25&offset=0",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    }
  },
  "_embedded": {
    "transfers": [{
      "_links": {
        "cancel": {
          "href": "https://api-sandbox.dwolla.com/transfers/14c6bcce-46f7-e811-8112-e8dd3bececa8",
          "type": "application/vnd.dwolla.v1.hal+json",
          "resource-type": "transfer"
        },
        "source": {
          "href": "https://api-sandbox.dwolla.com/funding-sources/12a0eaf9-9561-468d-bdeb-186b536aa2ed",
          "type": "application/vnd.dwolla.v1.hal+json",
          "resource-type": "funding-source"
        },
        "self": {
          "href": "https://api-sandbox.dwolla.com/transfers/14c6bcce-46f7-e811-8112-e8dd3bececa8",
          "type": "application/vnd.dwolla.v1.hal+json",
          "resource-type": "transfer"
        },
        "funded-transfer": {
          "href": "https://api-sandbox.dwolla.com/transfers/15c6bcce-46f7-e811-8112-e8dd3bececa8",
          "type": "application/vnd.dwolla.v1.hal+json",
          "resource-type": "transfer"
        },
        "destination": {
          "href": "https://api-sandbox.dwolla.com/funding-sources/84c77e52-d1df-4a33-a444-51911a9623e9",
          "type": "application/vnd.dwolla.v1.hal+json",
          "resource-type": "account"
        }
      },
      "id": "14c6bcce-46f7-e811-8112-e8dd3bececa8",
      "status": "pending",
      "amount": {
        "value": "42.00",
        "currency": "USD"
      },
      "created": "2018-12-03T22:00:22.980Z",
      "clearing": {
        "source": "standard"
      },
      "individualAchId": "IDOWBKVE"
    }, {
      "_links": {
        "cancel": {
          "href": "https://api-sandbox.dwolla.com/transfers/15c6bcce-46f7-e811-8112-e8dd3bececa8",
          "type": "application/vnd.dwolla.v1.hal+json",
          "resource-type": "transfer"
        },
        "self": {
          "href": "https://api-sandbox.dwolla.com/transfers/15c6bcce-46f7-e811-8112-e8dd3bececa8",
          "type": "application/vnd.dwolla.v1.hal+json",
          "resource-type": "transfer"
        },
        "source": {
          "href": "https://api-sandbox.dwolla.com/accounts/62e88a41-f5d0-4a79-90b3-188cf11a3966",
          "type": "application/vnd.dwolla.v1.hal+json",
          "resource-type": "account"
        },
        "source-funding-source": {
          "href": "https://api-sandbox.dwolla.com/funding-sources/12a0eaf9-9561-468d-bdeb-186b536aa2ed",
          "type": "application/vnd.dwolla.v1.hal+json",
          "resource-type": "funding-source"
        },
        "funding-transfer": {
          "href": "https://api-sandbox.dwolla.com/transfers/14c6bcce-46f7-e811-8112-e8dd3bececa8",
          "type": "application/vnd.dwolla.v1.hal+json",
          "resource-type": "transfer"
        },
        "destination": {
          "href": "https://api-sandbox.dwolla.com/customers/d295106b-ca20-41ad-9774-286e34fd3c2d",
          "type": "application/vnd.dwolla.v1.hal+json",
          "resource-type": "customer"
        },
        "destination-funding-source": {
          "href": "https://api-sandbox.dwolla.com/funding-sources/500f8e0e-dfd5-431b-83e0-cd6632e63fcb",
          "type": "application/vnd.dwolla.v1.hal+json",
          "resource-type": "funding-source"
        }
      },
      "id": "15c6bcce-46f7-e811-8112-e8dd3bececa8",
      "status": "pending",
      "amount": {
        "value": "42.00",
        "currency": "USD"
      },
      "created": "2018-12-03T22:00:22.970Z",
      "clearing": {
        "source": "standard"
      }
    }]
  },
  "total": 2
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
account_url = 'https://api-sandbox.dwolla.com/accounts/62e88a41-f5d0-4a79-90b3-188cf11a3966'

transfers = app_token.get "#{account_url}/transfers"
transfers._embedded['transfers'][0].status # => "processed"
```
```php
<?php
$accountUrl = 'https://api-sandbox.dwolla.com/accounts/62e88a41-f5d0-4a79-90b3-188cf11a3966';

$transfersApi = new DwollaSwagger\TransfersApi($apiClient);

$transfers = $transfersApi->getAccountTransfers($accountUrl);
$transfers->_embedded->{'transfers'}[0]->status; # => "processed"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
account_url = 'https://api-sandbox.dwolla.com/accounts/62e88a41-f5d0-4a79-90b3-188cf11a3966'

transfers = app_token.get('%s/transfers' % account_url)
transfers.body['_embedded']['transfers'][0]['status'] # => "processed"
```
```javascript
var accountUrl = 'https://api-sandbox.dwolla.com/accounts/62e88a41-f5d0-4a79-90b3-188cf11a3966';

appToken
  .get(`${accountUrl}/transfers`)
  .then(res => res.body._embedded['transfers'][0].status); // => 'processed'
```

## List mass payments for an account

This section covers how to retrieve an Account's list of previously created mass payments. Mass payments are returned ordered by date created, with most recent mass payments appearing first.

### HTTP request

`GET https://api.dwolla.com/accounts/{id}/mass-payments`

### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Account unique identifier to get mass payments for. |
| limit | no | integer | How many results to return. Defaults to 25. |
| offset | no | integer | How many results to skip. |
| correlationId | no | string | A string value to search on if a correlationId was specified on a mass payment. |

### HTTP status and error codes

| HTTP Status | Code | Description |
|--------------|-------------|------------------------|
| 403 | NotAuthorized | Not authorized to list mass payments. |
| 404 | NotFound | Account not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b/mass-payments
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

....

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b/mass-payments"
    },
    "first": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b/mass-payments?limit=25&offset=0"
    },
    "last": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b/mass-payments?limit=25&offset=0"
    }
  },
  "_embedded": {
    "mass-payments": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/mass-payments/b4b5a699-5278-4727-9f81-a50800ea9abc"
          },
          "source": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/84c77e52-d1df-4a33-a444-51911a9623e9"
          },
          "items": {
            "href": "https://api-sandbox.dwolla.com/mass-payments/b4b5a699-5278-4727-9f81-a50800ea9abc/items"
          }
        },
        "id": "b4b5a699-5278-4727-9f81-a50800ea9abc",
        "status": "complete",
        "created": "2015-09-03T14:14:10.000Z",
        "metadata": {
          "UserJobId": "some ID"
        },
        "correlationId": "8a2cdc8d-629d-4a24-98ac-40b735229fe2"
      }
    ]
  },
  "total": 1
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
account_url = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b'

mass_payments = account_token.get "#{account_url}/mass-payments", limit: 10
mass_payments._embedded['mass-payments'][0].status # => "complete"
```
```php
<?php
$accountUrl = 'https://api-sandbox.dwolla.com/accounts/a84222d5-31d2-4290-9a96-089813ef96b3';

$masspaymentsApi = new DwollaSwagger\MasspaymentsApi($apiClient);

$masspayments = $masspaymentsApi->getByAccount($accountUrl, 10, 0);
$masspayments->_embedded->{'mass-payments'}[0]->status; # => "complete"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
account_url = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b'

transfers = app_token.get('%s/mass-payments' % account_url, limit = 10)
transfers.body['_embedded']['mass-payments'][0]['status'] # => "complete"
```
```javascript
var accountUrl = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b';

appToken
  .get(`${accountUrl}/mass-payments`)
  .then(res => res.body._embedded['mass-payments'][0].status); // => 'complete'
```
* * *
