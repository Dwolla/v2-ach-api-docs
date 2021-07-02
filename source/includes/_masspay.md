# Mass payments

Dwolla mass payments allows you to easily send up to 5,000 payments in one API request. The payments are funded from a single user's specified funding source and processed asynchronously upon submission.

<ol class = "alerts">
    <li class="alert icon-alert-info">
      Dwolla Mass Payments are meant for batches of multiple payments. If you are initiating a single payment to a singular Customer, we recommend using our [/transfers endpoint](/#initiate-a-transfer).
  </li>
</ol>

Your mass payment will initially be pending and then processed.  As the service processes your mass payment, each `item` is processed one after the other, at a rate between 0.5 sec. - 1 sec. / item.  Therefore, you can expect a 1000-item mass payment to be completed between 8-16 minutes.

A mass payment offers a significant advantage over repeatedly calling the [Transfers](#transfers) endpoint for each individual transaction. A key benefit is that a bank-funded mass payment only incurs a single ACH debit from the bank account to fund the entire batch of payments.  The alternative approach will incur an ACH debit from the bank funding source for each individual payment.  Those who used this approach have reported incurring fees from their financial institutions for excessive ACH transactions.

### Mass payments resource

| Parameter     | Description                                                                                                        |
|---------------|--------------------------------------------------------------------------------------------------------------------|
| id            | Mass payment unique identifier.                                                                                    |
| status        | Either `deferred`: A created mass payment that can be processed at a later time. `pending`: A mass payment that is pending and awaiting processing. A mass payment has a pending status for a brief period of time and cannot be cancelled. `processing`:  A mass payment that is processing. `complete`: A mass payment successfully completed processing. |
| created       | ISO-8601 timestamp.                                                                                                |
| metadata      | A metadata JSON object.                                                                                            |
| clearing      | A clearing JSON object.                                                                                            |
| total         | The sum amount of all items in the mass payment.                                                                   |
| totalFees     | The sum amount of all fees charged for the mass payment.                                                           |
| correlationId | A string value attached to a mass payment resource which can be used for traceability between Dwolla and your application.            |

```noselect
{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/mass-payments/da835c07-1e12-4212-8b93-a7e0013dfd98",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "mass-payment"
        },
        "source": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "funding-source"
        },
        "items": {
            "href": "https://api-sandbox.dwolla.com/mass-payments/da835c07-1e12-4212-8b93-a7e0013dfd98/items",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "mass-payment-item"
        }
    },
    "id": "da835c07-1e12-4212-8b93-a7e0013dfd98",
    "status": "complete",
    "created": "2017-08-31T19:18:02.000Z",
    "metadata": {
        "batch": "batch1"
    },
    "total": {
        "value": "0.02",
        "currency": "USD"
    },
    "totalFees": {
        "value": "0.00",
        "currency": "USD"
    },
    "correlationId": "d028beed-8152-481d-9427-21b6c4d99644"
}
```

## Initiate a mass payment

This section covers how to initiate a mass payment from your Dwolla Master [Account](#accounts) or Verified [Customer](#customers) resource. A mass payment contains a list of `items` representing individual payments. Optionally, mass payments can contain `metadata` and a `correlationId` on the mass payment itself as well as items contained in the mass payment, which can be used to pass along additional information with the mass payment and item respectively. If a `correlationId` is included on a mass payment item it will be passed along to the transfer created from the item and can be searched on.

### Prevent duplicate mass payment with idempotency key

To prevent an operation from being performed more than once, Dwolla supports passing in an `Idempotency-Key` header with a unique key as the value. Multiple `POSTs` with the same idempotency key won't result in multiple resources being created.

For example, if a request to initiate a mass payment fails due to a network connection issue, you can reattempt the request with the same idempotency key to ensure that only a single mass payment is created.

Refer to our [idempotency key](#idempotency-key) section to learn more.

### Deferred mass payment

A mass payment can be created with a status of `deferred`, which allows you to create the mass payment and defer processing to a later time. To trigger processing on a deferred mass payment, you'll [update the mass payment](#update-a-mass-payment) with a status of `pending`. A deferred mass payment can be cancelled by updating the mass payment with a status of `cancelled`.

### HTTP request

`POST https://api.dwolla.com/mass-payments`

### Request parameters

| Parameter     | Required | Type   | Description |
|---------------|----------|--------|--------------|
| _links        | yes      | object | A _links JSON object describing the desired `source` of a mass payment. [Reference the Source and Destination object to learn more about ](#source-and-destination-values) possible values for `source` and `destination`.    |
| items         | yes      | array  | an array of item JSON objects that contain unique payments. [See below](#mass-payment-item)        |
| metadata      | no       | object | A metadata JSON object with a maximum of 10 key-value pairs (each key and value must be less than 255 characters).     |
| status        | no       | string | Acceptable value is: `deferred`. |
| clearing      | no       | object | A clearing JSON object describing the desired `source` processing time. Utilize this parameter for bank sourced mass payments that you wish to configure the proccessing time for the ACH debit to Same-day ACH, or from Next-day ACH to standard ACH . [Reference the clearing JSON object to learn more](#clearing-json-object-mass-payment). |
| achDetails    | no       | object | An ACH details JSON object which represents additional information sent along with a transfer created from a mass payment item to an originating or receiving financial institution. Details within this object can be used to reference a transaction that has settled with a financial institution. [See below](#achdetails-and-addenda-object) |
| correlationId | no       | string | A string value attached to a customer which can be used for traceability between Dwolla and your application. **Note:** A correlationId is not a replacement for an [idempotency key](#idempotency-key). <br> Must be less than 255 characters and contain no spaces. <br> Acceptable characters are: `a-Z`, `0-9`, `-`, `.`, and `_`. <br> **Note:** Sensitive Personal Identifying Information (PII) should not be used in this field and it is recommended to use a random value for correlationId, like a UUID. |

### Source and destination values

##### Source types

| **Source** Type    | URI                                           | Description                                                                                     |
|----------------|-----------------------------------------------|-------------------------------------------------------------------------------------------------|
| Funding source | `https://api.dwolla.com/funding-sources/{id}` | A bank or balance funding source of an [Account](#accounts) or verified [Customer](#customers). |

##### Destination types

| **Destination** Type | URI                     | Description     |
|----------------------|-----------------------------------------------|--------------|
| Funding source   | `https://api.dwolla.com/funding-sources/{id}` | Destination of a Verified Customer's own `bank` or `balance` funding source, an Unverified Customer's `bank` funding source, or a Receive-only User's `bank` funding source. |

### Mass payment item

| Parameter     | Description      |
|-------------|--------------------------------------------------------------------------------------|
| _links        | A _links JSON object describing the desired `destination` of a mass payment. [See above](#source-and-destination-values) for possible values for `destination`.          |
| amount        | An amount JSON object containing `currency` and `value` keys.                                                                       |
| metadata      | A metadata JSON object with a maximum of 10 key-value pairs (each key and value must be less than 255 characters).                  |
| correlationId | A string value attached to a mass payment item which can be used for traceability between Dwolla and your application. The correlationId will be passed along to a transfer that is created from an item and can be searched on. Must be less than 255 characters and contain no spaces. Acceptable characters are: `a-Z`, `0-9`, `-`, `.`, and `_`. |
| clearing | A clearing JSON object that contains `destination` key to expedite a transfer. [Reference the clearing JSON object to learn more](#clearing-json-object). |
| achDetails    | An [ACH details JSON object](#achdetails-object) which represents additional information sent along with a transfer created from a mass payment item to an originating or receiving financial institution. Details within this object can be used to reference a transaction that has settled with a financial institution. |
| processingChannel | A processingChannel JSON object that contains a key-value pair with a string key and string value of `destination` and `real-time-payments`. |

### amount JSON object

| Parameter | Required |  Type  | Description            |
|-----------|----------|--------|------------------------|
| value     |   yes    | string | Amount of money        |
| currency  |   yes    | string | Possible values: `USD` |

### clearing JSON object (mass payment)

The `clearing` object is used in tandem with our expedited transfers feature. This object does not need to be included if not using expedited transfers. Source specifies the processing time for the source bank funding source involved in the transfer, and can be used to downgrade the processing time from the default of Next-day ACH or to upgrade it to Same-day ACH on the debit portion of the mass payment into the Dwolla Network. Destination specifies the processing time for the destination funding source involved in the transfer, and can be used to upgrade the processing time from the default of Standard ACH to Same-day ACH on each mass payment item. 

> **Note:** The clearing request parameter is a premium feature available for [Dwolla](https://www.dwolla.com/platform) customers. Enabling Next-day ACH and Same-day ACH requires additional Dwolla approvals before getting started. Please contact [Sales](https://www.dwolla.com/contact?b=apidocs) or your account manager for more information on enabling this account setting.

| Parameter | Required | Type | Description |
|-----------|------------|------|-----------|
| source | no | string | Represents a clearing object for debits into the Dwolla network. <br> Possible values: `standard`, `next-available` <br> `standard` - Used to downgrade the clearing time of debits from the default of Next-day ACH (if enabled) to Standard ACH. <br> `next-available` - Used to upgrade the clearing time of debits to Same-day ACH. <br> **Note:** Cannot be used on individual [mass payment items](#mass-payment-item) as items represent a destination for the funds transfer. See [example masspayment request](#request-and-response-mass-payment-from-account-to-customers).  |
| destination | no | string | Represents a clearing object for credits out of the Dwolla network to a bank funding source. <br> Possible values: `next-available` <br> `next-available` - Used to upgrade the clearing time of credits to Same-day ACH. <br> **Note:** Can only be used on individual [mass payment items](#mass-payment-item). See [example masspayment request](#request-and-response-mass-payment-from-account-to-customers)|

#### Clearing example:

##### Same-day debit
```noselect
"clearing": {
  "source": "next-available"
}
```

##### Standard debit (if Next-day is enabled)

```noselect
"clearing": {
  "source": "standard"
}
```

### achDetails and addenda object

The addendum record is used to provide additional information to the payment recipient about the payment. This value will be passed in on a transfer request and can be exposed on a customer’s bank statement. Addenda records provide a unique opportunity to supply your customers with more information about their transactions. Allowing businesses to include additional details about the transaction—such as invoice numbers—provides their end users with more information about the transaction in the comfort of their own banking application.

##### achDetails object

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| source | no | object | Represents information that is sent to a source/originating bank account along with a transfer. Include information within this JSON object for customizing details on ACH debit transfers. Can include an [addenda JSON object](#addenda-object). |
| destination | no | object | Represents information that is sent to a destination/receiving bank account along with a transfer from a mass payment item. Include information within this JSON object for customizing details on ACH credit transfers. Can include an [addenda JSON object](#addenda-object).|

##### addenda object

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| addenda | no | object | An addenda object contains a `values` key which is an array of comma separated string addenda values. Addenda record information is used for the purpose of transmitting transfer-related information. Values must be less than or equal to 80 characters and can include spaces. Acceptable characters are: a-Z, 0-9, and special characters `- _ . ~! * ' ( ) ; : @ & = + $ , / ? % # [ ]`. *Will not show up on bank statements from balance-sourced transfers*. |

##### Source mass payment achDetails with addenda example:

```noselect
"achDetails": {
  "source": {
    "addenda": {
      "values": ["ABC123_AddendaValue"]
    }
  }
},
```

##### Destination mass payment item with achDetails and addenda example

```noselect
"achDetails": {
  "destination": {
    "addenda": {
      "values": ["ZYX987_AddendaValue"]
    }
  }
}
```

### HTTP status and error codes

| HTTP Status | Code            | Description        |
|-------------|-----------------|--------------------|
| 201         | Created         | A mass payment resource was created       |
| 400         | ValidationError | Can be: Items exceeded maximum count of 5000, Invalid amount, Invalid metadata, Invalid job item correlation ID, or Invalid funding source. |
| 401         | NotAuthorized   | OAuth token does not have Send scope.   |

### Request and response (mass payment from Account to Customers)

```raw
POST https://api-sandbox.dwolla.com/mass-payments
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
Idempotency-Key: 19051a62-3403-11e6-ac61-9e71128cae77

{
    "_links": {
        "source": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
        }
    },
    "achDetails": {
      "source": {
        "addenda": {
          "values": ["ABC123_AddendaValue"]
        }
      }
    },
    "clearing": {
      "source": "next-available"
    },
    "items": [
      {
        "_links": {
            "destination": {
                "href": "https://api-sandbox.dwolla.com/funding-sources/9c7f8d57-cd45-4e7a-bf7a-914dbd6131db"
            }
        },
        "amount": {
            "currency": "USD",
            "value": "1.00"
        },
        "clearing": {
          "destination": "next-available"
        },
        "metadata": {
            "payment1": "payment1"
        },
        "achDetails": {
          "destination": {
            "addenda": {
              "values": ["ZYX987_AddendaValue"]
            }
          }
        },
        "correlationId": "ad6ca82d-59f7-45f0-a8d2-94c2cd4e8841",
        "processingChannel": {
          "destination": "real-time-payments"
        }
      },
      {
        "_links": {
            "destination": {
                "href": "https://api-sandbox.dwolla.com/funding-sources/b442c936-1f87-465d-a4e2-a982164b26bd"
            }
        },
        "amount": {
            "currency": "USD",
            "value": "5.00"
        },
        "clearing": {
          "destination": "next-available"
        },
        "metadata": {
            "payment2": "payment2"
        },
        "achDetails": {
          "destination": {
            "addenda": {
              "values": ["ZYX987_AddendaValue"]
              }
            }
        }
      }
    ],
    "metadata": {
        "batch1": "batch1"
    },
    "correlationId": "6d127333-69e9-4c2b-8cae-df850228e130"
}

...

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/mass-payments/d093bcd1-d0c1-41c2-bcb5-a5cc011be0b7
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
request_body = {
  :_links => {
    :source => {
      :href => "https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
    }
  },
  :achDetails => {
    :source => {
      :addenda => {
        :values => ["ABC123_AddendaValue"]
      }
    }
  },
  :clearing => {
    :source => "standard"
  },
  :items => [
    {
      :_links => {
        :destination => {
          :href => "https://api-sandbox.dwolla.com/funding-sources/9c7f8d57-cd45-4e7a-bf7a-914dbd6131db"
        }
      },
      :amount => {
        :currency => "USD",
        :value => "1.00"
      },
      :clearing => {
        :destination => "next-available"
      },
      :metadata => {
        :payment1 => "payment1"
      },
      :correlationId => "ad6ca82d-59f7-45f0-a8d2-94c2cd4e8841",
      :achDetails => {
        :destination => {
          :addenda => {
            :values => ["ABC123_AddendaValue"]
          }
        }
      },
      :processingChannel => {
        :destination => "real-time-payments"
      }
    },
    {
      :_links => {
        :destination => {
          :href => "https://api-sandbox.dwolla.com/funding-sources/b442c936-1f87-465d-a4e2-a982164b26bd"
        }
      },
      :amount => {
        :currency => "USD",
        :value => "5.00"
      },
      :clearing => {
        :destination => "next-available"
      },
      :metadata => {
        :payment2 => "payment2"
      },
      :achDetails => {
        :destination => {
          :addenda => {
            :values => ["ABC123_AddendaValue"]
          }
        }
      }
    }
  ],
  :metadata => {
    :batch1 => "batch1"
  },
  :correlationId => "6d127333-69e9-4c2b-8cae-df850228e130"
}

mass_payment = app_token.post "mass-payments", request_body
mass_payment.response_headers[:location] # => "https://api-sandbox.dwolla.com/mass-payments/cf1e9e00-09cf-43da-b8b5-a43b3f6192d4"
```
```php
<?php
$massPaymentsApi = new DwollaSwagger\MasspaymentsApi($apiClient);

$massPayment = $massPaymentsApi->create([
  '_links' =>
  [
    'source' =>
    [
      'href' => 'https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4',
    ],
  ],
  'achDetails' =>
  [
    'source' => [
      'addenda' => [
        'values' => ['ABC123_AddendaValue']
      ]
    ]
  ],
  'clearing' =>
  [
    'source' => 'standard'
  ],
  'items' =>
  [
    [
      '_links' =>
      [
        'destination' =>
        [
          'href' => 'https://api-sandbox.dwolla.com/funding-sources/9c7f8d57-cd45-4e7a-bf7a-914dbd6131db',
        ],
      ],
      'amount' =>
      [
        'currency' => 'USD',
        'value' => '1.00',
      ],
      'clearing' =>
      [
        'destination' => 'next-available'
      ],
      'metadata' =>
      [
        'payment1' => 'payment1',
      ],
      'correlationId' => 'ad6ca82d-59f7-45f0-a8d2-94c2cd4e8841',
      'achDetails' =>
      [
        'source' => [
          'addenda' => [
            'values' => ['ABC123_AddendaValue']
          ]
        ]
      ],
      'processingChannel' => [
        'destination' => 'real-time-payments'
      ]
    ],
    [
      '_links' =>
      [
        'destination' =>
        [
          'href' => 'https://api-sandbox.dwolla.com/funding-sources/b442c936-1f87-465d-a4e2-a982164b26bd',
        ],
      ],
      'amount' =>
      [
        'currency' => 'USD',
        'value' => '5.00',
      ],
      'clearing' =>
      [
        'destination' => 'next-available'
      ],
      'metadata' =>
      [
        'payment2' => 'payment2',
      ],
      'achDetails' =>
      [
        'source' => [
          'addenda' => [
            'values' => ['ABC123_AddendaValue']
          ]
        ]
      ]
    ],
  ],
  'metadata' =>
  [
    'batch1' => 'batch1',
  ],
  'correlationId' => '6d127333-69e9-4c2b-8cae-df850228e130',
]);
$massPayment; # => "https://api-sandbox.dwolla.com/mass-payments/cf1e9e00-09cf-43da-b8b5-a43b3f6192d4"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
request_body = {
  '_links': {
    'source': {
      'href': 'https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4'
    }
  },
  'achDetails': {
    'addenda': {
      'values': ['ABC123_AddendaValue']
    }
  },
  'clearing': {
    'source': 'standard'
  },
  'items': [
    {
      '_links': {
        'destination': {
          'href': 'https://api-sandbox.dwolla.com/funding-sources/9c7f8d57-cd45-4e7a-bf7a-914dbd6131db'
        }
      },
      'amount': {
        'currency': 'USD',
        'value': '1.00'
      },
      'clearing': {
        'destination': 'next-available'
      },
      'metadata': {
        'payment1': 'payment1'
      },
      'correlationId': 'ad6ca82d-59f7-45f0-a8d2-94c2cd4e8841',
      'achDetails': {
        'addenda': {
          'values': ['ABC123_AddendaValue']
        }
      },
      'processingChannel': {
        'destination': 'real-time-payments'
      }
    },
    {
      '_links': {
        'destination': {
          'href': 'https://api-sandbox.dwolla.com/funding-sources/b442c936-1f87-465d-a4e2-a982164b26bd'
        }
      },
      'amount': {
        'currency': 'USD',
        'value': '5.00'
      },
      'clearing': {
        'destination': 'next-available'
      },
      'metadata': {
        'payment2': 'payment2'
      },
      'achDetails': {
        'addenda': {
          'values': ['ABC123_AddendaValue']
        }
      }
    }
  ],
  'metadata': {
    'batch1': 'batch1'
  },
  'correlationId': '6d127333-69e9-4c2b-8cae-df850228e130'
}

mass_payment = app_token.post('mass-payments', request_body)
mass_payment.headers['location'] # => 'https://api-sandbox.dwolla.com/mass-payments/cf1e9e00-09cf-43da-b8b5-a43b3f6192d4'
```
```javascript
var requestBody = {
  _links: {
    source: {
      href: 'https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4'
    }
  },
  achDetails: {
    source: {
      addenda: {
        values: ['ABC123_AddendaValue']
      }
    }
  },
  clearing: {
    source: 'standard'
  },
  items: [
    {
      _links: {
        destination: {
          href: 'https://api-sandbox.dwolla.com/funding-sources/9c7f8d57-cd45-4e7a-bf7a-914dbd6131db'
        }
      },
      amount: {
        currency: 'USD',
        value: '1.00'
      },
      clearing: {
        destination : 'next-available'
      },
      metadata: {
        payment1: 'payment1'
      },
      correlationId: 'ad6ca82d-59f7-45f0-a8d2-94c2cd4e8841',
      achDetails: {
        destination: {
          addenda: {
            values: ['ABC123_AddendaValue']
          }
        }
      },
      processingChannel: {
        destination: 'real-time-payments'
      }
    },
    {
      _links: {
        destination: {
          href: 'https://api-sandbox.dwolla.com/funding-sources/b442c936-1f87-465d-a4e2-a982164b26bd'
        }
      },
      amount: {
        currency: 'USD',
        value: '5.00'
      },
      clearing: {
        destination: 'next-available'
      },
      metadata: {
        payment2: 'payment2'
      },
      achDetails: {
        destination: {
          addenda: {
            values: ['ABC123_AddendaValue']
          }
        }
      }
    }
  ],
  metadata: {
    batch1: 'batch1'
  },
  correlationId: '6d127333-69e9-4c2b-8cae-df850228e130'
}

appToken
  .post('mass-payments', requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/mass-payments/cf1e9e00-09cf-43da-b8b5-a43b3f6192d4'
```

## Retrieve a mass payment

This section outlines how to retrieve a mass payment by its id. All mass payments will have a status of `pending` upon creation and will move to `processing` and finally `complete` as the service runs. It is recommended that you retrieve your [list of mass payment items](#list-items-for-a-mass-payment) when your mass payment has a status of `complete` to determine if any items failed to process successfully.

### HTTP request

`GET https://api.dwolla.com/mass-payments/{id}`

### Request parameters

| Parameter | Required | Type   | Description                                             |
|-----------|----------|--------|---------------------------------------------------------|
| id        | yes      | string | The id of the mass payment to retrieve information for. |

### HTTP status and error codes

| HTTP Status | Code     | Description             |
|-------------|----------|-------------------------|
| 404         | NotFound | Mass payment not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563"
    },
    "source": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
    },
    "items": {
      "href": "https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563/items"
    }
  },
  "id": "eb467252-808c-4bc0-b86f-a5cd01454563",
  "status": "processing",
  "created": "2016-03-18T19:44:16.000Z",
  "metadata": {}
}
```

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
mass_payment_url = "https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563"

mass_payment = app_token.get mass_payment_url
mass_payment.status # => "processing"
```

```php
<?php
$massPaymentUrl = 'https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563';

$massPaymentsApi = new DwollaSwagger\MasspaymentsApi($apiClient);

$massPayment = $massPaymentsApi->byId($massPaymentUrl);
$massPayment->status; # => "processing"
?>
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
mass_payment_url = 'https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563'

mass_payment = app_token.get(mass_payment_url)
mass_payment.body['status'] # => 'processing'
```

```javascript
var massPaymentUrl = 'https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563';

appToken
  .get(massPaymentUrl)
  .then(res => res.body.status); // => 'processing'
```

## Update a mass payment

This section covers how to update a mass payment's status to `pending` which triggers processing on a created and deferred mass payment, or `cancelled` which cancels a created and deferred mass payment.

### HTTP request

`POST https://api.dwolla.com/mass-payments/{id}`

### Request parameters

| Parameter | Required | Type   | Description                                                                                          |
|-----------|----------|--------|------------------------------------------------------------------------------------------------------|
| id        | yes      | string | id of mass payment to update.                                                                        |
| status    | yes      | string | Either `pending` or `cancelled` depending on the action you want to take on a deferred mass payment. |

### HTTP status and error codes

| HTTP Status | Code            | Description                                           |
|-------------|-----------------|-------------------------------------------------------|
| 404         | NotFound        | Mass payment not found.                               |
| 400         | ValidationError | Invalid status. Allowed types are pending, cancelled. |

### Request and response

```raw
POST https://api-sandbox.dwolla.com/mass-payments/692486f8-29f6-4516-a6a5-c69fd2ce854c
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "status": "pending"
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
mass_payment_url = 'https://api-sandbox.dwolla.com/mass-payments/692486f8-29f6-4516-a6a5-c69fd2ce854c'
request_body = {
      "status" => "pending",
}

mass_payment = app_token.post "#{mass_payment_url}", request_body
mass_payment.status # => "pending"
```
```php
/**
 *  No example for this language yet. Coming soon.
 **/
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
mass_payment_url = 'https://api-sandbox.dwolla.com/mass-payments/692486f8-29f6-4516-a6a5-c69fd2ce854c'
request_body = {
  'status': 'pending'
}

mass_payments = app_token.post('mass-payments', request_body)
mass_payments.body['status'] # => 'pending'
```
```javascript
var massPaymentUrl = 'https://api-sandbox.dwolla.com/mass-payments/692486f8-29f6-4516-a6a5-c69fd2ce854c';
var requestBody = {
  status: "pending"
};

appToken
  .post(massPaymentUrl, requestBody)
  .then(res => res.body.status); // => "pending"
```

## List items for a mass payment

A mass payment contains a list of payments called `items`. An `item` is distinct from the transfer which it creates. An item can contain a status of either `failed`, `pending`, or `success` depending on whether the payment was created by the Dwolla service or not. A mass payment item status of `success` is an indication that a transfer was successfully created. A mass payment's items will be returned in the `_embedded` object as a list of `items`.

### HTTP Request

`GET https://api.dwolla.com/mass-payments/{id}/items`

### Request parameters

| Parameter | Required | Type    | Description                                      |
|-----------|----------|---------|--------------------------------------------------|
| id        | yes      | string  | Mass payment unique identifier.                  |
| limit     | no       | integer | How many results to return. Defaults to 25.      |
| offset    | no       | integer | How many results to skip.                        |
| status    | no       | string  | Filter results on item status. Possible values: `failed`, `pending`, and `success`. Values delimited by `&status=` (i.e. - `/items?status=failed&status=pending`). |

### Mass payment item failures

Individual mass payment items can have a status of `failed`. If an item has a status of `failed`, an `_embedded` object will be returned within the item which contains a list of `errors`. Each error object includes a top-level error `code`, a `message` with a detailed description of the error, and a `path` which is a JSON pointer to the specific field in the request that has a problem. You can utilize both the failure code and message to get a better understanding of why the particular item failed.

| Code                    | Message               | Description |
|-------------------------|-----------------------|-------------|
| InsufficientFunds     | "Insufficient funds." | The `source` funding source has insufficient funds, and as a result failed to create a transfer. |
| Invalid     | "Receiver not found."   | The `destination` was not a valid Customer or Funding Source. |
| Invalid    | "Receiver cannot be the owner of the source funding source." | The `destination` of the transfer cannot be the same as the `source`.  |
| RequiresFundingSource | "Receiver requires funding source."  | The `destination` of the mass payment item does not have an active funding source attached.  |
| Restricted | "Receiver restricted." | The `destination` customer is either `deactivated` or `suspended` and is not eligible to receive funds. |

### HTTP status and error codes

| HTTP Status | Code      | Description                                |
|-------------|-----------|--------------------------------------------|
| 403         | Forbidden | Not authorized to list mass payment items. |
| 404         | NotFound  | Mass payment not found.                    |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563/items
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563/items"
    },
    "first": {
      "href": "https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563/items?limit=25&offset=0"
    },
    "last": {
      "href": "https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563/items?limit=25&offset=0"
    }
  },
  "_embedded": {
    "items": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/mass-payment-items/2f845bc9-41ed-e511-80df-0aa34a9b2388"
          },
          "mass-payment": {
            "href": "https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563"
          },
          "destination": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/b442c936-1f87-465d-a4e2-a982164b26bd"
          },
          "transfer": {
            "href": "https://api-sandbox.dwolla.com/transfers/fa3999db-41ed-e511-80df-0aa34a9b2388"
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
        },
        "processingChannel": {
          "destination": "real-time-payments"
        }
      },
      {
        "_links": {
            "self": {
                "href": "https://api-sandbox.dwolla.com/mass-payment-items/30845bc9-41ed-e511-80df-0aa34a9b2388",
                "type": "application/vnd.dwolla.v1.hal+json",
                "resource-type": "mass-payment-item"
            },
            "mass-payment": {
                "href": "https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563",
                "type": "application/vnd.dwolla.v1.hal+json",
                "resource-type": "mass-payment"
            },
            "destination": {
                "href": "https://api-sandbox.dwolla.com/funding-sources/b442c936-1f87-465d-a4e2-a982164b26bd",
                "type": "application/vnd.dwolla.v1.hal+json",
                "resource-type": "customer"
            }
        },
        "_embedded": {
            "errors": [
                {
                    "code": "RequiresFundingSource",
                    "message": "Receiver requires funding source.",
                    "path": "/items/destination/href",
                    "_links": {}
                }
            ]
        },
        "id": "30845bc9-41ed-e511-80df-0aa34a9b2388",
        "status": "failed",
        "amount": {
            "value": "0.02",
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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
mass_payment_url = 'https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563'

mass_payment_items = app_token.get "#{mass_payment_url}/items"
mass_payment_items.total # => 2
```
```php
<?php
$massPaymentUrl = 'https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563';

$massPaymentItemsApi = new DwollaSwagger\MasspaymentitemsApi($apiClient);

$massPaymentItems = $massPaymentItemsApi->getMassPaymentItems($massPaymentUrl);
$massPaymentItems->total; # => "2"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
mass_payment_url = 'https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563'

mass_payment_items = app_token.get('%s/items' % mass_payment_url)
mass_payment_items.body['total'] # => "2"
```
```javascript
var massPaymentUrl = 'https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563'

appToken
  .get(`${massPaymentUrl}/items`)
  .then(res => res.body.total); // => 2
```

## Retrieve a mass payment item

This section covers how to retrieve a mass payment item by its unique identifier. An item can contain `_links` to: the mass payment the item belongs to, the transfer created from the item, and the destination user.

### HTTP request

`GET https://api.dwolla.com/mass-payment-items/{id}`

### Request parameters

| Parameter | Required | Type   | Description |
|-----------|----------|--------|-------------------------------------------------------|
| id        | yes      | string | The id of the item to be retrieved in a mass payment. |

### HTTP status and error codes

| HTTP Status | Code      | Description                                |
|-------------|-----------|--------------------------------------------|
| 403         | Forbidden | Not authorized to list mass payment items. |
| 404         | NotFound  | Mass payment not found.                    |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/mass-payment-items/c1c7d293-63ec-e511-80df-0aa34a9b2388
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/mass-payment-items/c1c7d293-63ec-e511-80df-0aa34a9b2388"
    },
    "mass-payment": {
      "href": "https://api-sandbox.dwolla.com/mass-payments/eb467252-808c-4bc0-b86f-a5cd01454563"
    },
    "destination": {
      "href": "https://api-sandbox.dwolla.com/funding-sources/b442c936-1f87-465d-a4e2-a982164b26bd"
    },
    "transfer": {
      "href": "https://api-sandbox.dwolla.com/transfers/fa3999db-41ed-e511-80df-0aa34a9b2388"
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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
mass_payment_item_url = 'https://api-sandbox.dwolla.com/mass-payment-items/c1c7d293-63ec-e511-80df-0aa34a9b2388'

mass_payment_item = app_token.get mass_payment_item_url
mass_payment_item.status # => "success"
```
```php
<?php
$massPaymentItemUrl = 'https://api-sandbox.dwolla.com/mass-payment-items/c1c7d293-63ec-e511-80df-0aa34a9b2388';

$massPaymentItemsApi = new DwollaSwagger\MasspaymentitemsApi($apiClient);

$massPaymentItem = $massPaymentItemsApi->byId($massPaymentItemUrl);
$massPaymentItem->status; # => "success"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
mass_payment_item_url = 'https://api-sandbox.dwolla.com/mass-payment-items/c1c7d293-63ec-e511-80df-0aa34a9b2388'

mass_payment_item = app_token.get(mass_payment_item_url)
mass_payment_item.body['status'] # => 'success'
```
```javascript
var massPaymentItemUrl = 'https://api-sandbox.dwolla.com/mass-payment-items/c1c7d293-63ec-e511-80df-0aa34a9b2388';

appToken
  .get(massPaymentItemUrl)
  .then(res => res.body.status); // => 'success'
```

## List mass payments for a customer

This section covers how to retrieve a [verified Customer's](#customers) list of previously created mass payments. Mass payments are returned ordered by date created, with most recent mass payments appearing first.

### HTTP request
`GET https://api.dwolla.com/customers/{id}/mass-payments`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Customer unique identifier to get mass payments for. |
| limit | no | integer | How many results to return. Defaults to 25. |
| offset | no | integer | How many results to skip. |
| correlationId | no | string | A string value to search on if a correlationId was specified on a mass payment. |

### HTTP status and error codes
| HTTP Status | Code | Description |
|--------------|-------------|------------------------|
| 403 | NotAuthorized | Not authorized to list mass payments. |
| 404 | NotFound | Customer not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/customers/39e21228-5958-4c4f-96fe-48a4bf11332d/mass-payments
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

....

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/customers/39e21228-5958-4c4f-96fe-48a4bf11332d/mass-payments"
    },
    "first": {
      "href": "https://api-sandbox.dwolla.com/customers/39e21228-5958-4c4f-96fe-48a4bf11332d/mass-payments?limit=25&offset=0"
    },
    "last": {
      "href": "https://api-sandbox.dwolla.com/customers/39e21228-5958-4c4f-96fe-48a4bf11332d/mass-payments?limit=25&offset=0"
    }
  },
  "_embedded": {
    "mass-payments": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/mass-payments/89ca72d2-63bf-4a8f-92ef-a5d00140aefa"
          },
          "source": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/e1c972d4-d8d9-4c30-861a-9081dcbaf4ab"
          },
          "items": {
            "href": "https://api-sandbox.dwolla.com/mass-payments/89ca72d2-63bf-4a8f-92ef-a5d00140aefa/items"
          }
        },
        "id": "89ca72d2-63bf-4a8f-92ef-a5d00140aefa",
        "status": "complete",
        "created": "2016-03-21T19:27:34.000Z",
        "metadata": {
          "masspay1": "masspay1"
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
customer_url = 'https://api-sandbox.dwolla.com/customers/ca32853c-48fa-40be-ae75-77b37504581b'

mass_payments = app_token.get "#{customer_url}/mass-payments", limit: 10
mass_payments._embedded['mass-payments'][0].status # => "complete"
```
```php
<?php
$customerUrl = 'http://api-sandbox.dwolla.com/customers/01B47CB2-52AC-42A7-926C-6F1F50B1F271';

$masspaymentsApi = new DwollaSwagger\MasspaymentsApi($apiClient);

$masspayments = $masspaymentsApi->getByCustomer($customerUrl);
$masspayments->_embedded->{'mass-payments'}[0]->status; # => "complete"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/ca32853c-48fa-40be-ae75-77b37504581b'

mass_payments = app_token.get('%s/mass-payments' % customer_url)
mass_payments.body['_embedded']['mass-payments'][0]['status'] # => 'complete'
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/ca32853c-48fa-40be-ae75-77b37504581b';

appToken
  .get(`${customerUrl}/mass-payments`, { limit: 10 })
  .then(res => res.body._embedded['mass-payments'][0].status); // => "complete"
```

* * *
