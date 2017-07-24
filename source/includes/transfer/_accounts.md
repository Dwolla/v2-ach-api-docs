# Accounts

An `Account` represents a Dwolla account that was either established on dwolla.com, or created inline with the capture of the user account's permissions via Dwolla's OAuth flow. A user account grants authorization to an application via [OAuth](#oauth), which gives the application permission to interact with the API on their behalf.

### Verified and unverified Accounts

With a transfer of money, at least one party must complete the identity verification process through creation of a Transfer CIP Verified account, either the sender or the receiver. It’s your decision about which party completes this process, based on your business model, and you may want to have both parties complete the identity verification process. In cases where a Dwolla user `Account` is sending funds to or receiving funds from your `Account`, the `Account` can remain unverified because your account is already verified. However, if you need to transfer funds between your users, at least one of them will need to have a Transfer CIP Verified Dwolla account.

For more information on Transfer accounts, both Transfer CIP Verified and Dwolla Direct, reference the [account types](https://developers.dwolla.com/resources/account-types/transfer-accounts.html) resource article.

### Migrating Dwolla user Accounts to Access API Customers
Dwolla offers a seamless process for migrating existing user [Accounts](/transfers/#accounts) managed via OAuth on your platform to Access API [Customers](#customers). The user Account will maintain existing functionality on dwolla.com and will act as a separate Access API Customer upon completion of the migration. To learn more about upgrading to the Access API, please [contact Sales](https://www.dwolla.com/contact?b=apidocs).

### Account links
| Link | Description|
|------|------------|
| self | URL of the Account resource
| receive | Follow the link to create a transfer to this Account.
| funding-sources | GET this link to list the Accounts's funding sources.
| transfers | GET this link to list the Account's transfers
| customers | (optional) If this link exists, this account can create and manage Access API Customers.
| send | Follow the link to create a transfer to this Account.

## Retrieve account details

This section shows you how to retrieve account information belonging to the authorized user. The developer can pass either an `id` or the entire `location` resource to make this request.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token but does not require a particular scope.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/accounts/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Account unique identifier. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 403 | Not authorized to get an Account by id. |
| 404 | Account not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/accounts/07844b76-bfeb-4a81-87ec-adebc7fa6cfe
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

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
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
account_url = 'https://api-sandbox.dwolla.com/accounts/07844b76-bfeb-4a81-87ec-adebc7fa6cfe'

account = account_token.get account_url
account.name # => "Jane Doe"
```
```php
<?php
$accountUrl = 'https://api-sandbox.dwolla.com/accounts/07844b76-bfeb-4a81-87ec-adebc7fa6cfe';

$accountsApi = new DwollaSwagger\AccountsApi($apiClient);

$account = $accountsApi->id($accountUrl);
print($account->name); # => "Dwolla Sandbox"
?>
```
```python
account_url = 'https://api-sandbox.dwolla.com/accounts/07844b76-bfeb-4a81-87ec-adebc7fa6cfe'

account = account_token.get(account_url)
account.body['name']
```
```javascript
var accountUrl = 'https://api-sandbox.dwolla.com/accounts/07844b76-bfeb-4a81-87ec-adebc7fa6cfe';

accountToken
  .get(accountUrl)
  .then(res => res.body.name); // => 'Dwolla Sandbox'
```

## List funding sources for an account

Retrieve a list of funding sources that belong to an Account. By default, all funding sources are returned unless the `removed` querystring parameter is set to `false` in the request.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Funding` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/accounts/{id}/funding-sources`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Account's unique identifier. |
| removed | no | boolean | Filter removed funding sources. Defaults to `true`. Set to `false` to filter out removed funding sources from list (i.e. - /accounts/{id}/funding-sources?removed=false). |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 403 | Not authorized to list funding sources.
| 404 | Account not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/accounts/dcbb698d-bee7-4f79-8576-e4301bdc57fc/funding-sources
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/accounts/dcbb698d-bee7-4f79-8576-e4301bdc57fc/funding-sources",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "funding-source"
    }
  },
  "_embedded": {
    "funding-sources": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/118b08b9-e1eb-48b7-94ad-866989b0764e",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "funding-source"
          },
          "account": {
            "href": "https://api-sandbox.dwolla.com/accounts/dcbb698d-bee7-4f79-8576-e4301bdc57fc",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "account"
          }
        },
        "id": "118b08b9-e1eb-48b7-94ad-866989b0764e",
        "status": "verified",
        "type": "bank",
        "name": "First Midwestern Bank",
        "created": "2015-08-31T14:52:55.000Z",
        "removed": false,
        "channels": [
          "ach"
        ]
      },
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/297460a0-101b-498c-8184-2eb33ff22d34",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "funding-source"
          },
          "account": {
            "href": "https://api-sandbox.dwolla.com/accounts/dcbb698d-bee7-4f79-8576-e4301bdc57fc",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "account"
          },
          "with-available-balance": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/297460a0-101b-498c-8184-2eb33ff22d34",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "funding-source"
          },
          "balance": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/297460a0-101b-498c-8184-2eb33ff22d34/balance",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "balance"
          }
        },
        "id": "297460a0-101b-498c-8184-2eb33ff22d34",
        "status": "verified",
        "type": "balance",
        "name": "Balance",
        "created": "2015-08-31T14:52:55.000Z",
        "removed": false,
        "channels": []
      }
    ]
  }
}
```
```ruby
account_url = 'https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b'

funding_sources = account_token.get "#{account_url}/funding-sources"
funding_sources._embedded['funding-sources'][0].name # => "Jane Doe's Checking"
```
```php
<?php
$accountUrl = 'https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fundingSources = $fsApi->getAccountFundingSources($accountUrl);
$fundingSources->_embedded->{'funding-sources'}[0]->name); # => "Jane Doe’s Checking"
?>
```
```python
account_url = 'https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b'

funding_sources = account_token.get('%s/funding-sources' % account_url)
funding_sources.body['_embedded']['funding-sources'][0]
```
```javascript
var accountUrl = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b';

accountToken
  .get(`${accountUrl}/funding-sources`)
  .then(res => res.body._embedded['funding-sources'][0].name); // => 'ABC Bank Checking'
```

## List and search transfers for an account

This section covers how to retrieve an Account's list of transfers. Transaction search is supported by passing in optional querystring parameters such as: `search` which represents a term to search on, `startAmount`, `endAmount`, `startDate`, and `endDate`.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Transactions` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/accounts/{id}/transfers`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Account unique identifier to get transfers for. |
| search | no | string | A string to search on fields: `firstName`, `lastName`, `email`, `businessName`, and Account Id. (`/transfers?search=Doe`) |
| startAmount | no | string | Only include transactions with an amount equal to or greater than `startAmount`. Can optionally be used with `endAmount` to specify an amount range. |
| endAmount | no | string | Only include transactions with an amount equal to or less than `endAmount`. Can optionally be used with `startAmount` to specify an amount range. |
| startDate | no | string | Only include transactions created after this date. ISO-8601 format: `YYYY-MM-DD`. Can optionally be used with `endDate` to specify a date range. |
| endDate | no | string | Only include transactions created before than this date. ISO-8601 format: `YYYY-MM-DD`. Can optionally be used with `startDate` to specify a date range. |
| status | no | string | Filter results on transaction status. Possible values: `pending`, `processed`, `failed`, `reclaimed`, or `cancelled`. |
| limit | no | integer | Number of search results to return. Defaults to 25. |
| offset | no | integer | Number of search results to skip. Used for pagination. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Account not found. |

### Request and response

```raw
GET https://api.dwolla.com/accounts/a84222d5-31d2-4290-9a96-089813ef96b3/transfers
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/accounts/a84222d5-31d2-4290-9a96-089813ef96b3/transfers"
    },
    "first": {
      "href": "https://api-sandbox.dwolla.com/accounts/a84222d5-31d2-4290-9a96-089813ef96b3/transfers?limit=25&offset=0"
    },
    "last": {
      "href": "https://api-sandbox.dwolla.com/accounts/a84222d5-31d2-4290-9a96-089813ef96b3/transfers?limit=25&offset=0"
    }
  },
  "_embedded": {
    "transfers": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/transfers/DC68A3DC-3C61-E511-80DA-0AA34A9B2388"
          },
          "source": {
            "href": "https://api-sandbox.dwolla.com/accounts/CA32853C-48FA-40BE-AE75-77B37504581B"
          },
          "destination": {
            "href": "https://api-sandbox.dwolla.com/accounts/A84222D5-31D2-4290-9A96-089813EF96B3"
          }
        },
        "id": "DC68A3DC-3C61-E511-80DA-0AA34A9B2388",
        "status": "processed",
        "amount": {
          "value": "50.00",
          "currency": "USD"
        },
        "created": "2015-09-22T15:16:14.180Z"
      },
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/transfers/D36FD9AA-6E5C-E511-80DA-0AA34A9B2388"
          },
          "source": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/2BFF2631-4006-45D6-BBBD-A7BE4853E870"
          },
          "destination": {
            "href": "https://api-sandbox.dwolla.com/accounts/A84222D5-31D2-4290-9A96-089813EF96B3"
          }
        },
        "id": "D36FD9AA-6E5C-E511-80DA-0AA34A9B2388",
        "status": "processed",
        "amount": {
          "value": "5000.00",
          "currency": "USD"
        },
        "created": "2015-09-03T18:11:53.410Z"
      }
    ]
  },
  "total": 2
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
account_url = 'https://api-sandbox.dwolla.com/accounts/a84222d5-31d2-4290-9a96-089813ef96b3'

transfers = account_token.get "#{account_url}/transfers"
transfers._embedded.transfers[0].status # => "processed"
```
```php
<?php
$accountUrl = 'https://api-sandbox.dwolla.com/accounts/a84222d5-31d2-4290-9a96-089813ef96b3';

$transfersApi = new DwollaSwagger\TransfersApi($apiClient);

$transfers = $transfersApi->getAccountTransfers($accountUrl);
$transfers->_embedded->transfers[0]->status; # => "processed"
?>
```
```python
account_url = 'https://api-sandbox.dwolla.com/accounts/a84222d5-31d2-4290-9a96-089813ef96b3'

transfers = account_token.get('%s/transfers' % account_url)
transfers.body['_embedded']['transfers'][0]['status'] # => "processed"
```
```javascript
var accountUrl = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b';

accountToken
  .get(`${accountUrl}/transfers`)
  .then(res => res.body._embedded.transfers.[0].status); // => 'processed'
```

## List mass payments for an account

This section covers how to retrieve an Account's list of previously created mass payments. Mass payments are returned ordered by date created, with most recent mass payments appearing first.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Transactions` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/accounts/{id}/mass-payments`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Account unique identifier to get mass payments for. |
| limit | no | integer | How many results to return. Defaults to 25. |
| offset | no | integer | How many results to skip. |

### HTTP Status and Error Codes
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
        }
      }
    ]
  },
  "total": 1
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
account_url = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b'

mass_payments = account_token.get "#{account_url}/mass-payments", limit: 10
mass_payments._embedded['mass-payments'][0].status # => "complete"
```
```php
/**
 *  No example for this language yet. Coming soon.
 **/
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
account_url = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b'

transfers = account_token.get('%s/mass-payments' % account_url, limit = 10)
transfers.body['_embedded']['mass-payments'][0]['status'] # => "complete"
```
```javascript
var accountUrl = 'https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b';

accountToken
  .get(`${accountUrl}/mass-payments`)
  .then(res => res.body._embedded['mass-payments'][0].status); // => 'complete'
```
* * *
