# Transfers

A transfer represents money being transferred from a `source` to a `destination`.

### Transfer resource

| Parameter | Description
|-----------|------------|
|id | Transfer unique identifier
|status | Either `processed`, `pending`, `cancelled`, `failed`, or `reclaimed`
|amount| An amount JSON object. See below
|created | ISO-8601 timestamp
|metadata | A metadata JSON object

```noselect
{
  "_links": {},
  "_embedded": {},
  "id": "string",
  "status": "string",
  "amount": {
    "value": "string",
    "currency": "string"
  },
  "created": "2015-10-02T19:48:40.485Z",
  "metadata": {}
}
```

### Amount JSON object

| Parameter | Description
|-----------|------------|
|value | Amount of money
|currency | String, `USD`

## Initiate a transfer

This section covers how to initiate a transfer from a Dwolla [Account](#accounts) resource.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Send` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`POST https://api.dwolla.com/transfers`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| _links | yes | object | A _links JSON object describing the desired `source` and `destination` of a transfer. [See below](#source-and-destination-types) for possible values for `source` and `destination`. |
| amount | yes | object | An amount JSON object. [See above](#amount-json-object). |
| metadata | no | object | A metadata JSON object with a maximum of 10 key-value pairs (each key and value must be less than 255 characters). |
| fees | no | array | an array of fee JSON objects that contain unique fee transfers. [See below](#a-fee-json-object). |

### Source and destination types

| Source Type | URI | Description
-------|---------|---------------
Funding source | `https://api.dwolla.com/funding-sources/{id}` | A bank or balance funding source.

| Destination Type | URI | Description
-------|---------|---------------
Account | `https://api.dwolla.com/accounts/{id}` | Destination Account of a transfer.
Email | `mailto:johndoe@email.com` | Email address of existing Dwolla Account or recipient (recipient will create a Dwolla Account to claim funds)
Funding source | `https://api.dwolla.com/funding-sources/{id}` | Destination of an Account's own bank or balance funding source.

### Facilitator fee
The facilitator fee is a feature allowing for a flat rate amount to be removed from a payment as a fee, and sent to the creator of the Dwolla application. The fee does not affect the original payment amount, and exists as a separate [Transfer resource](#transfer-resource) with a unique transfer ID. Within a transfer request you can specify an optional `fees` request parameter, which is an array of [fee objects](#a-fee-json-object) that can represent many unique fee transfers.

For more information on collecting fees on payments, reference the [facilitator fee](https://developers.dwolla.com/resources/facilitator-fee.html) resource article.

#### A fee JSON object

| Parameter | Description
|-----------|------------|
|_links | Contains a `charge-to` JSON object with a link to the associated source or destination `Account` resource.
|amount | Amount of fee to charge. An amount JSON object. [See above](#amount-json-object)

#### Fee object example:
```noselect
{  
   "_links":{  
      "charge-to":{  
         "href":"https://api-sandbox.dwolla.com/accounts/d795f696-2cac-4662-8f16-95f1db9bddd8"
      }
   },
   "amount":{  
      "value":"4.00",
      "currency":"USD"
   }
}
```

### HTTP Status and Error Codes
| HTTP Status | Message |
|--------------|-------------|
| 400 | Transfer failed. |
| 403 | OAuth token does not have Send scope. |

### Request and response
```raw
POST https://api.dwolla.com/transfers
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
Idempotency-Key: 19051a62-3403-11e6-ac61-9e71128cae77

{
    "_links": {
        "source": {
            "href": "https://api.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
        },
        "destination": {
            "href": "https://api.dwolla.com/accounts/07D59716-EF22-4FE6-98E8-F3190233DFB8"
        }
    },
    "amount": {
        "currency": "USD",
        "value": "10.00"
    }
}

...

HTTP/1.1 201 Created
Location: https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
request_body = {
  :_links => {
    :source => {
      :href => "https://api.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
    },
    :destination => {
      :href => "https://api.dwolla.com/accounts/07D59716-EF22-4FE6-98E8-F3190233DFB8"
    }
  },
  :amount => {
    :currency => "USD",
    :value => "1.00"
  }
}

transfer = account_token.post "transfers", request_body
transfer.headers[:location] # => "https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388"
```
```php
<?php
$transfersApi = new DwollaSwagger\TransfersApi($apiClient);

$transfer = $transfersApi->create([
  '_links' => [
    'source' => [
      'href' => 'https://api.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4',
    ],
    'destination' => [
      'href' => 'https://api.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8'
    ]
  ],
  'amount' => [
    'currency' => 'USD',
    'value' => '1.00'
  ]
]);
$transfer; # => "https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
request_body = {
  '_links': {
    'source': {
      'href': 'https://api.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4'
    },
    'destination': {
      'href': 'https://api.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8'
    }
  },
  'amount': {
    'currency': 'USD',
    'value': '1.00'
  }
}

transfer = account_token.post('transfers', request_body)
transfer.headers['location'] # => 'https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388'
```
```javascript
var requestBody = {
  _links: {
    source: {
      href: 'https://api.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4'
    },
    destination: {
      href: 'https://api.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8'
    }
  },
  amount: {
    currency: 'USD',
    value: '1.00'
  }
};

accountToken
  .post('transfers', requestBody)
  .then(res => res.headers.get('location')); // => 'https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388'
```

## Retrieve a transfer

This section covers how to retrieve a transfer belonging to an Account by its id.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Transactions` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/transfers/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | The id of the transfer to be retrieved. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Transfer not found. |

### Request and response

```raw
GET https://api.dwolla.com/transfers/4C8AD8B8-3D69-E511-80DB-0AA34A9B2388
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/transfers/4C8AD8B8-3D69-E511-80DB-0AA34A9B2388"
    },
    "source": {
      "href": "https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
    },
    "destination": {
      "href": "https://api.dwolla.com/customers/01B47CB2-52AC-42A7-926C-6F1F50B1F271"
    }
  },
  "id": "4C8AD8B8-3D69-E511-80DB-0AA34A9B2388",
  "status": "pending",
  "amount": {
    "value": "225.00",
    "currency": "USD"
  },
  "created": "2015-10-02T19:42:32.950Z",
  "metadata": {
    "foo": "bar",
    "baz": "foo"
  }
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
transfer_url = 'https://api.dwolla.com/transfers/4C8AD8B8-3D69-E511-80DB-0AA34A9B2388'

transfer = account_token.get transfer_url
transfer.status # => "pending"
```
```php
<?php
$transferUrl = 'https://api.dwolla.com/transfers/4C8AD8B8-3D69-E511-80DB-0AA34A9B2388';

$transfersApi = new DwollaSwagger\TransfersApi($apiClient);

$transfer = $transfersApi->byId($transferUrl);
$transfer->status; # => "pending"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
transfer_url = 'https://api.dwolla.com/transfers/4C8AD8B8-3D69-E511-80DB-0AA34A9B2388'

fees = account_token.get(transfer_url)
fees.body['status'] # => 'pending'
```
```javascript
var transferUrl = 'https://api.dwolla.com/transfers/4C8AD8B8-3D69-E511-80DB-0AA34A9B2388';

accountToken
  .get(transferUrl)
  .then(res => res.body.status); // => 'pending'
```
## List fees for a transfer

This section outlines how to retrieve fees charged on a created transfer. Fees are visible to the `Account` that is charged the fee, as well as the Dwolla `Account` that is involved in receiving the fee.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Transactions` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/transfers/{id}/fees`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | The id of the transfer to retrieve fees for. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Transfer not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388/fees
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "transactions": [
    {
      "_links": {
        "self": {
          "href": "https://api-sandbox.dwolla.com/transfers/416a2857-c887-4cca-bd02-8c3f75c4bb0e"
        },
        "source": {
          "href": "https://api-sandbox.dwolla.com/customers/b442c936-1f87-465d-a4e2-a982164b26bd"
        },
        "destination": {
          "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
        },
        "created-from-transfer": {
          "href": "https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388"
        }
      },
      "id": "416a2857-c887-4cca-bd02-8c3f75c4bb0e",
      "status": "pending",
      "amount": {
        "value": "2.00",
        "currency": "usd"
      },
      "created": "2016-02-22T20:46:38.777Z"
    },
    {
      "_links": {
        "self": {
          "href": "https://api-sandbox.dwolla.com/transfers/e58ae1f1-7007-47d3-a308-7e9aa6266d53"
        },
        "source": {
          "href": "https://api-sandbox.dwolla.com/customers/b442c936-1f87-465d-a4e2-a982164b26bd"
        },
        "destination": {
          "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
        },
        "created-from-transfer": {
          "href": "https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388"
        }
      },
      "id": "e58ae1f1-7007-47d3-a308-7e9aa6266d53",
      "status": "pending",
      "amount": {
        "value": "1.00",
        "currency": "usd"
      },
      "created": "2016-02-22T20:46:38.860Z"
    }
  ],
  "total": 2
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
transfer_url = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388'

fees = account_token.get "#{transfer_url}/fees"
fees.total # => 2
```
```php
/**
 *  No example for this language yet.
 **/
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
transfer_url = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388'

fees = account_token.get('%s/fees' % transfer_url)
fees.body['total'] # => 2
```
```javascript
var transferUrl = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388';

accountToken
  .get(`${transferUrl}/fees`)
  .then(res => res.body.total); // => 2
```

## Retrieve a transfer failure reason

When a bank transfer fails for an Account, Dwolla returns a `failure` link when [retrieving the transfer by its Id](#retrieve-a-transfer). This failure link is used to retrieve the ACH return code and description. For reference, the list of possible failure codes and descriptions are shown in the [Transfer failures](https://developers.dwolla.com/resources/bank-transfer-workflow/transfer-failures.html) resource article.

**Note:** If a transfer fails to/from a bank account then the `bank` will automatically be removed from the Dwolla system for all ACH return codes except an `R01`.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Transactions` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP Request
`GET https://api.dwolla.com/transfers/{id}/failure`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Transfer unique identifier. |

### Request and Response

```raw
GET https://api-sandbox.dwolla.com/transfers/e6d9a950-ac9e-e511-80dc-0aa34a9b2388/failure
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/transfers/E6D9A950-AC9E-E511-80DC-0AA34A9B2388/failure"
    }
  },
  "code": "R1",
  "description": "Insufficient Funds"
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
transfer_url = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388'

failure = account_token.get "#{transfer_url}/failure"
failure.code # => "R1"
```
```php
/**
 *  No example for this language yet.
 **/
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
transfer_url = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388'

failure = account_token.get('%s/failure' % transfer_url)
failure.body['code'] # => 'R1'
```
```javascript
var transferUrl = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388';

accountToken
  .get(`${transferUrl}/failure`)
  .then(res => res.body.code); // => 'R1'
```

## Cancel a transfer

When a bank transfer is eligible for cancellation, Dwolla returns a `cancel` link  when [getting the transfer by Id](#retrieve-a-transfer). This cancel link is used to trigger the cancellation, preventing the bank transfer from processing further. A bank transfer is cancellable up until 4pm CT on that same business day if the transfer was initiated prior to 4PM CT. If a transfer was initiated after 4pm CT, it can be cancelled anytime before 4pm CT on the following business day.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Transactions` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP Request
`POST https://api.dwolla.com/transfers/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| status | yes | string | Possible value: `cancelled`. |

### Request and Response

```noselect
POST https://api-sandbox.dwolla.com/transfers/3d48c13a-0fc6-e511-80de-0aa34a9b2388
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
    "status": "cancelled"
}

...

{
  "_links": {
    "cancel": {
      "href": "https://api-sandbox.dwolla.com/transfers/3d48c13a-0fc6-e511-80de-0aa34a9b2388"
    },
    "source": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
    },
    "funding-transfer": {
      "href": "https://api-sandbox.dwolla.com/transfers/3c48c13a-0fc6-e511-80de-0aa34a9b2388"
    },
    "self": {
      "href": "https://api-sandbox.dwolla.com/transfers/3d48c13a-0fc6-e511-80de-0aa34a9b2388"
    },
    "destination": {
      "href": "https://api-sandbox.dwolla.com/customers/05e267e5-c13d-491a-93a8-da52b721f123"
    }
  },
  "id": "3d48c13a-0fc6-e511-80de-0aa34a9b2388",
  "status": "cancelled",
  "amount": {
    "value": "22.00",
    "currency": "usd"
  },
  "created": "2016-01-28T22:34:02.663Z",
  "metadata": {
    "foo": "bar",
    "baz": "boo"
  }
}
```
* * *
