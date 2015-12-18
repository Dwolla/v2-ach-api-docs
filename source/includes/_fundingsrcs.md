# Funding Sources

Add and retrieve ACH bank accounts via Funding Sources, which are available to the `Customers` and `Accounts` resources.  Customers can have a maximum of 6 funding sources.

### Funding Source Resource

Parameter | Description
----------|------------
id | The funding source unique identifier.
status | Is the funding source verified?
type | Type of funding source.
name | Arbitrary nickname for the funding source.
created | ISO-8601 timestamp.

```noselect
{
    "routingNumber": "87654321",
    "accountNumber": "12345678",
    "type": "checking",
    "name": "My Bank"
}
```

## New Funding Source (Customer)

Create a new Funding Source for a Customer.  Customers can have a maximum of 6 funding sources.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth access token with the `ManageCustomers` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP Request
`POST https://api.dwolla.com/customers/{id}/funding-sources`

### Request Parameters
Parameter | Optional? | Description
----------|------------|------------
routingNumber | no | The bank account's routing number.
accountNumber | no | The bank account number.
type | no | Type of bank account: `checking` or `savings`.
name | no | Arbitrary nickname for the funding source.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 400 | Duplicate funding source or validation error.
| 403 | Not authorized to create funding source.

### Request and Response:

```raw
POST /customers/99bfb139-eadd-4cdf-b346-7504f0c16c60/funding-sources
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
{
    "routingNumber": "222222226",
    "accountNumber": "123456789",
    "type": "checking",
    "name": "John Doe - Checking"
}

HTTP/1.1 201 Created
Location: https://api.dwolla.com/funding-sources/AB443D36-3757-44C1-A1B4-29727FB3111C
```
```php
<?php
$fundingApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$new_fs = $fundingApi->createCustomerFundingSource(
       ["routingNumber": "222222226",
        "accountNumber": "123456789",
        "type": "checking",
        "name": "John Doe - Checking"], "https://api-uat.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C");

print($new_fs); # => https://api-uat.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31
?>
```
```ruby
new_fs = DwollaSwagger::FundingsourcesApi.create_customer_funding_source \ 
('https://api-uat.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C', {:body => {
                                                    :routingNumber => '222222226',
                                                    :accountNumber => '123456789',
                                                    :type => 'checking',
                                                    :name => 'John Doe - Checking'
                                                 }})

p new_fs # => https://api-uat.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31
```
```python
funding_api = dwollaswagger.FundingsourcesApi(client)

new_fs = funding_api.create_customer_funding_source('https://api-uat.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C', body = {"routingNumber": "222222226",
        "accountNumber": "123456789",
        "type": "checking",
        "name": "John Doe - Checking"})

p new_fs # => https://api-uat.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31
```
```javascript
dwolla.then(function(dwolla) {
    dwolla['funding-sources'].createFundingSource({
      "routingNumber": "222222226",
      "accountNumber": "123456789",
      "type": "checking",
      "name": "John Doe - Checking"
    }).then(function(data) {
       console.log(data); // https://api-uat.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31
    });
});
```

## List Funding Sources (Customer)

Retrieve a list of Funding Sources that belong to a Customer.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth access token with the `ManageCustomers` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP Request
`
GET https://api.dwolla.com/customers/{id}/funding-sources
`

### Request Parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | Customer unique identifier.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 403 | Not authorized to list funding sources.
| 404 | Customer not found. |

### Request and Response

```raw
GET https://api.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733/funding-sources
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733/funding-sources"
    },
    "customer": {
      "href": "https://api.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733"
    }
  },
  "_embedded": {
    "funding-sources": [
      {
        "_links": {
          "self": {
            "href": "https://api.dwolla.com/funding-sources/ab9cd5de-9435-47af-96fb-8d2fa5db51e8"
          },
          "customer": {
            "href": "https://api.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733"
          },
          "with-available-balance": {
            "href": "https://api.dwolla.com/funding-sources/ab9cd5de-9435-47af-96fb-8d2fa5db51e8"
          }
        },
        "id": "ab9cd5de-9435-47af-96fb-8d2fa5db51e8",
        "status": "verified",
        "type": "balance",
        "name": "Balance",
        "created": "2015-10-02T21:00:28.153Z"
      },
      {
        "_links": {
          "self": {
            "href": "https://api.dwolla.com/funding-sources/98c209d3-02d6-4bee-bc0f-61e18acf0e33"
          },
          "customer": {
            "href": "https://api.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733"
          }
        },
        "id": "98c209d3-02d6-4bee-bc0f-61e18acf0e33",
        "status": "verified",
        "type": "bank",
        "name": "John Doe - Checking account1",
        "created": "2015-10-02T22:03:45.537Z"
      }
    ]
  }
}
```
```ruby
customer = 'https://api.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733'

acct_fs = DwollaSwagger::FundingsourcesApi.get_customer_transfers(customer)
p acct_fs[0].name # => "John Doe - Checking account1"
```
```php
<?php
$customer = 'https://api.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733';

$fsApi = DwollaSwagger\FundingsourcesApi($apiClient);

$acctFs = $fsApi->getcustomerTransfers($customer);
print($acctFs[0]->name); # => "John Doe - Checking account1"
?>
```
```python
customer = 'https://api.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733'

fs_api = dwollaswagger.FundingsourcesApi(client)
acct_fs = fs_api.get_customer_transfers(customer)

print(acct_fs[0].name) # => John Doe - Checking account1
```
```javascript
dwolla.then(function(dwolla) {
    dwolla['funding-sources'].getCustomerFundingSources()
    .then(function(data) {
       console.log(data.obj._embedded[0].name); // John Doe - Checking account1
    });
});
```

