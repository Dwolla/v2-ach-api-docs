# Transfers

A transfer represents money being transferred from a `source` to a `destination`. Transfers are available for the `Customer` and `Account` resources.

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

## Initiate transfer

This section covers how to initiate a transfer for either an [Account](#accounts) or [Customer](#customers) resource.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth access token with the `Send` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`POST https://api.dwolla.com/transfers`

### Request parameters

Parameter | Optional? | Description
----------|------------|-------------
_links | no | A _links JSON object describing the desired `source` and `destination` of a transfer. [See below](#source-and-destination-types) for possible values for `source` and `destination`.
amount | no | An amount JSON object. [See above](#amount-json-object)
metadata | yes | A metadata JSON object with a maximum of 10 key-value pairs (each key and value must be less than 255 characters).
fees | yes | an array of fee JSON objects that contain unique fee transfers. [See below](#a-fee-json-object)

### Source and destination types

| Source Type | URI | Description
-------|---------|---------------
Funding source | `https://api.dwolla.com/funding-sources/{id}` | A bank or balance funding source.

| Destination Type | URI | Description
-------|---------|---------------
Account | `https://api.dwolla.com/accounts/{id}` | Destination Account of a transfer.
Customer | `https://api.dwolla.com/customers/{id}` | Destination Customer of a transfer.
Email | `mailto:johndoe@email.com` | Email address of existing Dwolla Account or recipient (recipient will create a Dwolla Account to claim funds)
Funding source | `https://api.dwolla.com/funding-sources/{id}` | Destination of an Account or verified Customer's own bank or balance funding source. **OR** A Customer's bank funding source.

### Facilitator fee
The facilitator fee is a feature allowing for a flat rate amount to be removed from a payment as a fee, and sent to the creator of the Dwolla application. The fee does not affect the original payment amount, and exists as a separate [Transfer resource](#transfer-resource) with a unique transfer ID. Within a transfer request you can specify an optional `fees` request parameter, which is an array of [fee objects](#a-fee-json-object) that can represent many unique fee transfers.

For more information on collecting fees on payments, reference the [facilitator fee](https://developers.dwolla.com/resources/facilitator-fee.html) resource article.

#### A fee JSON object

| Parameter | Description
|-----------|------------|
|_links | Contains a `charge-to` JSON object with a link to the associated source or destination `Customer` or `Account` resource.
|amount | Amount of fee to charge. An amount JSON object. [See above](#amount-json-object)

#### Fee object example:
```noselect
{  
   "_links":{  
      "charge-to":{  
         "href":"https://api-uat.dwolla.com/customers/d795f696-2cac-4662-8f16-95f1db9bddd8"
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

### Request and response (transfer from Account to Customer)

```raw
POST /transfers
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
{
    "_links": {
        "destination": {
            "href": "https://api.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8"
        },
        "source": {
            "href": "https://api.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
        }
    },
    "amount": {
        "currency": "USD",
        "value": "10.00"
    },
    "metadata": {
        "foo": "bar",
        "baz": "boo"
    },
   "fees":[  
      {  
         "_links":{  
            "charge-to":{  
               "href":"http://api-uat.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8"
            }
         },
         "amount":{  
            "value":"1.00",
            "currency":"USD"
         }
      }
   ]
}

...

HTTP/1.1 201 Created
Location: https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388
```
```ruby
request_body = {
  :_links => {
    :destination => {
      :href => "https://api.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8"
    },
    :source => {
      :href => "https://api.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
    }
  },
  :amount => {
    :currency => "USD",
    :value => "1.00"
  },
  :metadata => {
    :foo => "bar",
    :baz => "boo"
  }
}

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
transfer = account_token.post "transfers", request_body
transfer.headers[:location] # => "https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388"

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
transfer = DwollaSwagger::TransfersApi.create(:body => request_body)
transfer # => "https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388"
```
```php
<?php
$transfersApi = new DwollaSwagger\TransfersApi($apiClient);

$transfer = $transfersApi->create([
  '_links' => [
    'destination' => [
      'href' => 'https://api.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8'
    ],
    'source' => [
      'href' => 'https://api.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4',
    ],
  ],
  'amount' => [
    'currency' => 'USD',
    'value' => '1.00'
  ],
  'metadata' => [
    'foo' => 'bar',
    'baz' => 'boo',
  ]
]);
$transfer; # => "https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388"
?>
```
```python
transfers_api = dwollaswagger.TransfersApi(client)

transfer = transfers_api.create(body = {
  '_links': {
    'destination': {
      'href': 'https://api.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8'
    },
    'source': {
      'href': 'https://api.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4'
    }
  },
  'amount': {
    'currency': 'USD',
    'value': '1.00'
  },
  'metadata': {
    'foo': 'bar',
    'baz': 'boo'
  }
})
transfer # => 'https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388'
```
```javascript
var requestBody = {
  _links: {
    destination: {
      href: 'https://api.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8'
    },
    source: {
      href: 'https://api.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4'
    }
  },
  amount: {
    currency: 'USD',
    value: '1.00'
  },
  metadata: {
    foo: 'bar',
    baz: 'boo'
  }
};

accountToken
  .post('transfers', requestBody)
  .then(function(res) {
    res.headers.get('location'); // => 'https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388'
  });
```

## Get a transfer by id

This section covers how to retrieve a transfer belonging to an Account or Customer by its id.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth access token with the `Transactions` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/transfers/{id}`

### Request parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | The id of the transfer to be retrieved.

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
transfer_url = 'https://api.dwolla.com/transfers/4C8AD8B8-3D69-E511-80DB-0AA34A9B2388'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
transfer = account_token.get transfer_url
transfer.status # => "pending"

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
transfer = DwollaSwagger::TransfersApi.by_id(transfer_url)
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
transfer_url = 'https://api.dwolla.com/transfers/4C8AD8B8-3D69-E511-80DB-0AA34A9B2388'

transfers_api = dwollaswagger.TransfersApi(client)
transfer = transfers_api.by_id(transfer_url)

transfer.status # => 'pending'
```
```javascript
var transferUrl = 'https://api.dwolla.com/transfers/4C8AD8B8-3D69-E511-80DB-0AA34A9B2388';

accountToken
  .get(transferUrl)
  .then(function(res) {
    res.body.status; // => 'pending'
  });
```
## Get a transfer's fees

This section outlines how to retrieve fees charged on a created transfer. Fees are visible to the `Customer` or `Account` that is charged the fee, as well as the Dwolla `Account` that is involved in receiving the fee.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth access token with the `Transactions` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/transfers/{id}/fees`

### Request parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | The id of the transfer to retrieve fees for.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Transfer not found. |

### Request and response

```raw
GET https://api-uat.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388/fees
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "transactions": [
    {
      "_links": {
        "self": {
          "href": "https://api-uat.dwolla.com/transfers/416a2857-c887-4cca-bd02-8c3f75c4bb0e"
        },
        "source": {
          "href": "https://api-uat.dwolla.com/customers/b442c936-1f87-465d-a4e2-a982164b26bd"
        },
        "destination": {
          "href": "https://api-uat.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
        },
        "created-from-transfer": {
          "href": "https://api-uat.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388"
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
          "href": "https://api-uat.dwolla.com/transfers/e58ae1f1-7007-47d3-a308-7e9aa6266d53"
        },
        "source": {
          "href": "https://api-uat.dwolla.com/customers/b442c936-1f87-465d-a4e2-a982164b26bd"
        },
        "destination": {
          "href": "https://api-uat.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
        },
        "created-from-transfer": {
          "href": "https://api-uat.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388"
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
transfer_url = 'https://api-uat.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
fees = account_token.get "#{transfer_url}/fees"
fees.total # => 2
```
```php
/**
 *  No example for this language yet.
 **/
```
```python
# No example for this language yet.
```
```javascript
var transferUrl = 'https://api-uat.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388';

accountToken
  .get(`${transferUrl}/fees`)
  .then(function(res) {
    res.body.total; // => 2
  });
```

## Get transfer failure reason

When a bank transfer fails for an Account or Customer, Dwolla returns a `failure` link when [getting the transfer by Id](#get-a-transfer-by-id). This failure link is used to retrieve the return code and description. For reference, the list of possible failure codes and descriptions are shown in the [Transfer failures](https://developers.dwolla.com/resources/bank-transfer-workflow/transfer-failures.html) resource article.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth access token with the `Transactions` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP Request
`GET https://api.dwolla.com/transfers/{id}/failure`

### Request Parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | Transfer unique identifier

### Request and Response

```raw
GET https://api-uat.dwolla.com/transfers/e6d9a950-ac9e-e511-80dc-0aa34a9b2388/failure
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "_links": {
    "self": {
      "href": "https://api-uat.dwolla.com/transfers/E6D9A950-AC9E-E511-80DC-0AA34A9B2388/failure"
    }
  },
  "code": "R1",
  "description": "Insufficient Funds"
}
```
```ruby
transfer_url = 'https://api-uat.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
failure = account_token.get "#{transfer_url}/failure"
failure.code # => "R1"
```
```php
/**
 *  No example for this language yet.
 **/
```
```python
# No example for this language yet.
```
```javascript
var transferUrl = 'https://api-uat.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388';

accountToken
  .get(`${transferUrl}/failure`)
  .then(function(res) {
    res.body.code; // => 'R1'
  });
```
