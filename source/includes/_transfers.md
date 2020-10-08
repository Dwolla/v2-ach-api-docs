# Transfers

A transfer represents money being transferred from a `source` to a `destination`. Transfers are available for the `Customer` and `Account` resources.

### Transfer Links

| Link                       | Description                                                                   |
|----------------------------|-------------------------------------------------------------------------------|
| self                       | URL of the transfer.                                                          |
| source                     | GET this link to [retrieve the Customer](#retrieve-a-customer) that was the `source` of the transfer. |
| destination                | GET this link to [retrieve the Customer](#retrieve-a-customer) that was the `destination` of the transfer. |
| source-funding-source      | GET this link to [retrieve the funding source](#retrieve-a-funding-source) that was the `source` of the transfer. |
| destination-funding-source | GET this link to [retrieve the funding source](#retrieve-a-funding-source) that was the `destination` of the transfer. |
| cancel                     | POST to this link to [cancel the transfer](#cancel-a-transfer) (A bank transfer is cancellable up until 4pm CT on that same business day if the transfer was initiated prior to 4PM CT. If a transfer was initiated after 4pm CT, it can be cancelled anytime before 4pm CT on the following business day.) |
| fees                       | GET this link to [retrieve the facilitator fees](#list-fees-for-a-transfer) associated with the transfer. |

### Transfer resource

| Parameter | Description |
|-----------|------------|
| id | Transfer unique identifier. |
| status | Either `processed`, `pending`, `cancelled`, or `failed`. |
| amount | An amount JSON object. See below. |
| created | ISO-8601 timestamp. |
| metadata | A metadata JSON object |
| clearing | A clearing JSON object. |
| achDetails | An achDetails JSON object. See below. |
| correlationId | A string value attached to a transfer resource which can be used for traceability between Dwolla and your application. |
| individualAchId | A unique string value matching the value on bank line related to the transfer. Appears when the debit entry clears out of the bank. The individual identifier for that ACH entry. |

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
  "created": "string",
  "metadata": {
    "key": "value"
  },
  "clearing": {
    "source": "standard",
    "destination": "next-available"
  },
  "achDetails": {
        "source": {
            "addenda": {
                "values": [
                    "string"
                ]
            },
            "traceId": "string"
            },
        "destination": {
            "addenda": {
                "values": [
                    "string"
                ]
            },
            "traceId": "string"
            }
        },
  "correlationId": "string",
  "individualAchId": "string"
}
```

### Source and destination types

##### Source types

| Source Type | URI | Description |
|-------|---------|---------------|
| Funding source | `https://api.dwolla.com/funding-sources/{id}` | A bank or balance funding source. |

##### Destination types

| Destination Type | URI | Description |
|-------|---------|---------------|
| Funding source | `https://api.dwolla.com/funding-sources/{id}` | Destination of an Account or verified Customer's own bank or balance funding source. **OR** A Customer's bank funding source. |

### amount JSON object

| Parameter | Required |  Type  | Description            |
|-----------|----------|--------|------------------------|
| value     |   yes    | string | Amount of money. If the entered amount has more than two decimal places, Dwolla will automatically round it to the nearest even integer using [Banker's Rounding](http://wiki.c2.com/?BankersRounding). <br> Maximum limit: Default transaction limits based on [Customer type](https://developers.dwolla.com/resources/account-types.html) or custom transaction limits as defined in the services agreement with Dwolla. <br> Minimum limit: $0.01.|
| currency  |   yes    | string | Possible values: `USD` |

### Facilitator fee JSON object

The facilitator fee is a feature allowing for a flat rate amount to be removed from a payment as a fee, and sent to the creator of the Dwolla application. The fee does not affect the original payment amount, and exists as a separate [Transfer resource](#transfer-resource) with a unique transfer ID. Within a transfer request you can specify an optional `fees` request parameter, which is an array of [fee objects](#facilitator-fee-json-object) that can represent many unique fee transfers.

For more information on collecting fees on payments, reference the [facilitator fee](https://developers.dwolla.com/resources/facilitator-fee.html) resource article.

| Parameter | Description |
|-----------|------------|
|_links | Contains a `charge-to` JSON object with a link to the associated source or destination `Customer` resource. |
|amount | Amount of fee to charge. An amount JSON object. [See above](#amount-json-object) |

#### Facilitator fee example:

```noselect
"fees": [
  {
    "_links": {
      "charge-to": {
        "href": "https://api-sandbox.dwolla.com/customers/d795f696-2cac-4662-8f16-95f1db9bddd8"
      }
    },
    "amount": {
      "value": "4.00",
      "currency": "USD"
    }
  }
]
```

### clearing JSON object

The `clearing` object is used in tandem with our expedited transfer feature.
Source specifies the clearing time for the source funding source involved in the transfer, and can be used to downgrade the clearing time from the default of Next-day ACH. Destination specifies the clearing time for the destination funding source involved in the transfer, and can be used to upgrade the clearing time from the default of Standard ACH to Same-day ACH.

> **Note:** The clearing request parameter is a premium feature available for [Dwolla](https://www.dwolla.com/platform) customers. Enabling Next-day ACH and Same-day ACH requires additional Dwolla approvals before getting started. Please contact [Sales](https://www.dwolla.com/contact?b=apidocs) or your account manager for more information on enabling this account setting.

| Parameter | Required | Type | Description |
|-----------|------------|------|-----------|
| source | no | string | Represents a clearing object for `standard` debits into the Dwolla network. Used to downgrade the clearing time from the default of Next-day ACH. <br> Possible values: `standard` |
| destination | no | string | Represents a clearing object for `same-day` credits out of the Dwolla network to a bank funding source. <br> Possible values: `next-available` |

#### Clearing example:

```noselect
"clearing": {
  "source": "standard",
  "destination": "next-available"
}
```

### achDetails and addenda object

**Note: This feature is only supported for business Customer records.** <br> The addendum record is used to provide additional information to the payment recipient about the payment. This value will be passed in on a transfer request and can be exposed on a Customer’s bank statement. Addenda records provide a unique opportunity to supply your customers with more information about their transactions. Allowing businesses to include additional details about the transaction—such as invoice numbers—provides their end users with more information about the transaction in the comfort of their own banking application.

##### achDetails object

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| source | no | object | Represents information that is sent to a source/originating bank account along with a transfer. Include information within this JSON object for customizing details on ACH debit transfers. Can include an [addenda JSON object](#addenda-object). |
| destination | no | object | Represents information that is sent to a destination/receiving bank account along with a transfer. Include information within this JSON object for customizing details on ACH credit transfers. Can include an [addenda JSON object](#addenda-object).|

##### addenda object

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| addenda | no | object | An addenda object contains a `values` key which is an array of comma separated string addenda values. Addenda record information is used for the purpose of transmitting transfer-related information from a business. <br> Values must be less than or equal to 80 characters and can include spaces. <br> Acceptable characters are: a-Z, 0-9, and special characters `- _ . ~ ! * ' ( ) ; : @ & = + $ , / ? % # [ ]`. <br> *Transfers must be sent to/from a business entity's bank to guarantee addenda delivery.* |

#### achDetails with addenda example:

```noselect
"achDetails": {
  "source": {
    "addenda": {
      "values": ["ABC123_AddendaValue"]
    }
  },
  "destination": {
    "addenda": {
      "values": ["ZYX987_AddendaValue"]
    }
  }
}
```

## Initiate a transfer

This section covers how to initiate a transfer from either a Dwolla [Account](#accounts) or Dwolla API [Customer](#customers) resource.

### Prevent duplicate transfers with idempotency key

To prevent an operation from being performed more than once, Dwolla supports passing in an `Idempotency-Key` header with a unique key as the value. Multiple `POSTs` with the same idempotency key won't result in multiple resources being created.

For example, if a request to initiate a transfer fails due to a network connection issue, you can reattempt the request with the same idempotency key to ensure that only a single transfer is created.

Refer to our [idempotency key](#idempotency-key) section to learn more.

### HTTP request

`POST https://api.dwolla.com/transfers`

### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| _links | yes | object | A _links JSON object describing the desired `source` and `destination` of a transfer. [Reference the Source and Destination object to learn more](#source-and-destination-types) about possible values for `source` and `destination`. |
| amount | yes | object | An amount JSON object. [Reference the amount JSON object to learn more](#amount-json-object). |
| metadata | no | object | A metadata JSON object with a maximum of 10 key-value pairs (each key and value must be less than 255 characters). |
| fees | no | array | An array of fee JSON objects that contain unique fee transfers. [Reference the facilitator fee JSON object to learn more](#facilitator-fee-json-object). |
| clearing | no | object | A clearing JSON object that contains `source` and `destination` keys to slow down or expedite a transfer. [Reference the clearing JSON object to learn more](#clearing-json-object). |
| achDetails | no | object | An ACH details JSON object which represents additional information sent along with a transfer to an originating or receiving financial institution. Details within this object can be used to reference a transaction that has settled with a financial institution. [Reference the achDetails JSON object to learn more](#achdetails-object)|
| correlationId | no | string | A string value attached to a customer which can be used for traceability between Dwolla and your application. **Note:** A correlationId is not a replacement for an [idempotency-key](#idempotency-key). <br> Must be less than 255 characters and contain no spaces. <br> Acceptable characters are: `a-Z`, `0-9`, `-`, `.`, and `_`. <br> **Note:** Sensitive Personal Identifying Information (PII) should not be used in this field and it is recommended to use a random value for correlationId, like a UUID. |

### HTTP status and error codes

| HTTP Status |    Error Message       |      Description             |
|-------------|------------------------|------------------------------|
|    201      | Created.               | A transfer was created.      |
|    400      | Funding source not found. | Double check the funding source Id, and make sure you are using the correct funding source Id. |
|    400      | Invalid funding source.| The `source` funding source must be verified in order to send funds. Make sure your `source` funding source is `verified`. |
|    400      | Metadata not supported for this type of transfer. | Metadata is unable to be passed in on transfers with a Balance Funding Source. |
|    400      | Sender // Receiver Restricted. | The `source` or `destination` Customer is either `deactivated` or `suspended` and not eligible for transfers. |
|    400      | Invalid amount         | The supplied amount is greater than your transaction limit. For more information on transaction limits for various Customer types, check out our [Customer Types article](https://developers.dwolla.com/resources/account-types.html). |
|    400      | Invalid amount         | The supplied amount must be a positive number. |
|    401      | Invalid access token   | Access token not valid. Generate a new one and try again. |
|    403      | Forbidden              | Not authorized to create a transfer. |
|    403      | Forbidden              | Invalid Funds Flow: this operation requires the funds flow (`facilitate`/`receive`/`send`) to be enabled. |
|    429      | TooManyRequests        | Concurrent transfers with the given funding source are not supported. Please wait a short period of time before re-attempting the request. <br /> **Note:** We don’t support concurrent transfers sourced from a Dwolla balance. |


### Request and response

The reference example below shows what a request looks like when sending a transfer.
Please note this example is using [same-day](https://developers.dwolla.com/resources/same-day-ach.html) clearing to a Dwolla API Customer's bank account, part of Dwolla's API.

```raw
POST https://api-sandbox.dwolla.com/transfers
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
Idempotency-Key: 19051a62-3403-11e6-ac61-9e71128cae77

{
   "_links": {
       "source": {
           "href": "https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
       },
       "destination": {
           "href": "https://api-sandbox.dwolla.com/funding-sources/AB443D36-3757-44C1-A1B4-29727FB3111C"
       }
   },
   "amount": {
       "currency": "USD",
       "value": "10.00"
   },
   "metadata": {
       "paymentId": "12345678",
       "note": "payment for completed work Dec. 1"
   },
   "fees": [
       {
          "_links":{
             "charge-to":{
                "href":"https://api-sandbox.dwolla.com/customers/c2bdcc87-91cd-41dd-9b06-5e31d4d3bbe4"
             }
          },
          "amount":{
             "value":"2.00",
             "currency":"USD"
          }
       }
   ],
   "clearing": {
       "destination": "next-available"
   },
    "achDetails": {
        "source": {
            "addenda": {
                "values": ["ABC123_AddendaValue"]
            }
        },
        "destination": {
            "addenda": {
                "values": ["ZYX987_AddendaValue"]
            }
        }
     },
 "correlationId": "8a2cdc8d-629d-4a24-98ac-40b735229fe2"
}

...

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388
```

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
request_body = {
  :_links => {
    :source => {
      :href => "https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
    },
    :destination => {
      :href => "https://api-sandbox.dwolla.com/funding-sources/AB443D36-3757-44C1-A1B4-29727FB3111C"
    }
  },
  :amount => {
    :currency => "USD",
    :value => "1.00"
  },
  :metadata => {
    :paymentId => "12345678",
    :note => "payment for completed work Dec. 1"
  },
  :clearing => {
    :destination => "next-available"
  },
  :achDetails => {
    :source => {
      :addenda => {
        :values => ["ABC123_AddendaValues"]
      }
    },
    :destination => {
      :addenda => {
        :values => ["ZYX987_AddendaValues"]
      }
    }
  },
  :correlationId => "8a2cdc8d-629d-4a24-98ac-40b735229fe2"
}

transfer = app_token.post "transfers", request_body
transfer.response_headers[:location] # => "https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388"
```

```php
<?php
$transfersApi = new DwollaSwagger\TransfersApi($apiClient);

$transfer = $transfersApi->create([
  '_links' => [
    'source' => [
      'href' => 'https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4',
    ],
    'destination' => [
      'href' => 'https://api-sandbox.dwolla.com/funding-sources/AB443D36-3757-44C1-A1B4-29727FB3111C'
    ]
  ],
  'amount' => [
    'currency' => 'USD',
    'value' => '1.00'
  ],
  'metadata' => [
    'paymentId' => '12345678',
    'note' => 'payment for completed work Dec. 1',
  ],
  'clearing' => [
    'destination' => 'next-available'
  ],
  'correlationId' => '8a2cdc8d-629d-4a24-98ac-40b735229fe2'
]);
$transfer; # => "https://api-sandbox.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388"
?>
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
request_body = {
  '_links': {
    'source': {
      'href': 'https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4'
    },
    'destination': {
      'href': 'https://api-sandbox.dwolla.com/funding-sources/AB443D36-3757-44C1-A1B4-29727FB3111C'
    }
  },
  'amount': {
    'currency': 'USD',
    'value': '1.00'
  },
  'metadata': {
    'paymentId': '12345678',
    'note': 'payment for completed work Dec. 1'
  },
  'clearing': {
    'destination': 'next-available'
  },
  'achDetails': {
    'source': {
      'addenda': {
        'values': ['ABC123_AddendaValues']
      }
    },
    'destination': {
      'addenda': {
        'values': ['ZYX987_AddendaValues']
      }
    }
  },
  'correlationId': '8a2cdc8d-629d-4a24-98ac-40b735229fe2'
}

transfer = app_token.post('transfers', request_body)
transfer.headers['location'] # => 'https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388'
```

```javascript
var requestBody = {
  _links: {
    source: {
      href: 'https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4'
    },
    destination: {
      href: 'https://api-sandbox.dwolla.com/funding-sources/AB443D36-3757-44C1-A1B4-29727FB3111C'
    }
  },
  amount: {
    currency: 'USD',
    value: '1.00'
  },
  metadata: {
    paymentId: '12345678',
    note: 'payment for completed work Dec. 1'
  },  
  clearing: {
    destination: 'next-available'
  },
  addenda: {
    source: {
      addenda: {
        values: ['ABC123_AddendaValue']
      }
    },
    destination: {
      addenda: {
        values: ['ZYX987_AddendaValue']
      }
    }
  },
  correlationId: '8a2cdc8d-629d-4a24-98ac-40b735229fe2'
};

appToken
  .post('transfers', requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388'
```

## Retrieve a transfer

This section covers how to retrieve a transfer belonging to an Account or Customer by its id.

### HTTP request
`GET https://api.dwolla.com/transfers/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | The id of the transfer to be retrieved. |

### HTTP status and error codes
| HTTP Status | Message |
|--------------|-------------|
| 404 | Transfer not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/transfers/15c6bcce-46f7-e811-8112-e8dd3bececa8
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
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
},
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
transfer_url = 'https://api.dwolla.com/transfers/15c6bcce-46f7-e811-8112-e8dd3bececa8'

transfer = app_token.get transfer_url
transfer.status # => "pending"
```
```php
<?php
$transferUrl = 'https://api-sandbox.dwolla.com/transfers/15c6bcce-46f7-e811-8112-e8dd3bececa8';

$transfersApi = new DwollaSwagger\TransfersApi($apiClient);

$transfer = $transfersApi->byId($transferUrl);
$transfer->status; # => "pending"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
transfer_url = 'https://api-sandbox.dwolla.com/transfers/15c6bcce-46f7-e811-8112-e8dd3bececa8'

transfer = account_token.get(transfer_url)
transfer.body['status'] # => 'pending'
```
```javascript
var transferUrl = 'https://api-sandbox.dwolla.com/transfers/15c6bcce-46f7-e811-8112-e8dd3bececa8';

appToken
  .get(transferUrl)
  .then(res => res.body.status); // => 'pending'
```

## List and search transfers for a customer

This section details how to retrieve a Customer's list of transfers. Transaction search is supported by passing in optional querystring parameters such as: `search` which represents a term to search on, `correlationId`, `startAmount`, `endAmount`, `startDate`, `endDate`, and `status`.

### HTTP request
`GET https://api.dwolla.com/customers/{id}/transfers`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Customer unique identifier to get transfers for. |
| search | no | string | A string to be matched with `firstName`, `lastName`, `email`, `businessName`, Customer Id, and Account Id. (`/transfers?search=Doe`) |
| startAmount | no | string | Only include transactions with an amount equal to or greater than `startAmount`. Can optionally be used with `endAmount` to specify an amount range. |
| endAmount | no | string | Only include transactions with an amount equal to or less than `endAmount`. Can optionally be used with `startAmount` to specify an amount range. |
| startDate | no | string | Only include transactions created after this date. ISO-8601 format: `YYYY-MM-DD`. Can optionally be used with `endDate` to specify a date range. |
| endDate | no | string | Only include transactions created before this date. ISO-8601 format: `YYYY-MM-DD`. Can optionally be used with `startDate` to specify a date range. |
| status | no | string | Filter results on transaction status. Possible values: `pending`, `processed`, `failed`, or `cancelled`. |
| correlationId | no | string | A string value to search on if a `correlationId` was specified on a transfer or mass payment item. |
| limit | no | integer | Number of search results to return. Defaults to 25. |
| offset | no | integer | Number of search results to skip. Used for pagination. |

### HTTP status and error codes
| HTTP Status | Message |
|--------------|-------------|
| 403 | Not authorized to list transfers. |
| 404 | Customer not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/customers/33e56307-6754-41cb-81e2-23a7f1072295/transfers
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/customers/33e56307-6754-41cb-81e2-23a7f1072295/transfers"
    },
    "first": {
      "href": "https://api-sandbox.dwolla.com/customers/33e56307-6754-41cb-81e2-23a7f1072295/transfers?&limit=25&offset=0"
    },
    "last": {
      "href": "https://api-sandbox.dwolla.com/customers/33e56307-6754-41cb-81e2-23a7f1072295/transfers?&limit=25&offset=0"
    }  
  },
  "_embedded": {
    "transfers": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/transfers/61cbc6db-19f4-e811-8112-e8dd3bececa8"
          },
          "source": {
            "href": "https://api-sandbox.dwolla.com/customers/39e21228-5958-4c4f-96fe-48a4bf11332d"
          },
          "source-funding-source": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/73ce02cb-8857-4f01-83fc-b6640b24f9f7"
          },
          "destination": {
            "href": "https://api-sandbox.dwolla.com/customers/33e56307-6754-41cb-81e2-23a7f1072295"
          },
          "destination-funding-source": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/ac6d4c2a-fda8-49f6-805d-468066dd474c"
          },
        },
        "id": "461cbc6db-19f4-e811-8112-e8dd3bececa8",
        "status": "pending",
        "amount": {
          "value": "225.00",
          "currency": "USD"
        },
        "created": "2018-11-29 21:00:59 UTC",
        "metadata": {
          "foo": "bar",
          "baz": "foo"
        }
      },
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/transfers/76e5541d-18f4-e811-8112-e8dd3bececa8"
          },
          "source": {
            "href": "https://api-sandbox.dwolla.com/customers/0e309d41-a5df-4105-97da-2c6739e71a67"
          },
          "source-funding-source": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/73ce02cb-8857-4f01-83fc-b6640b24f9f7"
          },
          "destination": {
            "href": "https://api-sandbox.dwolla.com/customers/33e56307-6754-41cb-81e2-23a7f1072295"
          },
          "destination-funding-source": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/ac6d4c2a-fda8-49f6-805d-468066dd474c"
          }
        },
        "id": "76e5541d-18f4-e811-8112-e8dd3bececa8",
        "status": "pending",
        "amount": {
          "value": "225.00",
          "currency": "USD"
        },
        "created": "2015-10-02T19:40:41.437Z",
        "metadata": {
          "foo": "bar",
          "baz": "foo"
        }
      }
    ]
  },
  "total": 2
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'http://api-sandbox.dwolla.com/customers/33e56307-6754-41cb-81e2-23a7f1072295'

transfers = app_token.get "#{customer_url}/transfers"
transfers._embedded['transfers'][0].status # => "pending"
```
```php
<?php
$customerUrl = 'http://api-sandbox.dwolla.com/customers/33e56307-6754-41cb-81e2-23a7f1072295';

$TransfersApi = new DwollaSwagger\TransfersApi($apiClient);

$transfers = $TransfersApi->getCustomerTransfers($customerUrl);
$transfers->_embedded->{'transfers'}[0]->status; # => "pending"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'http://api-sandbox.dwolla.com/customers/33e56307-6754-41cb-81e2-23a7f1072295'

transfers = app_token.get('%s/transfers' % customer_url)
transfers.body['_embedded']['transfers'][0]['status'] # => 'pending'
```
```javascript
var customerUrl = 'http://api-sandbox.dwolla.com/customers/33e56307-6754-41cb-81e2-23a7f1072295';

appToken
  .get(`${customerUrl}/transfers`)
  .then(res => res.body._embedded['transfers'][0].status); // => "pending"
```

## List fees for a transfer

This section outlines how to retrieve fees charged on a created transfer. Fees are visible to the `Customer` or `Account` that is charged the fee, as well as the Dwolla `Account` that is involved in receiving the fee.

### HTTP request
`GET https://api.dwolla.com/transfers/{id}/fees`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | The id of the transfer to retrieve fees for. |

### HTTP status and error codes
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
          "href": "https://api-sandbox.dwolla.com/customers/ac6d4c2a-fda8-49f6-805d-468066dd474c"
        },
        "destination": {
          "href": "https://api-sandbox.dwolla.com/accounts/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
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
          "href": "https://api-sandbox.dwolla.com/customers/ac6d4c2a-fda8-49f6-805d-468066dd474c"
        },
        "destination": {
          "href": "https://api-sandbox.dwolla.com/accounts/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
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

fees = app_token.get "#{transfer_url}/fees"
fees.total # => 2
```
```php
<?php
$transferUrl = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388';

$transfersApi = new DwollaSwagger\TransfersApi($apiClient);

$transferFees = $transfersApi->getFeesBySource($transferUrl);
$transferFees->total; # => "2"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
transfer_url = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388'

fees = app_token.get('%s/fees' % transfer_url)
fees.body['total'] # => 2
```
```javascript
var transferUrl = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388';

appToken
  .get(`${transferUrl}/fees`)
  .then(res => res.body.total); // => 2
```

## Retrieve a transfer failure reason

When a bank transfer fails for an Account or Customer, Dwolla returns a `failure` link when [retrieving the transfer by its Id](#retrieve-a-transfer). This failure link is used to retrieve the ACH return code and description. For reference, the list of possible failure codes and descriptions are shown in the [Transfer failures](https://developers.dwolla.com/resources/bank-transfer-workflow/transfer-failures.html) resource article.

**Note:** If a transfer fails to/from a bank account then the `bank` will automatically be removed from the Dwolla system for all ACH return codes except an `R01`.

### HTTP Request
`GET https://api.dwolla.com/transfers/{id}/failure`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Transfer unique identifier. |

### Request and Response

```raw
GET https://api-sandbox.dwolla.com/transfers/8997ebed-69be-e611-80ea-0aa34a9b2388/failure
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
    "_links": {
        "self": {
            "href": "https://api.dwolla.com/transfers/8997ebed-69be-e611-80ea-0aa34a9b2388/failure",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "failure"
        },
        "failed-funding-source": {
            "href": "https://api.dwolla.com/funding-sources/285ea6f4-c45d-4e15-ad33-21f51461f437",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "funding-source"
        },
        "customer": {
            "href": "https://api.dwolla.com/customers/be2d2322-fdee-4361-8722-4289f5601604",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        }
    },
    "code": "R03",
    "description": "No Account/Unable to Locate Account",
    "explanation": "The account number does not correspond to the individual identified in the entry or a valid account."
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
transfer_url = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388'

failure = app_token.get "#{transfer_url}/failure"
failure.code # => "R01"
```
```php
<?php
$transferUrl = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388';

$transfersApi = new DwollaSwagger\TransfersApi($apiClient);

$transferFailure = $transfersApi->failureById($transferUrl);
$transferFailure->code; # => "R01"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
transfer_url = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388'

failure = app_token.get('%s/failure' % transfer_url)
failure.body['code'] # => 'R01'
```
```javascript
var transferUrl = 'https://api-sandbox.dwolla.com/transfers/83eb4b5e-a5d9-e511-80de-0aa34a9b2388';

appToken
  .get(`${transferUrl}/failure`)
  .then(res => res.body.code); // => 'R01'
```

## Cancel a transfer

When a bank transfer is eligible for cancellation, Dwolla returns a `cancel` link  when [getting the transfer by Id](#retrieve-a-transfer). This cancel link is used to trigger the cancellation, preventing the bank transfer from processing further. A bank transfer is cancellable up until 4pm CT on that same business day if the transfer was initiated prior to 4PM CT. If a transfer was initiated after 4pm CT, it can be cancelled anytime before 4pm CT on the following business day.

### HTTP Request
`POST https://api.dwolla.com/transfers/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| status | yes | string | Possible value: `cancelled`. |

### Request and Response

```raw
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
      "href": "https://api-sandbox.dwolla.com/transfers/3d48c13a-0fc6-e511-80de-0aa34a9b2388",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    },
    "self": {
      "href": "https://api-sandbox.dwolla.com/transfers/3d48c13a-0fc6-e511-80de-0aa34a9b2388",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    },
    "source": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "account"
    },
    "source-funding-source": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/73ce02cb-8857-4f01-83fc-b6640b24f9f7",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "funding-source"
    },
    "funding-transfer": {
      "href": "https://api-sandbox.dwolla.com/transfers/3c48c13a-0fc6-e511-80de-0aa34a9b2388",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    },
    "destination": {
      "href": "https://api-sandbox.dwolla.com/customers/33e56307-6754-41cb-81e2-23a7f1072295",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "customer"
    },
    "destination-funding-source": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/ac6d4c2a-fda8-49f6-805d-468066dd474c",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "funding-source"
    }
  },
  "id": "3d48c13a-0fc6-e511-80de-0aa34a9b2388",
  "status": "cancelled",
  "amount": {
    "value": "22.00",
    "currency": "USD"
  },
  "created": "2016-01-28T22:34:02.663Z",
  "metadata": {
    "foo": "bar",
    "baz": "boo"
  }
}
```

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
transfer_url = 'https://api-sandbox.dwolla.com/transfers/3d48c13a-0fc6-e511-80de-0aa34a9b2388'
request_body = {
      "status" => "cancelled",
}

transfer = app_token.post "#{transfer_url}", request_body
transfer.status # => "cancelled"
```

```php
<?php
$transfersApi = new DwollaSwagger\TransfersApi($apiClient);

$transferUrl = 'https://api-sandbox.dwolla.com/transfers/3d48c13a-0fc6-e511-80de-0aa34a9b2388';
$transfer = $transfersApi->update([
  'status' => 'cancelled',
], $transferUrl);

$transfer->status; # => "cancelled"
?>
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
transfer_url = 'https://api-sandbox.dwolla.com/transfers/3d48c13a-0fc6-e511-80de-0aa34a9b2388'
request_body = {
  'status': 'cancelled'
}

transfer = app_token.post(transfer_url, request_body)
transfer.body['status'] # => 'cancelled'
```

```javascript
var transferUrl = 'https://api-sandbox.dwolla.com/transfers/3d48c13a-0fc6-e511-80de-0aa34a9b2388'
var requestBody = {
  status: "cancelled"
};

appToken
  .post('transfers', requestBody)
  .then(res => res.body.status); // => "cancelled"
```

## Create an on-demand transfer authorization

This section outlines how to create an on-demand bank transfer authorization for your Customer. On-demand authorization allows Customers to authorize Dwolla to transfer variable amounts from their bank account using ACH at a later point in time for products or services delivered. This on-demand authorization is supplied along with the Customer's bank details when creating a [new Customer funding source](#create-a-funding-source-for-a-customer).

When on-demand authorization is enabled for your application the Customer is presented with text on a “add bank account” screen in your user interface(UI) giving authorization to Dwolla for future variable payments. **Note:** On-demand payments come as part of our Dwolla API and requires additional approval before getting started. Please [contact Sales](https://www.dwolla.com/contact?b=apidocs) or your account manager for more information on enabling.

### HTTP request
`POST https://api.dwolla.com/on-demand-authorizations`

### HTTP status and error codes
| HTTP Status | Code | Description |
|--------------|-------------|---------------|
| 403 | Forbidden | The supplied credentials are not authorized for this resource. |

### Request and response

```raw
POST https://api-sandbox.dwolla.com/on-demand-authorizations
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/on-demand-authorizations/30e7c028-0bdf-e511-80de-0aa34a9b2388"
    }
  },
  "bodyText": "I agree that future payments to Company ABC inc. will be processed by the Dwolla payment system from the selected account above. In order to cancel this authorization, I will change my payment settings within my Company ABC inc. account.",
  "buttonText": "Agree & Continue"
}
```
```ruby
on_demand_authorization = app_token.post "on-demand-authorizations"
on_demand_authorization.buttonText # => "Agree & Continue"
```
```php
<?php
$onDemandApi = new DwollaSwagger\OndemandauthorizationsApi($apiClient);

$onDemandAuth = $onDemandApi->createAuthorization();
$onDemandAuth->_links["self"]->href; # => "https://api-sandbox.dwolla.com/on-demand-authorizations/30e7c028-0bdf-e511-80de-0aa34a9b2388"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
on_demand_authorization = app_token.post('on-demand-authorizations')
on_demand_authorization.body['buttonText'] # => 'Agree & Continue'
```
```javascript
appToken
  .post('on-demand-authorizations')
  .then(res => res.body.buttonText); // => "Agree & Continue"
```

* * *
