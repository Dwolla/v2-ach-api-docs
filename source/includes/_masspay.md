# MassPay

Dwolla MassPay allows you to easily send up to 5,000 payments one API request. The payments are funded from a single user's specified funding source and processed asynchronously upon submission.

Your mass payment will then be queued and processed.  As the service processes your mass payment, each `item` is processed one after the other, at a rate between 0.5 sec. - 1 sec. / item.  Therefore, you can expect a 1000-item MassPay to be completed between 8-16 minutes.

MassPay offers a significant advantage over repeatedly calling the [Transfers](#transfers) endpoint for each individual transaction. This benefit is the fact that a bank-funded MassPay only incurs a single ACH debit from the bank account to fund the entire batch of payments.  The alternative approach will incur a debit from the bank funding source for each individual payment.  Those who used this approach have reported incurring fees from their financial institutions for excessive ACH transactions.

### Mass payment resource

| Parameter | Description |
|-----------|------------|
| id | Mass payment unique identifier |
|status | Either `pending`, `processing`, or `complete` |
|created | ISO-8601 timestamp |
|metadata | A metadata JSON object |

```noselect
{
  "_links": {},
  "_embedded": {},
  "id": "string",
  "status": "string",
  "created": "2016-03-11T15:52:58.289Z",
  "metadata": {}
}
```

## Initiate a mass payment

This section covers how to initiate a mass payment from an [Account](#accounts) or verified [Customer](#customers) resource. A mass payment contains a list of `items` representing individual payments. Optionally, mass payments can contain `metadata` on the mass payment itself as well as items contained in the mass payment which can be used to pass along additional information with the mass payment and item respectively.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Send` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`POST https://api.dwolla.com/mass-payments`

### Request parameters

Parameter | Optional? | Description
----------|------------|-------------
_links | no | A _links JSON object describing the desired `source` of a mass payment. [See below](#source-and-destination-values) for possible values for `source` and `destination`.
items | no | an array of item JSON objects that contain unique payments. [See below](#mass-payment-item)
metadata | yes | A metadata JSON object with a maximum of 10 key-value pairs (each key and value must be less than 255 characters).

### Source and destination values

| Source Type | URI | Description
-------|---------|---------------
Funding source | `https://api.dwolla.com/funding-sources/{id}` | A bank or balance funding source of an [Account](#accounts) or verified [Customer](#customers).

| Destination Type | URI | Description
-------|---------|---------------
Account | `https://api.dwolla.com/accounts/{id}` | Destination [Account](#accounts) of a transfer.
Customer | `https://api.dwolla.com/customers/{id}` | Destination [Customer](#customers) of a transfer.
Email | `mailto:johndoe@email.com` | Email address of existing Dwolla Account or recipient (recipient will create a Dwolla Account to claim funds)
Funding source | `https://api.dwolla.com/funding-sources/{id}` | Destination of a verified Customer's own bank or balance funding source. **OR** An unverified Customer's bank funding source.

### Mass payment item

| Parameter | Description
|-----------|------------|
| _links | Can return `mass-payment`, `destination` and `transfer` JSON objects that contain relational links to associated resources.
| amount | An amount JSON object containing `currency` and `value` keys.
| metadata | A metadata JSON object with a maximum of 10 key-value pairs (each key and value must be less than 255 characters).

#### Item object example:
```noselect
{
  "_links": {
      "destination": {
          "href": "https: //api.dwolla.com/customers/01B47CB2-52AC-42A7-926C-6F1F50B1F271"
      }
  },
  "amount": {
      "currency": "USD",
      "value": "1.00",
  },
  "metadata": {
      "key1": "value1"
  }
}
```

### HTTP Status and Error Codes

| HTTP Status | Code | Description |
|--------------|-------------|-----------------|
| 201 | Created | A mass payment resource was created |
| 400 | ValidationError | Can be: Items exceeded maximum count of 5000, Invalid amount, Invalid metadata, or Invalid funding source. |
| 401 | NotAuthorized | OAuth token does not have Send scope. |

### Request and response (transfer from Account to Customer)

```raw
POST /mass-payments
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
{
    "_links": {
        "source": {
            "href": "https://api-uat.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
        }
    },
    "items": [
      {
        "_links": {
            "destination": {
                "href": "https://api-uat.dwolla.com/customers/9c7f8d57-cd45-4e7a-bf7a-914dbd6131db"
            }
        },
        "amount": {
            "currency": "USD",
            "value": "1.00"
        },
        "metadata": {
            "payment1": "payment1"
        }
      },
            {
        "_links": {
            "destination": {
                "href": "https://api-uat.dwolla.com/customers/b442c936-1f87-465d-a4e2-a982164b26bd"
            }
        },
        "amount": {
            "currency": "USD",
            "value": "5.00"
        },
        "metadata": {
            "payment2": "payment2"
        }
      }
    ],
    "metadata": {
        "batch1": "batch1"
    }
}

...

HTTP/1.1 201 Created
Location: https://api.dwolla.com/mass-payments/d093bcd1-d0c1-41c2-bcb5-a5cc011be0b7
```
```ruby
request_body = {
  _links: {
    source: {
      href: "https://api-uat.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
    }
  },
  items: [
    {
      _links: {
        destination: {
          href: "https://api-uat.dwolla.com/customers/9c7f8d57-cd45-4e7a-bf7a-914dbd6131db"
        }
      },
      amount: {
        currency: "USD",
        value: "1.00"
      },
      metadata: {
        payment1: "payment1"
      }
    },
    {
      _links: {
        destination: {
          href: "https://api-uat.dwolla.com/customers/b442c936-1f87-465d-a4e2-a982164b26bd"
        }
      },
      amount: {
        currency: "USD",
        value: "5.00"
      },
      metadata: {
        payment2: "payment2"
      }
    }
  ],
  metadata: {
    batch1: "batch1"
  }
}

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
mass_payment = account_token.post "mass-payments", request_body
mass_payment.headers[:location] # => "https://api-uat.dwolla.com/mass-payments/cf1e9e00-09cf-43da-b8b5-a43b3f6192d4"
```
```php
/**
 *  No example for this language yet. Coming soon.
 **/
```
```python
# No example for this language yet. Coming soon.
```
```javascript
var requestBody = {
  _links: {
    source: {
      href: 'https://api-uat.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4'
    }
  },
  items: [
    {
      _links: {
        destination: {
          href: 'https://api-uat.dwolla.com/customers/9c7f8d57-cd45-4e7a-bf7a-914dbd6131db'
        }
      },
      amount: {
        currency: 'USD',
        value: '1.00'
      },
      metadata: {
        payment1: 'payment1'
      }
    },
    {
      _links: {
        destination: {
          href: 'https://api-uat.dwolla.com/customers/b442c936-1f87-465d-a4e2-a982164b26bd'
        }
      },
      amount: {
        currency: 'USD',
        value: '5.00'
      },
      metadata: {
        payment2: 'payment2'
      }
    }
  ],
  metadata: {
    batch1: 'batch1'
  }
}

accountToken
  .post('mass-payments', requestBody)
  .then(function(res) {
    res.headers.get('location'); // => 'https://api-uat.dwolla.com/mass-payments/cf1e9e00-09cf-43da-b8b5-a43b3f6192d4'
  });
```

## Get a mass payment by id

This section outlines how to retrieve a mass payment by its id. All mass payments will have a status of `pending` upon creation and will move to `processing` and finally `complete` as the service runs. It is recommended that you retrieve your [list of mass payment items](#list-mass-payment-items) when your mass payment has a status of `complete` to determine if any items failed to process successfully.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Transactions` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/mass-payments/{id}`

### Request parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | The id of the mass payment to retrieve information for.

### HTTP Status and Error Codes

| HTTP Status | Code | Description |
|--------------|-------------|------------------|
| 404 | NotFound | Mass payment not found. |

### Request and response

```raw
GET https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563"
    },
    "source": {
      "href": "https://api-uat.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
    },
    "items": {
      "href": "https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563/items"
    }
  },
  "id": "eb467252-808c-4bc0-b86f-a5cd01454563",
  "status": "processing",
  "created": "2016-03-18T19:44:16.000Z",
  "metadata": {}
}
```
```ruby
mass_payment_url = "https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563"

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
mass_payment = account_token.get mass_payment_url
mass_payment.status # => "processing"
```
```php
/**
 *  No example for this language yet. Coming soon.
 **/
```
```python
# No example for this language yet. Coming soon.
```
```javascript
var massPaymentUrl = 'https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563';

accountToken
  .get(massPaymentUrl)
  .then(function(res) {
    res.body.status; // => 'processing'
  });
```

## List mass payment items

A mass payment contains a list of payments called `items`. An `item` is distinct from the transfer which it creates. An item can contain a status of either `failed`, `pending`, or `success` depending on whether the payment was created by the Dwolla service or not. A mass payment item status of `success` is an indication that a transfer was successfully created. A mass payment's items will be returned in the `_embedded` object as a list of `items`.


<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Transactions` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP Request
`GET https://api.dwolla.com/mass-payments/{id}/items`

### Request Parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | Mass payment unique identifier
limit | yes | How many results to return. Defaults to 25.
offset | yes | How many results to skip
status | yes | Filter results on item status. Possible values: `failed`, `pending`, and `success`. Values delimited by `&status=` (i.e. - `/items?status=failed&status=pending`).

### HTTP Status and Error Codes

| HTTP Status | Code | Description
|--------------|-------------|------------------|
| 403 | Forbidden | Not authorized to list mass payment items. |
| 404 | NotFound | Mass payment not found. |

### Request and response

```raw
GET https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563/items
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563/items"
    },
    "first": {
      "href": "https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563/items?limit=25&offset=0"
    },
    "last": {
      "href": "https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563/items?limit=25&offset=0"
    }
  },
  "_embedded": {
    "items": [
      {
        "_links": {
          "self": {
            "href": "https://api-uat.dwolla.com/mass-payment-items/2f845bc9-41ed-e511-80df-0aa34a9b2388"
          },
          "mass-payment": {
            "href": "https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563"
          },
          "destination": {
            "href": "https://api-uat.dwolla.com/customers/9c7f8d57-cd45-4e7a-bf7a-914dbd6131db"
          },
          "transfer": {
            "href": "https://api-uat.dwolla.com/transfers/fa3999db-41ed-e511-80df-0aa34a9b2388"
          }
        },
        "id": "2f845bc9-41ed-e511-80df-0aa34a9b2388",
        "status": "success",
        "amount": {
          "value": "1.00",
          "currency": "USD"
        },
        "metadata": {
          "item1": "item1"
        }
      },
      {
        "_links": {
          "self": {
            "href": "https://api-uat.dwolla.com/mass-payment-items/30845bc9-41ed-e511-80df-0aa34a9b2388"
          },
          "mass-payment": {
            "href": "https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563"
          },
          "destination": {
            "href": "https://api-uat.dwolla.com/customers/b442c936-1f87-465d-a4e2-a982164b26bd"
          },
          "transfer": {
            "href": "https://api-uat.dwolla.com/transfers/fb3999db-41ed-e511-80df-0aa34a9b2388"
          }
        },
        "id": "30845bc9-41ed-e511-80df-0aa34a9b2388",
        "status": "success",
        "amount": {
          "value": "2.00",
          "currency": "USD"
        },
        "metadata": {
          "item2": "item2"
        }
      }
    ]
  },
  "total": 2
}
```
```ruby
mass_payment_url = 'https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
mass_payment_items = account_token.get "#{mass_payment_url}/items"
mass_payment_items.total # => 2
```
```php
/**
 *  No example for this language yet. Coming soon.
 **/
```
```python
# No example for this language yet. Coming soon.
```
```javascript
var massPaymentUrl = 'https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563'

accountToken
  .get(`${massPaymentUrl}/items`)
  .then(function(res) {
    res.body.total; // => 2
  });
```

## Get a mass payment item by id

This section covers how to retrieve a mass payment item by its unique identifier. An item can contain `_links` to: the mass payment the item belongs to, the transfer created from the item, and the destination user.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `Transactions` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/mass-payment-items/{id}`

### Request parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | The id of the item to be retrieved in a mass payment.

### HTTP Status and Error Codes

| HTTP Status | Code | Description
|--------------|-------------|------------------|
| 403 | Forbidden | Not authorized to list mass payment items. |
| 404 | NotFound | Mass payment not found. |

### Request and response

```raw
GET https://api-uat.dwolla.com/mass-payment-items/c1c7d293-63ec-e511-80df-0aa34a9b2388
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-uat.dwolla.com/mass-payment-items/2f845bc9-41ed-e511-80df-0aa34a9b2388"
    },
    "mass-payment": {
      "href": "https://api-uat.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563"
    },
    "destination": {
      "href": "https://api-uat.dwolla.com/customers/9c7f8d57-cd45-4e7a-bf7a-914dbd6131db"
    },
    "transfer": {
      "href": "https://api-uat.dwolla.com/transfers/fa3999db-41ed-e511-80df-0aa34a9b2388"
    }
  },
  "id": "2f845bc9-41ed-e511-80df-0aa34a9b2388",
  "status": "success",
  "amount": {
    "value": "1.00",
    "currency": "USD"
  },
  "metadata": {
    "item1": "item1"
  }
}
```
```ruby
mass_payment_item_url = 'https://api-uat.dwolla.com/mass-payment-items/c1c7d293-63ec-e511-80df-0aa34a9b2388'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
mass_payment_item = account_token.get mass_payment_item_url
mass_payment_item.status # => "success"
```
```php
/**
 *  No example for this language yet. Coming soon.
 **/
```
```python
# No example for this language yet. Coming soon.
```
```javascript
var massPaymentItemUrl = 'https://api-uat.dwolla.com/mass-payment-items/c1c7d293-63ec-e511-80df-0aa34a9b2388';

accountToken
  .get(massPaymentItemUrl)
  .then(function(res) {
    res.body.status; // => 'success'
  });
```