## New Funding Source (Account)

Create a new Funding Source for an Account.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth access token with the `Funding` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP Request
`POST https://api.dwolla.com/funding-sources`

### Request Parameters
Parameter | Description
----------|------------
accountNumber | The bank account number.
routingNumber | The bank account's routing number.
type | Type of bank account: `checking` or `savings`.
name | Arbitrary nickname for the funding source.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 400 | Duplicate funding source or validation error.
| 403 | Not authorized to create funding source.


### Request and Response

```noselect
POST /funding-sources
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
{
    "routingNumber": "87654321",
    "accountNumber": "12345678",
    "type": "checking",
    "name": "My Bank"
}

...

HTTP/1.1 201 Created
Location: https://api-uat.dwolla.com/funding-sources/04173e17-6398-4d36-a167-9d98c4b1f1c3
```

## List Funding Sources (Account)

Retrieve a list of Funding Sources that belong to an Account.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth access token with the `Funding` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP Request
`
GET https://api.dwolla.com/accounts/{id}/funding-sources
`

### Request Parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | Account unique identifier to get funding sources for.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 403 | Not authorized to list funding sources.

### Request and Response:

```raw
GET https://api-uat.dwolla.com/accounts/4BB512E4-AD4D-4F7E-BFD0-A232007F21A1/funding-sources
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer 0Sn0W6kzNicvoWhDbQcVSKLRUpGjIdlPSEYyrHqrDDoRnQwE7Q

...

{
  "_links": {
    "self": {
      "href": "https://api-uat.dwolla.com/accounts/4bb512e4-ad4d-4f7e-bfd0-a232007f21a1/funding-sources"
    }
  },
  "_embedded": {
    "funding-sources": [
      {
        "_links": {
          "self": {
            "href": "https://api-uat.dwolla.com/funding-sources/0094b1b4-e171-4dc8-865b-cb121c2377bb"
          },
          "account": {
            "href": "https://api-uat.dwolla.com/accounts/4bb512e4-ad4d-4f7e-bfd0-a232007f21a1"
          },
          "with-available-balance": {
            "href": "https://api-uat.dwolla.com/funding-sources/0094b1b4-e171-4dc8-865b-cb121c2377bb"
          }
        },
        "id": "0094b1b4-e171-4dc8-865b-cb121c2377bb",
        "status": "verified",
        "type": "balance",
        "name": "Balance",
        "created": "2013-09-07T14:42:52.000Z"
      },
      {
        "_links": {
          "self": {
            "href": "https://api-uat.dwolla.com/funding-sources/5cfcdc41-10f6-4a45-b11d-7ac89893d985"
          },
          "account": {
            "href": "https://api-uat.dwolla.com/accounts/4bb512e4-ad4d-4f7e-bfd0-a232007f21a1"
          }
        },
        "id": "5cfcdc41-10f6-4a45-b11d-7ac89893d985",
        "status": "verified",
        "type": "bank",
        "name": "Checking account",
        "created": "2014-09-04T23:19:19.543Z"
      }
    ]
  }
}
```
```ruby
funding_sources = DwollaSwagger::FundingsourcesApi.get_account_funding_sources('https://api-uat.dwolla.com/accounts/0270baed-dda5-46d0-b074-e7f3d478896f')

p funding_sources._embedded[0].name # => "Balance"
```
```javascript
dwolla.then(function(dwolla) {
    dwolla['funding-sources'].getAccountFundingSources()
    .then(function(data) {
       console.log(data.obj._embedded[0].name); // Balance
    });
});
```
```python
funding_api = dwollaswagger.FundingsourcesApi(client)
funding_sources = funding_api.id('https://api-uat.dwolla.com/accounts/0270baed-dda5-46d0-b074-e7f3d478896f')

print(funding_sources._embedded[0].name) # => "Balance"
```
```php
<?php
$fundingApi = new DwollaSwagger\FundingsourcesApi($apiClient);
$fundingSources = $fundingApi->id('https://api-uat.dwolla.com/accounts/0270baed-dda5-46d0-b074-e7f3d478896f')

print($fundingSources->_embedded[0].name) # => "Balance"
?>
```

## Get a Funding Source by ID

Retrieve a Funding Source by ID.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth access token with the `Funding` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP Request
`
GET https://api.dwolla.com/funding-sources/{id}
`

### Request Parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | Funding source ID to get.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Funding source not found. |

### Request and Response:

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
fund_source = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

