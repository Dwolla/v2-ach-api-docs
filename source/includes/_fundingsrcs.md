# Funding sources

Add and retrieve ACH bank account information via funding sources. Funding sources can be created for both the [Dwolla Master Account](#create-a-funding-source-for-an-account) and [Customer](#create-a-funding-source-for-a-customer) resources.

### Funding source types

The two funding source types available with a Dwolla integration include a `bank`, and the Dwolla `balance`. Type `bank` represents any bank account attached as a funding source to Account and Customer resources. Type `balance` represents the Dwolla Balance made available to Account and Verified Customer resources.

##### Balance funding source

The [Dwolla Balance](https://developers.dwolla.com/resources/balance-funding-source.html) can be utilized as a digital "wallet", storing USD funds for the Customer or Account with Dwolla’s financial institution partners. Additionally, the Dwolla Balance can be pre-loaded with funds for quicker outgoing ACH transfers to destination funding sources. To get a more in-depth overview of the Dwolla Balance, including functionality and other benefits, check out our [developer resource article](https://developers.dwolla.com/resources/balance-funding-source.html) or view our [webinar](https://www.dwolla.com/resources/balance-webinar/).

##### Bank funding source

Funding sources of type `bank` include an additional attribute, `bankAccountType`, denoting the type of the bank account being attached. The bank account types currently supported by Dwolla include `checking`, `savings`, `general-ledger` and `loan`.

 - `checking`, `savings` - Checking and savings accounts can be attached to any Customer type. These account types are enabled for all Accounts and Customers, by default.

 - `general-ledger` - General ledger accounts can only be attached to exempt Business Verified Customers. **Note**: Enabling this account type requires additional Dwolla approvals before getting started. Please contact [Sales](https://www.dwolla.com/contact?b=apidocs) or your account manager for more information on enabling this account type.

 - `loan` - Loan accounts can only be attached to Verified Customers. These funding-sources can only be credited, meaning funds can only be sent to these accounts. **Note**: Enabling this account type requires additional Dwolla approvals before getting started. Please contact [Sales](https://www.dwolla.com/contact?b=apidocs) or your account manager for more information on enabling this account type.

### Funding source links

| Link                       | Description                                                                   |
|----------------------------|-------------------------------------------------------------------------------|
| self                       | URL of the funding source resource.                                           |
| customer                   | GET this link to [retrieve details](#retrieve-a-customer) of the Customer.                            |
| remove                     | POST to this link to [remove the funding source](#remove-a-funding-source) from the Customer.                |
| balance                    | (Verified Customer only) GET this link to [retrieve the amount available in the balance](#retrieve-a-funding-source-balance) of the Customer's Balance funding source. |
| transfer-from-balance      | (Verified Customer only) if this link exists, the Customer can transfer funds from their balance. |
| transfer-to-balance        | (Verified Customer only) if this link exists, funds can be transferred to the Customer's balance. |
| transfer-send              | If this link exists, the Customer can send funds to another Customer. |
| transfer-receive           | The Customer can receive funds from another Customer.            |
| initiate-micro-deposits    | POST to this link to [initiate micro-deposits](#initiate-micro-deposits) on an unverified funding source. |
| verify-micro-deposits      | Micro-deposits have completed to this funding source and are eligible for verification. POST to this link with the [verify micro-deposit amounts](#verify-micro-deposits) and complete bank funding source verification. |
| failed-verification-micro-deposits | Micro-deposits attempts have failed due to too many failed attempts. [Remove the bank and re-add to attempt verification again.](https://developers.dwolla.com/resources/funding-source-verification/micro-deposit-verification.html) |

### Funding source resource

| Parameter | Description |
|-----------|-------------|
| id | The funding source unique identifier. |
| status | Possible values are `unverified` or `verified`. Determines if the funding source has completed verification. |
| type | Type of funding source. Possible values are `bank` or `balance`. |
| bankAccountType | An attribute for `bank` funding sources that determines the type of account. Possible values are `checking`, `savings`, `general-ledger` or `loan`. |
| name | Arbitrary nickname for the funding source. |
| created | ISO-8601 timestamp for when the funding source was created. |
| balance | An optional object that includes `value` and `currency` parameters. `value` is a string value for the amount available and `currency` is a string value currency code. Only returned for a Dwolla API Customer account balance.   |
| removed | Determines if the funding source has been [removed](#remove-a-funding-source). A boolean `true` if the funding source was removed or `false` if the funding source is not removed. |
| channels | List of processing channels.  ACH is the default processing channel for bank transfers. Possible values are `ach` or `wire`. |
| bankName | The financial institution name. |
| iavAccountHolders | An optional object that includes optional `selected` and `other` parameters. `selected`, a string with the account holder name(s) on file with the financial institution for the IAV selected account. `other`, a list of strings with name(s) of other accounts on file. Only returned for a Customer that added a bank using Dwolla IAV, and if names are returned for the selected bank account. |
| fingerprint | Fingerprint is an optional unique identifying string value returned for funding sources of type `bank`. This attribute can be used to check across all Dwolla API Customers if two bank accounts share the same account number and routing number. Removing a funding source does not remove the `fingerprint`. |

```noselect
{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/fc84223a-609f-42c9-866e-2c98f17ab4fb",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "funding-source"
        },
        "customer": {
            "href": "https://api-sandbox.dwolla.com/customers/241ec287-8d7a-4b69-911e-ffbea98d75ce",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        }
    },
    "id": "fc84223a-609f-42c9-866e-2c98f17ab4fb",
    "status": "verified",
    "type": "bank",
    "bankAccountType": "checking",
    "name": "Your Account #1 - CHECKING",
    "created": "2017-08-16T20:06:34.000Z",
    "removed": false,
    "channels": [
        "ach"
    ],
    "bankName": "SANDBOX TEST BANK",
    "iavAccountHolders": {
        "selected": "account holder",
        "other": [
          "Jane Doe",
          "GeneriCompany LLC"
        ]
    },
    "fingerprint": "4cf31392f678cb26c62b75096e1a09d4465a801798b3d5c3729de44a4f54c794"
}
```

## Create a funding source for a customer

There are two methods available for adding a bank or credit union account to a Customer. You can either collect the Customer's bank account information and pass it to Dwolla via the [new Customer funding source](#create-a-funding-source-for-a-customer) endpoint, or you can send the Customer through the the [Instant Account Verification](https://developers.dwolla.com/resources/dwolla-js.html) (IAV) flow which will add and verify a bank account within seconds.

Before a Dwolla account or Dwolla API Customer is eligible to transfer money from their bank or credit union account they need to verify ownership of the account, either via Instant Account Verification (IAV) or micro-deposits. For more information on bank account verification, reference this [funding source verification](https://developers.dwolla.com/resources/funding-source-verification.html) resource article.

Customers can have a maximum of 6 funding sources.

### HTTP request

`POST https://api.dwolla.com/customers/{id}/funding-sources`

### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| _links | no | object | A <code>_links</code> JSON object containing an `on-demand-authorization` link relation. See example raw request and response below. |
| routingNumber | yes | string | The bank account's routing number. **Note:** The routing number is validated to check if it consists of 9 digits, and the first two digits are in a certain range. |
| accountNumber | yes | string | The bank account number. **Note:** The account number is validated to check if it is a numeric string of 4-17 digits. |
| bankAccountType | yes | string | Type of bank account: `checking`, `savings`, `general-ledger` or `loan`. |
| name | yes | string | Arbitrary nickname for the funding source. Must be 50 characters or less. |
| plaidToken | no | string | A processor token obtained from Plaid for `adding and verifying` a bank. Reference our [Plaid Link Developer Resource Article](https://developers.dwolla.com/resources/dwolla-plaid-integration.html) to learn more about this integration. |
| channels | no | array | An array containing a list of processing channels.  ACH is the default processing channel for bank transfers. Acceptable value for channels is: "wire". e.g. `“channels”: [ “wire” ]`. A funding source (Bank Account) added using the wire channel only supports a funds transfer going to the bank account from a balance. As a result, wire as a destination funding source can only be added where the Customer account type is a Verified Customer. **Note:** `channels` is a premium feature that must be enabled on your account and is only available to select [Dwolla](https://www.dwolla.com/platform) customers. |

### HTTP status and error codes

| HTTP Status | Code | Description |
|--------------|-------------|-------------------|
| 400 | ValidationError | Can be: Duplicate funding source or validation error. Authorization already associated to a funding source. |
| 403 | Forbidden | Not authorized to create funding source. |

### Request and response

```raw
POST https://api-sandbox.dwolla.com/customers/99bfb139-eadd-4cdf-b346-7504f0c16c60/funding-sources
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
{
  "routingNumber": "222222226",
  "accountNumber": "123456789",
  "bankAccountType": "checking",
  "name": "Jane Doe’s Checking"
}

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/funding-sources/AB443D36-3757-44C1-A1B4-29727FB3111C
```
```php
<?php
$fundingApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fundingSource = $fundingApi->createCustomerFundingSource([
  "routingNumber" => "222222226",
  "accountNumber" => "123456789",
  "bankAccountType" => "checking",
  "name" => "Jane Doe’s Checking"
], "https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C");
$fundingSource; # => "https://api-sandbox.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
request_body = {
  routingNumber: '222222226',
  accountNumber: '123456789',
  bankAccountType: 'checking',
  name: 'Jane Doe’s Checking'
}

funding_source = app_token.post "#{customer_url}/funding-sources", request_body
funding_source.response_headers[:location] # => "https://api-sandbox.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
request_body = {
  'routingNumber': '222222226',
  'accountNumber': '123456789',
  'bankAccountType': 'checking',
  'name': 'Jane Doe’s Checking'
}

customer = app_token.post('%s/funding-sources' % customer_url, request_body)
customer.headers['location'] # => 'https://api-sandbox.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31'
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C';
var requestBody = {
  'routingNumber': '222222226',
  'accountNumber': '123456789',
  'bankAccountType': 'checking',
  'name': 'Jane Doe’s Checking'
};

appToken
  .post(`${customerUrl}/funding-sources`, requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31'
```

## Create a funding sources token for dwolla.js

Dwolla.js is a client-side library that allows you `add` a funding source for your Customer without having any sensitive data hit your server. This section details how to create a token that will be sent to the client and used to authenticate the HTTP request asking Dwolla to `add` a new funding source.

Refer to our [Dwolla.js developer resource article](https://developers.dwolla.com/resources/dwolla-js/add-a-bank-account.html) to learn more on how to utilize this single-use funding-sources-token to `add` funding source for a Customer.

### HTTP Request

`POST https://api.dwolla.com/customers/{id}/funding-sources-token`

### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Customer unique identifier. |

### HTTP status and error codes

| HTTP Status | Message |
|--------------|-------------|
| 404 | Customer not found. |

### Request and response

```raw
POST https://api-sandbox.dwolla.com/customers/99bfb139-eadd-4cdf-b346-7504f0c16c60/funding-sources-token
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

HTTP/1.1 200 OK

{
 "_links": {
   "self": {
     "href": "https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733/funding-sources-token"
   }
 },
 "token": "4adF858jPeQ9RnojMHdqSD2KwsvmhO7Ti7cI5woOiBGCpH5krY"
}
```

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/06b51d56-7a6c-4535-a0cc-2c0106f56ba6'

fs_token = app_token.post "#{customer_url}/funding-sources-token"
fs_token.token # => "lr0Ax1zwIpeXXt8sJDiVXjPbwEeGO6QKFWBIaKvnFG0Sm2j7vL"
```

```javascript
// Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
var customerUrl = 'https://api-sandbox.dwolla.com/customers/06b51d56-7a6c-4535-a0cc-2c0106f56ba6';

appToken
 .post(`${customerUrl}/funding-sources-token`)
 .then(res => res.body.token); // => 'lr0Ax1zwIpeXXt8sJDiVXjPbwEeGO6QKFWBIaKvnFG0Sm2j7vL'
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'http://api.dwolla.com/customers/06b51d56-7a6c-4535-a0cc-2c0106f56ba6'

app_token.post('%s/funding-sources-token' % customer_url)
```

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$fsToken = $customersApi->createFundingSourcesTokenForCustomer("https://api-sandbox.dwolla.com/customers/06b51d56-7a6c-4535-a0cc-2c0106f56ba6");
$fsToken->token; # => "lr0Ax1zwIpeXXt8sJDiVXjPbwEeGO6QKFWBIaKvnFG0Sm2j7vL"
?>
```

## Create an IAV token for dwolla.js

Dwolla.js is a client-side library that allows you `add and verify` a funding source for your Customer without having any sensitive data hit your server. This section details how to create a token that will be sent to the client and used to authenticate the HTTP request asking Dwolla to `add and verify` a new funding source.

Refer to our [Dwolla.js developer resource article](https://developers.dwolla.com/resources/dwolla-js/instant-account-verification.html) to learn more on how to utilize this single-use iav-token to `add and verify` a funding source for a Customer.

### HTTP Request

`POST https://api.dwolla.com/customers/{id}/iav-token`

### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Customer unique identifier. |

### HTTP status and error codes

| HTTP Status | Message |
|--------------|-------------|
| 404 | Customer not found. |

### Request and response

```raw
POST https://api-sandbox.dwolla.com/customers/99bfb139-eadd-4cdf-b346-7504f0c16c60/iav-token
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

HTTP/1.1 200 OK

{
 "_links": {
   "self": {
     "href": "https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733/iav-token"
   }
 },
 "token": "4adF858jPeQ9RnojMHdqSD2KwsvmhO7Ti7cI5woOiBGCpH5krY"
}
```

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/06b51d56-7a6c-4535-a0cc-2c0106f56ba6'

customer = app_token.post "#{customer_url}/iav-token"
customer.token # => "lr0Ax1zwIpeXXt8sJDiVXjPbwEeGO6QKFWBIaKvnFG0Sm2j7vL"
```

```javascript
// Using dwolla-v2 - https://github.com/Dwolla/dwolla-v2-node
var customerUrl = 'https://api-sandbox.dwolla.com/customers/06b51d56-7a6c-4535-a0cc-2c0106f56ba6';

appToken
 .post(`${customerUrl}/iav-token`)
 .then(res => res.body.token); // => 'lr0Ax1zwIpeXXt8sJDiVXjPbwEeGO6QKFWBIaKvnFG0Sm2j7vL'
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'http://api.dwolla.com/customers/06b51d56-7a6c-4535-a0cc-2c0106f56ba6'

app_token.post('%s/iav-token' % customer_url)
```

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$iavToken = $customersApi->getCustomerIavToken("https://api-sandbox.dwolla.com/customers/06b51d56-7a6c-4535-a0cc-2c0106f56ba6");
$iavToken->token; # => "lr0Ax1zwIpeXXt8sJDiVXjPbwEeGO6QKFWBIaKvnFG0Sm2j7vL"
?>
```

## Retrieve a funding source

This section covers how to retrieve a funding source by id.

### HTTP request
`GET https://api.dwolla.com/funding-sources/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | id of funding source to retrieve. |

### HTTP status and error codes
| HTTP Status | Message |
|--------------|-------------|
| 404 | Funding source not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/funding-sources/49dbaa24-1580-4b1c-8b58-24e26656fa31
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/49dbaa24-1580-4b1c-8b58-24e26656fa31",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "funding-source"
        },
        "customer": {
            "href": "https://api-sandbox.dwolla.com/customers/4594a375-ca4c-4220-a36a-fa7ce556449d",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        },
        "initiate-micro-deposits": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/49dbaa24-1580-4b1c-8b58-24e26656fa31/micro-deposits",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "micro-deposits"
        }
    },
    "id": "49dbaa24-1580-4b1c-8b58-24e26656fa31",
    "status": "unverified",
    "type": "bank",
    "bankAccountType": "checking",
    "name": "Test checking account",
    "created": "2017-09-26T14:14:08.000Z",
    "removed": false,
    "channels": [
        "ach"
    ],
    "bankName": "SANDBOX TEST BANK",
    "fingerprint": "5012989b55af15400e8102f95d2ec5e7ce3aef45c01613280d80a236dd8d6c3a"
}

```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/49dbaa24-1580-4b1c-8b58-24e26656fa31'

funding_source = app_token.get funding_source_url
funding_source.name # => "Test checking account"
```
```php
<?php
$fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/49dbaa24-1580-4b1c-8b58-24e26656fa31';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fundingSource = $fsApi->id($fundingSourceUrl);
$fundingSource->name; # => "Test checking account"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/49dbaa24-1580-4b1c-8b58-24e26656fa31'

funding_source = app_token.get(funding_source_url)
funding_source.body['name'] # => 'Test checking account'
```
```javascript
var fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/49dbaa24-1580-4b1c-8b58-24e26656fa31';

appToken
  .get(fundingSourceUrl)
  .then(res => res.body.name); // => "Test checking account"
```

## List funding sources for a customer

Retrieve a list of funding sources that belong to a Customer. By default, all funding sources are returned unless the `removed` query string parameter is set to `false` in the request.

### HTTP request
`GET https://api.dwolla.com/customers/{id}/funding-sources`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| id | yes | string | Customer's unique identifier. |
| removed | no | string | Filter removed funding sources. Defaults to `true`. Set to `false` to filter out removed funding sources from list (i.e. - /customers/{id}/funding-sources?removed=false). |

### HTTP status and error codes
| HTTP Status | Message |
|--------------|-------------|
| 403 | Not authorized to list funding sources.
| 404 | Customer not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733/funding-sources
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733/funding-sources"
    },
    "customer": {
      "href": "https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733"
    }
  },
  "_embedded": {
    "funding-sources": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/ab9cd5de-9435-47af-96fb-8d2fa5db51e8"
          },
          "customer": {
            "href": "https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733"
          },
          "with-available-balance": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/ab9cd5de-9435-47af-96fb-8d2fa5db51e8"
          }
        },
        "id": "ab9cd5de-9435-47af-96fb-8d2fa5db51e8",
        "status": "verified",
        "type": "balance",
        "name": "Balance",
        "created": "2015-10-02T21:00:28.153Z",
        "removed": false,
        "channels": []
      },
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/funding-sources/98c209d3-02d6-4bee-bc0f-61e18acf0e33"
          },
          "customer": {
            "href": "https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733"
          }
        },
        "id": "98c209d3-02d6-4bee-bc0f-61e18acf0e33",
        "status": "verified",
        "type": "bank",
        "bankAccountType": "checking",
        "name": "Jane Doe’s Checking",
        "created": "2015-10-02T22:03:45.537Z",
        "removed": false,
        "channels": [
            "ach"
        ],
        "fingerprint": "4cf31392f678cb26c62b75096e1a09d4465a801798b3d5c3729de44a4f54c794"
      }
    ]
  }
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733'

funding_sources = app_token.get "#{customer_url}/funding-sources"
funding_sources._embedded['funding-sources'][0].name # => "Jane Doe’s Checking"
```
```php
<?php
$customerUrl = 'https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733';

$fsApi = new DwollaSwagger\FundingsourcesApi($apiClient);

$fundingSources = $fsApi->getCustomerFundingSources($customerUrl);
$fundingSources->_embedded->{'funding-sources'}[0]->name; # => "Jane Doe’s Checking"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733'

funding_sources = app_token.get('%s/funding-sources' % customer_url)
funding_sources.body['_embedded']['funding-sources'][0]['name'] # => 'Jane Doe’s Checking'
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733';

appToken
  .get(`${customerUrl}/funding-sources`)
  .then(res => res.body._embedded['funding-sources'][0].name); // => 'Jane Doe’s Checking'
```

## Update a funding source

This section covers how to update a `bank` funding source. The `accountNumber`, `routingNumber`, `type` and `name` are all optional attributes that can be updated on a funding source when it has an `unverified` status. You can choose to update only name, name and routingNumber, name and accountNumber, name and type or all four attributes. Any attribute that isn't updated remains the same as it was prior to update, including the funding source id. The `name` attribute can be updated when a funding source has either an `unverified` or `verified` status.

### HTTP request

`POST https://api.dwolla.com/funding-sources/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | id of funding source to update. |
| name | no | string | Arbitrary nickname for the funding source. Must be 50 characters or less. |
| bankAccountType | no | string | Type of bank account: `checking`, `savings`, `general-ledger` or `loan`. |
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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
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
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'
request_body = {
  'name': 'Test Checking - 1234'
}

funding_source = app_token.post(funding_source_url, request_body)
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

## Initiate micro-deposits

This section covers how to initiate micro-deposits for bank verification. Reference the [funding source verification](https://developers.dwolla.com/resources/funding-source-verification.html) resource article for more information on the micro-deposit method of bank account verification.

### HTTP request
`POST https://api.dwolla.com/funding-sources/{id}/micro-deposits`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | id of funding source to initiate micro-deposits to. |

### HTTP status and error codes
| HTTP Status | Code | Description |
|--------------|-------------|-------------------|
| 201 | Created | Micro-deposits initiated, will take 1-2 days to settle to destination bank. |
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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'

app_token.post "#{funding_source_url}/micro-deposits"
```
```javascript
var fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909';

appToken.post(`${fundingSourceUrl}/micro-deposits`);
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
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

### HTTP status and error codes
| HTTP Status | Code | Description |
|--------------|-------------|-------------------|
| 200 | OK | Micro-deposits successfully verified.  |
| 202 | TryAgainLater | Micro-deposits have not have not settled to destination bank. A Customer can verify these amounts after micro-deposits have processed to their bank. |
| 400 | ValidationError | InvalidAmount, "Wrong amount(s)." |
| 403 | InvalidResourceState | "Too many attempts.", "Bank already verified." |
| 404 | NotFound | Micro-deposits not initiated,Funding source not found |
| 500 | Unknown | "Verify micro-deposits returned an unknown error." |

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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
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
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'
request_body = {
    'amount1': {
        'value': '0.03',
        'currency': 'USD'
    },
    'amount2': {
        'value': '0.09',
        'currency': 'USD'
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

## Retrieve a funding source balance

This section covers how to retrieve the total and available amount for a [Dwolla balance](https://developers.dwolla.com/resources/balance-funding-source.html) funding source. The funding source type `balance` exists for [Verified Customer](https://developers.dwolla.com/resources/account-types.html#verified-customer) accounts and represents a balance held in the Dwolla network.

#### Total and Available Balance
There are two different amounts returned in the API response when retrieving a balance which correspond to a `total` and `available` balance. **Note:** Unless your application utilizes [Labels](https://docs.dwolla.com/#labels) functionality, the amounts that are returned in both the `balance` and `total` objects will be the same. Available balance can be accessed via the `balance` attribute, whereas total balance can be accessed via the `total` attribute within the Balance object. Both `balance` and `total` are JSON objects that contain key value pairs for `value` and `currency`.

##### Available Balance
The amount of funds readily available in a Verified Customer Record’s balance that can be sent, withdrawn, or [labeled](https://docs.dwolla.com/#labels).

##### Total Balance
Represents the Verified Customer Record’s total balance held in the Dwolla network. This includes both [labeled](https://docs.dwolla.com/#labels) funds and the Available Balance, i.e. both labeled and unlabeled funds.

### HTTP request
`GET https://api.dwolla.com/funding-sources/{id}/balance`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | id of funding source to retrieve a balance for. |

### HTTP status and error codes
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
  "total": {
      "value": "4616.87",
      "currency": "USD"
  },
  "lastUpdated": "2017-04-18T15:20:25.880Z"
}
```
```ruby
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/c2eb3f03-1b0e-4d18-a4a2-e552cc111418'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
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
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/c2eb3f03-1b0e-4d18-a4a2-e552cc111418'

funding_source = app_token.get('%s/balance' % funding_source_url)
```
```javascript
var fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/c2eb3f03-1b0e-4d18-a4a2-e552cc111418';

appToken
  .get(`${fundingSourceUrl}/balance`)
  .then(res => res.body.balance.amount);
```

## Retrieve micro-deposits details

This section shows how to retrieve the status of micro-deposits and check if micro-deposits are eligible for verification. If the status of micro-deposits is `failed`, a `failure` object will be returned in the response body which includes the ACH return code and description.

### HTTP request
`GET https://api.dwolla.com/funding-sources/{id}/micro-deposits`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | no | string | id of funding source to check status of validation deposits. |

###Micro-deposits object
| Attribute | Description |
|--------------|-------------|
| _links | A _links [JSON object](#links) |
| created | ISO-8601 timestamp |
| status | Possible values: `pending`, `processed`, or `failed`. `pending` represents micro-deposits initiated and are en route to their destination. `processed` represents micro-deposits have reached the destination account and are awaiting verification. `failed` represents micro-deposits failed to clear successfully to the destination. |
| failure | Determines if micro-deposits fail to complete to a bank. Failure is an object that contains a `code` and `description`, which represents the ACH return code and description of the return. |

### HTTP status and error codes
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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
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
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
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

<ol class = "alerts">
    <li class="alert icon-alert-info">
      We recommend not removing funding sources until all transfers have been `processed`. Removing a funding source prior to a transfer processing may result in funds being processed to a `balance` funding source rather than the intended bank funding source.
    </li>
</ol>


### HTTP request

`POST https://api.dwolla.com/funding-sources/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | id of funding source to delete. |
| removed | yes | string |Specify a value of `true` to remove the associated funding source. |

### HTTP status and error codes
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
  "bankAccountType": "checking",
  "name": "Test bank account",
  "created": "2016-06-08T21:37:30.000Z",
  "removed": true,
  "fingerprint": "4cf31392f678cb26c62b75096e1a09d4465a801798b3d5c3729de44a4f54c794"
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
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
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
funding_source_url = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c'
request_body = {
  'removed': True
}

funding_source = app_token.post(funding_source_url, request_body)
```
```javascript
var fundingSourceUrl = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';
var requestBody = {
  removed: true
};

appToken.post(fundingSourceUrl, requestBody);
```
* * *