retrieved = DwollaSwagger::FundingsourcesApi.id(fund_source)
p retrieved.name # => "Test checking account"
```
```php
<?php
$fund_source = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';

$fsApi = DwollaSwagger\FundingsourcesApi($apiClient);

$retrieved = $fsApi->id($fund_source);
print($retrieved->name); # => "Test checking account"
?>
```
```python
fund_source = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

fs_api = dwollaswagger.FundingsourcesApi(client)
retrieved = fs_api.id(fund_source)

print(retrieved.name) # => Test checking account
```
```javascript
dwolla.then(function(dwolla) {
    dwolla['funding-sources'].id({id: '692486f8-29f6-4516-a6a5-c69fd2ce854c'})
    .then(function(data) {
       console.log(data.obj._embedded.name); // Test checking account
    });
});
```

## Initiate or Verify Micro-deposits

Initiate or verify micro-deposits for bank account verification. Reference the [funding source verification](https://developers.dwolla.com/resources/funding-source-verification.html) resource article for more information on the micro-deposit method of bank account verification.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth access token with the `Funding` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP Request
`
POST https://api.dwolla.com/funding-sources/{id}/micro-deposits
`

### Request Parameters

Parameter | Optional? | Description
----------|------------|-------------
amount1 | no | An amount JSON object of first micro-deposit. Contains `value` and `currency`.
amount2 | no | An amount JSON object of first micro-deposit. Contains `value` and `currency`.


### Errors
| HTTP Status | Message |
|--------------|-------------|
| 200 | Micro deposits verified.  |
| 201 | Micro deposits initiated. |
| 400 | Funding source not found. |
| 404 | Funding source not found. |

> Request and Response (Initiate)

```raw
POST /funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909/micro-deposits
Authorization: Bearer 8tJjM7iTjujLthkbVPMUcHLqMNw4uv5kG712g9j1RRBHplGpwo
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Cache-Control: no-cache

HTTP 200 OK
```
```ruby
DwollaSwagger::FundingsourcesApi.micro_deposits(new_fs)
```
```javascript
dwolla.then(function(dwolla) {
    dwolla['funding-sources'].microDeposits()
    .then(function(data) {
       console.log(data.status); // 200
    });
});
```
```python
fs_api = dwollaswagger.FundingsourcesApi(client)
fs_api.micro_deposits(new_fs)
```
```php
<?php
$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);
$fsApi->micro_deposits($new_fs);
?>
```

> Request and Response (Verify):

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
DwollaSwagger::FundingsourcesApi.verify_micro_deposits_exist(new_fs, {
    "amount1" => {
           "value" => "0.03",
        "currency" => "USD"
    },
    "amount2" => {
           "value" => "0.09",
        "currency" => "USD"
    }
})
```
```javascript
dwolla.then(function(dwolla) {
    dwolla['funding-sources'].verifyMicroDepositsExist({id: 'e52006c3-7560-4ff1-99d5-b0f3a6f4f909', body: {
        "amount1": {
            "value": "0.03",
            "currency": "USD"
        },
        "amount2": {
            "value": "0.09",
            "currency": "USD"
        }
    }})
    .then(function(data) {
       console.log(data.status); // 200
    });
});
```
```python
fs_api = dwollaswagger.FundingsourcesApi(client)

fs_api.verify_micro_deposits_exist(new_fs, {
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
$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fsApi->verify_micro_deposits_exist($new_fs, array (
  'amount1' => 
  array (
    'value' => '0.03',
    'currency' => 'USD',
  ),
  'amount2' => 
  array (
    'value' => '0.09',
    'currency' => 'USD',
  ),
));
?>
```

## Verify Pending Micro-deposits Exist

Check if pending verification for micro-deposits exists.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth access token with the `Funding` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP Request
`GET https://api.dwolla.com/funding-sources/{id}/micro-deposits`

### Request Parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | Funding source ID to check status of validation deposits.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 200 | Pending micro-deposits exist. |

> Request:

```shell
GET /funding-sources/ab9cd5de-9435-47af-96fb-8d2fa5db51e8
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
```

> Response:

```json
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

## Remove a Funding Source

Remove a Funding Source by ID.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth access token with the `Funding` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP Request
`
DELETE https://api.dwolla.com/funding-sources/{id}
`

### Request Parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | Funding source ID to delete.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Funding source not found. |

### Request and Response

```raw
DELETE /funding-sources/6c8ac833-444a-4eff-979c-c56cef6be26b
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

HTTP 200 OK
```
```ruby
fund_source = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

DwollaSwagger::FundingsourcesApi.delete(fund_source)
```
```php
<?php
$fund_source = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';

$fsApi = DwollaSwagger\FundingsourcesApi($apiClient);

$fsApi->delete($fund_source);
?>
```
```python
fund_source = 'https://api.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'

fs_api = dwollaswagger.FundingsourcesApi(client)
fs_api.delete(fund_source)
```
```javascript
dwolla.then(function(dwolla) {
    dwolla['funding-sources'].delete({id: '692486f8-29f6-4516-a6a5-c69fd2ce854c'})
    .then(function(data) {
       console.log(data.status); // 200
    });
});
```
