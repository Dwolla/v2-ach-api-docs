# Customers

A Customer represents an individual or business with whom you intend to transact with and is programmatically created and managed by a Dwolla [Master account](#accounts) via the API. In order for a Dwolla `Account` to create and manage Customers, an application must obtain permission from Dwolla before being enabled in production.

### Customer types

With a transfer of money, *at least one party must complete the identity verification process*, either the sender or the receiver. This can be either the Dwolla Master Account itself or a `verified` Customer type. Based on your business model and funds flow, it’s your decision about which party completes this process-- you may even want to have both parties complete the identity verification process. A brief description of each Customer type is below, but for a more in-depth overview of each Customer type and what their capabilities are, check out our [developer resource article](https://developers.dwolla.com/resources/account-types.html).

##### Receive-only Users

Receive-only users are restricted to a "payouts only" funds flow. A receive-only user maintains limited functionality in the API and is only eligible to receive transfers to an attached bank account. This Customer type can only interact with verified Customers and a Dwolla Master Account.

##### Unverified Customers

Unverified Customers have a default sending transaction limit of $5,000 per week. A week is defined as Monday to Sunday UTC time. As this Customer is not identity verified, they will only be able to transact with verified Customers or your Dwolla Master Account.

##### Verified Customers

Verified Customers are defined by their ability to both send and receive money, thus, being able to fit all funds flows. They can also interact with any Customer type and hold a `balance` funding source within the Dwolla network. Think of the Dwolla `balance` as a "wallet" which a Customer can send, receive, or hold funds to within the Dwolla network. With no weekly transfer limits, this Customer type is flexible for high transaction volumes.

A verified Customer can be created as a type of either `Personal` or `Business`.

### Customer links

| Link | Description|
|------|------------|
| self | URL of the Customer resource |
| receive | Follow the link to create a transfer to this Customer. |
| funding-sources | GET this link to list the Customer's funding sources. |
| transfers | GET this link to list the Customer's transfers |
| send | (optional) If this link exists, this Customer can send funds.  POST to this URL to create a transfer. |
| retry-verification | If the Customer has a `status` of `retry`, POST to this link to attempt to correct their identity verification information. |
| verify-with-document | If the Verified Customer of type `personal` or `business` has a `status` of `document`, POST to this link to upload a new color photo document to verify the Customer's identity. If type `business`, the controller of the business. Read about [Documents](#documents). |
| verify-business-with-document | If the Verified Customer of type `business` has a `status` of `document`, POST to this link to upload a new color photo document to verify the identity of the business itself.  Read about [Documents](#documents). |
| verify-controller-and-business-with-document | If the Verified Customer of type `business` has a `status` of `document`, POST to this link to upload new color photo documents to verify the identity of the controller of the business as well as the business itself.  Read about [Documents](#documents). |

### Customer resource

| Parameter | Description |
|-----------|------------|
|id | Customer’s unique identifier. |
|firstName | Customer's first name. |
|lastName | Customer's last name. |
|email | Customer's email address. |
|type | Either `unverified`, `personal`, `business`, or `receive-only`. |
|status | If type is **unverified** or **receive-only**: status can be `unverified` or `suspended`. <br> If type is **personal** or **business**: status can be `retry`, `document`, `verified`, or `suspended`. |
|created | ISO-8601 timestamp. |

### Customer statuses

| Status | Description |
|--------|------------|
| unverified | Customers of type `unverified` or `receive-only` always have this status. |
| retry | Verified Customers of type `personal` or `business` can have this status. The initial verification attempt failed because the information provided did not satisfy our verification check.  You can make one additional attempt by changing some or all the attributes of the existing Customer with a POST request. If the additional attempt fails, the resulting status will be either `document` or `suspended`. |
| document | Verified Customers of type `personal` or `business` can have this status. Dwolla requires additional documentation to identify the Customer in the `document` status.  Read about [Documents](#documents). |
| verified | Verified Customers of type `personal` or `business` can have this status. The Customer is currently verified. |
| suspended | All Customer types can have a status of `suspended`. The Customer is suspended and may neither send nor receive funds. Contact Dwolla support for more information. |
| deactivated | All Customer types can have a status of `deactivated`. A deactivated Customer may neither send nor receive funds. A deactivated Customer can be [reactivated](#reactivate-a-customer) which moves the Customer to the status they were in prior to being deactivated. |

```noselect
{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/customers/9da3aa7c-2524-430b-a751-6dc722735fce",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "customer"
    },
    "receive": {
      "href": "https://api-sandbox.dwolla.com/transfers",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    },
    "edit-form": {
      "href": "https://api-sandbox.dwolla.com/customers/9da3aa7c-2524-430b-a751-6dc722735fce",
      "type": "application/vnd.dwolla.v1.hal+json; profile=\"https://github.com/dwolla/hal-forms\"",
      "resource-type": "customer"
    },
    "edit": {
      "href": "https://api-sandbox.dwolla.com/customers/9da3aa7c-2524-430b-a751-6dc722735fce",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "customer"
    },
    "funding-sources": {
      "href": "https://api-sandbox.dwolla.com/customers/9da3aa7c-2524-430b-a751-6dc722735fce/funding-sources",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "funding-source"
    },
    "transfers": {
      "href": "https://api-sandbox.dwolla.com/customers/9da3aa7c-2524-430b-a751-6dc722735fce/transfers",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    },
    "send": {
      "href": "https://api-sandbox.dwolla.com/transfers",
      "type": "application/vnd.dwolla.v1.hal+json",
      "resource-type": "transfer"
    }
  },
  "id": "9da3aa7c-2524-430b-a751-6dc722735fce",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "janedoe@email.com",
  "type": "personal",
  "status": "verified",
  "created": "2016-08-17T18:58:47.630Z",
  "address1": "99-99 33rd St",
  "address2": "Apt 8",
  "city": "Some City",
  "state": "NY",
  "postalCode": "11101",
  "phone": "5554321234"
}
```

## Create a customer

This section details how to create a new Customer.

[**To create `Receive-only Users`**](/#request-parameters---receive-only-customer), you'll provide the customer's full name and email address, `type` with the value of `receive-only`, and `businessName` if applicable.

[**To create `Unverified Customers`**](/#request-parameters---unverified-customer), you will only need to provide the customer's full name and email address, as well as a `businessName` if applicable.

[**To create `Verified Customers`**](/#request-parameters---verified-strongpersonalstrong-customer), Dwolla will require additional information to confirm the identity of the individual or business. Verified Customers can include type `business` or `personal`. For [businesses](/#request-parameters---verified-strongbusinessstrong-customer-sole-proprietorship-only), Dwolla will need to verify information about both the business and the controller for that business. Dwolla does not identity verify the Account Admin.

### HTTP request

`POST https://api.dwolla.com/customers`

### HTTP status and error codes

| HTTP Status | Message |
|--------------|-------------|
| 400 | Duplicate customer or validation error.
| 403 | Not authorized to create customers.

### Request parameters - receive-only User

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| firstName | yes | string | Customer's first name. |
| lastName | yes | string | Customer's last name. |
| email | yes | string | Customer's email address. |
| type | yes | string | Value of `receive-only`. |
| businessName | yes | string | Customer's registered business name. (**Optional** if not a business entity) |
| ipAddress | no | string | Customer's IP address. |

##### Request and response - receive-only User

```raw
POST https://api-sandbox.dwolla.com/customers
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "firstName": "Jane",
  "lastName": "Merchant",
  "email": "jmerchant@nomail.net",
  "type": "receive-only",
  "businessName": "Jane Corp llc",
  "ipAddress": "99.99.99.99"
}

HTTP/1.1 201 Created
Location: https://api.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F
```

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
request_body = {
  :firstName => 'Jane',
  :lastName => 'Merchant',
  :email => 'jmerchant@nomail.net',
  :type => 'receive-only',
  :businessName => 'Jane Corp llc',
  :ipAddress => '99.99.99.99'
}

customer = app_token.post "customers", request_body
customer.response_headers[:location] # => "https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F"
```

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customer = $customersApi->create([
  'firstName' => 'Jane',
  'lastName' => 'Merchant',
  'email' => 'jmerchant@nomail.net',
  'type' => 'receive-only',
  'businessName' => 'Jane Corp llc',
  'ipAddress' => '99.99.99.99'
]);
$customer; # => "https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F"
?>
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
request_body = {
  'firstName': 'Jane',
  'lastName': 'Merchant',
  'email': 'jmerchant@nomail.net',
  'type': 'receive-only',
  'businessName': 'Jane Corp llc',
  'ipAddress': '99.99.99.99'
}

customer = app_token.post('customers', request_body)
customer.headers['location'] # => 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
```

```javascript
var requestBody = {
  firstName: 'Jane',
  lastName: 'Merchant',
  email: 'jmerchant@nomail.net',
  type: 'receive-only',
  businessName: 'Jane Corp llc',
  ipAddress: '99.99.99.99'
};

appToken
  .post('customers', requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F'
```

### Request parameters - unverified Customer

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| firstName | yes | string | Customer's first name. |
| lastName | yes | string | Customer's last name. |
| email | yes | string | Customer's email address. |
| businessName | yes | string | Customer's registered business name. (**Optional** if not a business entity) |
| ipAddress | no | string | Customer's IP address. |

##### Request and response - unverified Customer

```raw
POST https://api-sandbox.dwolla.com/customers
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "firstName": "Jane",
  "lastName": "Merchant",
  "email": "jmerchant@nomail.net",
  "ipAddress": "99.99.99.99",
  "businessName": "Jane Merchant's Business"
}

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F
```

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
request_body = {
  :firstName => 'Jane',
  :lastName => 'Merchant',
  :email => 'jmerchant@nomail.net',
  :ipAddress => '99.99.99.99'
}

customer = app_token.post "customers", request_body
customer.headers[:location] # => "https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F"
```

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customer = $customersApi->create([
  'firstName' => 'Jane',
  'lastName' => 'Merchant',
  'email' => 'jmerchant@nomail.net',
  'ipAddress' => '99.99.99.99'
]);

$customer; # => "https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F"
?>
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
request_body = {
  'firstName': 'Jane',
  'lastName': 'Merchant',
  'email': 'jmerchant@nomail.net',
  'ipAddress': '99.99.99.99'
}

customer = app_token.post('customers', request_body)
customer.headers['location'] # => 'https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F'
```

```javascript
var requestBody = {
  firstName: 'Jane',
  lastName: 'Merchant',
  email: 'jmerchant@nomail.net',
  ipAddress: '99.99.99.99'
};

appToken
  .post('customers', requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F'
```

### Request parameters - verified **personal** Customer

For an in-depth look at personal verified Customers creation and status handling, refer to our [developer resource article](https://developers.dwolla.com/resources/personal-verified-customer.html).

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| firstName | yes | string | An individual Customer's first name. |
| lastName | yes | string | An individual Customer's last name. |
| email | yes | string | Customer's email address. |
| ipAddress | no | string | Customer's IP address. |
| type | yes | string | The Verified Customer type. Set to `personal` if creating a verified personal Customer. |
| address1 | yes | string | First line of the street address of the Customer's permanent residence. Must be 50 characters or less. **Note:** PO Boxes are not allowed. |
| address2 | no | string | Second line of the street address of the Customer's permanent residence. Must be 50 characters or less. **Note:** PO Boxes are not allowed. |
| city | yes | string | City of Customer's permanent residence. |
| state | yes | string | Two letter abbreviation of the state in which the Customer resides, e.g. `CA`. |
| postalCode | yes | string | Postal code of Customer's permanent residence. US five-digit ZIP or ZIP + 4 code. e.g. `50314`. |
| dateOfBirth | yes | string | Customer's date of birth in `YYYY-MM-DD` format. Must be 18 years or older. |
| ssn | yes | string | Last four digits of the Customer's Social Security Number. |
| phone | no | string | Customer's 10 digit phone number.  No hyphens or other separators, e.g. `3334447777`. |

##### Request and response - verified **personal** Customer

```raw
POST https://api-sandbox.dwolla.com/customers
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "johndoe@nomail.net",
  "ipAddress": "10.10.10.10",
  "type": "personal",
  "address1": "99-99 33rd St",
  "city": "Some City",
  "state": "NY",
  "postalCode": "11101",
  "dateOfBirth": "1970-01-01",
  "ssn": "1234"
}

HTTP/1.1 201 Created
Location: https://api.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F
```

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customer = $customersApi->create([
  'firstName' => 'John',
  'lastName' => 'Doe',
  'email' => 'jdoe@nomail.net',
  'type' => 'personal',
  'address1' => '99-99 33rd St',
  'city' => 'Some City',
  'state' => 'NY',
  'postalCode' => '11101',
  'dateOfBirth' => '1970-01-01',

  # For the first attempt, only the
  # last 4 digits of SSN required

  # If the entire SSN is provided,
  # it will still be accepted
  'ssn' => '1234'
]);

$customer; # => "https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C"
?>
```

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
request_body = {
  :firstName => 'John',
  :lastName => 'Doe',
  :email => 'jdoe@nomail.net',
  :type => 'personal',
  :address1 => '99-99 33rd St',
  :city => 'Some City',
  :state => 'NY',
  :postalCode => '11101',
  :dateOfBirth => '1970-01-01',

  # For the first attempt, only the
  # last 4 digits of SSN required

  # If the entire SSN is provided,
  # it will still be accepted

  :ssn => '1234'
}

customer = app_token.post "customers", request_body
customer.response_headers[:location] # => "https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C"
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
request_body = {
  'firstName': 'John',
  'lastName': 'Doe',
  'email': 'jdoe@nomail.net',
  'type': 'personal',
  'address1': '99-99 33rd St',
  'city': 'Some City',
  'state': 'NY',
  'postalCode': '11101',
  'dateOfBirth': '1970-01-01',
  # For the first attempt, only the
  # last 4 digits of SSN required
  # If the entire SSN is provided,
  # it will still be accepted
  'ssn': '1234'
}

customer = app_token.post('customers', request_body)
customer.headers['location'] # => 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
```

```javascript
var requestBody = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'jdoe@nomail.net',
  type: 'personal',
  address1: '99-99 33rd St',
  city: 'Some City',
  state: 'NY',
  postalCode: '11101',
  dateOfBirth: '1970-01-01',
  // For the first attempt, only the
  // last 4 digits of SSN required
  // If the entire SSN is provided,
  // it will still be accepted
  ssn: '1234'
};

appToken
  .post('customers', requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F'
```

### Request parameters - verified **business** Customer (sole proprietorship only)

For an in-depth look at business verified Customers creation and status handling, refer to our [developer resource article](https://developers.dwolla.com/resources/business-verified-customer.html). Dwolla will verify the identity of both the Business Owner and the Business entity.

| Parameter | Required | Type | Description |
| ---------------|--------------|--------|----------------|
| firstName | yes | string | The legal first name of the business owner. |
| lastName | yes | string | The legal last name of the business owner. |
| email | yes | string | email address of the business owner. |
| ipAddress | no | string | ipAddress of registering user is recommended. |
| type | yes | string | Value of: `business` |
| dateOfBirth | yes  |  string |  The date of birth of the business owner. Formatted in YYYY-MM-DD format. Must be 18 years or older. |
| ssn | yes | string | Last four-digits of the business owner's social security number.  |
| address1 | yes | string | Street number, street name of business’ physical address. |
| address2 | no | string | Apartment, floor, suite, bldg. # of business’ physical address |
| city| yes | string | City of business’ physical address. |
| state| yes | string | Two-letter US state or territory abbreviation code of business’ physical address. For two-letter abbreviation reference, check out the [US Postal Service guide](https://pe.usps.com/text/pub28/28apb.htm). |
| postalCode | yes| string | Business’ US five-digit ZIP or ZIP + 4 code. |
| businessName | yes | string | Registered business name. |
| doingBusinessAs | no | string | Preferred business name -- also known as fictitious name, or assumed name. |
| businessType | yes | string | Business structure. Value of `soleProprietorship`. |
| businessClassification| yes | string | The industry classification Id that corresponds to Customer’s business. [Reference our Dev Docs](#list-business-classifications) to learn how to generate this Id. |
| ein | no | string | Employer Identification Number. Optional for `soleProprietorship` business Customers |
| website | no | string | Business’ website |
| phone | no | string | Business's 10 digit phone number. No hyphens or other separators, e.g. 3334447777. |

##### Request and response - verified **business** Customer (sole proprietorship only)

```raw
POST https://api-sandbox.dwolla.com/customers
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer 0Sn0W6kzNic+oWhDbQcVSKLRUpGjIdl/YyrHqrDDoRnQwE7Q

{
    "firstName": "Business",
    "lastName": "Owner",
    "email": "solePropBusiness@email.com",
    "ipAddress": "143.156.7.8",
    "type": "business",
    "dateOfBirth": "1980-01-31",
    "ssn": "6789",
    "address1": "99-99 33rd St",
    "city": "Some City",
    "state": "NY",
    "postalCode": "11101",
    "businessClassification": "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
    "businessType": "soleProprietorship",
    "businessName":"Jane Corp",
    "ein":"00-0000000"
}

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5
```

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);
$new_customer = 'https://api-sandbox.dwolla.com/customers/b70c3194-35fa-49e8-9243-d55a30e06d1e';
$new_customer = $customersApi->create([
    'firstName' => 'Business',
    'lastName' => 'Owner',
    'email' => 'solePropBusiness@email.com',
    'ipAddress' => '143.156.7.8',
    'type' => 'business',
    'dateOfBirth' => '1980-01-31',
    'ssn' => '6789',
    'address1' => '99-99 33rd St',
    'city' => 'Some City',
    'state' => 'NY',
    'postalCode' => '11101',
    'businessClassification' => '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
    'businessType' => 'soleProprietorship',
    'businessName' => 'Jane Corp',
    'ein' => '00-0000000']);

?>
```

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
request_body = {
    :firstName => 'Business',
    :lastName => 'Owner',
    :email => 'solePropBusiness@email.com',
    :ipAddress => '143.156.7.8',
    :type => 'business',
    :dateOfBirth => '1980-01-31',
    :ssn => '6789',
    :address1 => '99-99 33rd St',
    :city => 'Some City',
    :state => 'NY',
    :postalCode => '11101',
    :businessClassification => '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
    :businessType => 'soleProprietorship',
    :businessName => 'Jane Corp',
    :ein => '00-0000000'
}

customer = app_token.post "customers", request_body
customer.response_headers[:location] # => "https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5"
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
request_body = {
  'firstName': 'Business',
  'lastName': 'Owner',
  'email': 'solePropBusiness@email.com',
  'ipAddress': '143.156.7.8',
  'type': 'business',
  'dateOfBirth': '1980-01-31',
  'ssn': '6789',
  'address1': '99-99 33rd St',
  'city': 'Some City',
  'state': 'NY',
  'postalCode': '11101',
  'businessClassification': '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
  'businessType': 'soleProprietorship',
  'businessName': 'Jane Corp',
  'ein': '00-0000000'
}

customer = app_token.post('customers', request_body)
customer.headers['location'] # => 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```

```javascript
var requestBody = {
    firstName: 'Business',
    lastName: 'Owner',
    email: 'solePropBusiness@email.com',
    ipAddress: '143.156.7.8',
    type: 'business',
    dateOfBirth: '1980-01-31',
    ssn: '6789',
    address1: '99-99 33rd St',
    city: 'Some City',
    state: 'NY',
    postalCode: '11101',
    businessClassification: '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
    businessType: 'soleProprietorship',
    businessName: 'Jane Corp',
    ein: '00-0000000',
};

appToken
  .post('customers', requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```

### Request parameters - verified business Customer (businessType=llc, corporation or partnership)

For an in-depth look at business verified Customers creation and status handling, refer to our [developer resource article](https://developers.dwolla.com/resources/business-verified-customer.html).
A verified business Customer must input information on the controller and the Business entity for Dwolla. Dwolla will verify the identity of both the Controller and the Business Entity.

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| firstName | yes | string |The legal first name of the Account Admin or business owner signing up the business verified Customer. |
| lastName | yes | string | The legal last name of the Account Admin or individual signing up the business verified Customer. |
| email | yes |string | email address of individual creating and managing the Customer account. |
| ipAddress | no |string | ipAddress of registering user is recommended. |
| type | yes | string | Value of: `business` |
| address1 | yes |string | Street number, street name of business’ physical address. |
| address2 | no |string | Apartment, floor, suite, bldg. # of business’ physical address. |
| city | yes |string | City of business’ physical address. |
| state | yes |string | Two-letter US state or territory abbreviation code of business’ physical address. For two-letter abbreviation reference, check out the [US Postal Service guide](https://pe.usps.com/text/pub28/28apb.htm). |
| postalCode | yes |string | Business’ US five-digit ZIP or ZIP + 4 code. |
| businessName | yes |string | Registered business name. |
| doingBusinessAs | no |string | Preferred business name – also known as fictitious name, or assumed name. |
| businessType | yes |string | Business structure. Possible values are `corporation`, `llc`, `partnership`. |
| businessClassification | yes |string | The industry classification Id that corresponds to Customer’s business. [Reference the next section of our docs](#list-business-classifications) to learn how to generate this Id.  |
| ein | yes |string | Employer Identification Number. |
| website | no |string | Business’ website |
| phone | no | string | Business's 10 digit phone number.  No hyphens or other separators, e.g. `3334447777`. |
| controller | conditional |object | A controller JSON object. |

##### Controller JSON object

A controller is any natural individual who holds significant responsibilities to control, manage, or direct a company or other corporate entity (i.e. CEO, CFO, General Partner, President, etc). A company may have more than one controller, but only one controller’s information must be collected.

| Parameter | Required | Type | Description |
|----------------|--------------|--------|----------------|
|  firstName | yes  |  String |  The legal first name of the controller. |
|  lastName | yes  |  String |  The legal last name of the controller. |
|  title | yes | String | Job title of the business verified Customer’s controller.  IE - Chief Financial Officer |
|  dateOfBirth | yes  |  String |  The date of birth of the controller. Formatted in YYYY-MM-DD format. Must be 18 years or older. |
|  ssn | conditional  |  String | Last four-digits of controller’s social security number. Required for US persons. |
|  address | yes | object | An [address JSON object](/#controller-address-json-object). Full address of the controller's physical address. |
|  passport | conditional | object | An [optional passport JSON object](/#controller-passport-json-object). Required for non-US persons. Includes passport identification number and country. |

##### Controller address JSON object

| Parameter | Required | Type | Description |
|----------------|--------------|--------|----------------|
|  address1 | yes | string | Street number, street name of controller’s physical address. |
|  address2 | no | string | Apartment, floor, suite, bldg. # of controller’s physical address. |
|  address3 | no | string | Third line of the street address of the controller's physical address. |
|  city | yes | string | City of controller’s physical address. |
|  stateProvinceRegion | yes | string | Two-letter US state or territory abbreviation code of controller’s physical address. For two-letter abbreviation reference, check out the [US Postal Service guide](https://pe.usps.com/text/pub28/28apb.htm). |
|  postalCode | no | string | Controller’s’ US five-digit ZIP or ZIP + 4 code. |
|  country | yes | string | Country of controller’s physical address |

##### Controller passport JSON object

A controller will only need to input Passport information if they are non-US persons and do not have a social security number.

| Parameter | Required | Type | Description |
|----------------|--------------|--------|----------------|
|  number  | conditional | string | Required if controller is a non-US person and has no Social Security number. |
|  country | conditional | string | Country of issued passport. |

### Verified Business Customer (businessType= llc, corporation or partnership)

```raw
POST https://api-sandbox.dwolla.com/customers
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer 0Sn0W6kzNic+oWhDbQcVSKLRUpGjIdl/YyrHqrDDoRnQwE7Q

{
    "firstName": "Account",
    "lastName": "Admin",
    "email": "accountAdmin@email.com",
    "ipAddress": "143.156.7.8",
    "type": "business",
    "address1": "99-99 33rd St",
    "city": "Some City",
    "state": "NY",
    "postalCode": "11101",
    "controller": {
        "firstName": "John",
        "lastName": "Controller",
        "title": "CEO",
        "ssn": "6789",
        "dateOfBirth": "1980-01-31",
        "address": {
            "address1": "1749 18th st",
            "address2": "apt 12",
            "city": "Des Moines",
            "stateProvinceRegion": "IA",
            "postalCode": "50266",
            "country": "US"
        }
    },
    "businessClassification": "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
    "businessType": "llc",
    "businessName":"Jane Corp",
    "ein":"00-0000000"
}

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5
```

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);
$new_customer = 'https://api-sandbox.dwolla.com/customers/b70c3194-35fa-49e8-9243-d55a30e06d1e';
$new_customer = $customersApi->create([
  'firstName' => 'Account',
  'lastName' => 'Admin',
  'email' => 'accountAdmin@email.com',
  'type' => 'business',
  'address1' => '99-99 33rd St',
  'city' => 'Some City',
  'state' => 'NY',
  'postalCode' => '11101',
  'controller' =>
  [
      'firstName' => 'John',
      'lastName'=> 'Controller',
      'title' => 'CEO',
      'dateOfBirth' => '1990-10-10',
      'ssn' => '1234',
      'address' =>
      [
          'address1' => '18749 18th st',
          'address2' => 'apt 12',
          'city' => 'Des Moines',
          'stateProvinceRegion' => 'IA',
          'postalCode' => '50265',
          'country' => 'US'
      ],
  ],
  'phone' => '5554321234',
  'businessClassification' => '9ed3f670-7d6f-11e3-b1ce-5404a6144203',
  'businessType' => 'llc',
  'businessName' => 'Jane Corp',
  'ein' => '00-0000000']);

?>
```

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
request_body = {
  :firstName => 'Account',
  :lastName => 'Admin',
  :email => 'accountAdmin@email.com',
  :type => 'business',
  :address1 => '99-99 33rd St',
  :city => 'Some City',
  :state => 'NY',
  :postalCode => '11101',
  :controller => {
      :firstName => 'John',
      :lastName => 'Controller',
      :title => 'CEO',
      :dateOfBirth => '1980-01-31',
      :ssn => '1234',
      :address => {
        :address1 => '1749 18th st',
        :address2 => 'apt 12',
        :city => 'Des Moines',
        :stateProvinceRegion => 'IA',
        :postalCode => '50266',
        :country => 'US',
      }
  },
  :businessClassification => '9ed38155-7d6f-11e3-83c3-5404a6144203',
  :businessType => 'llc',
  :businessName => 'Jane Corp',
  :ein => '12-3456789'
}

customer = app_token.post "customers", request_body
customer.response_headers[:location] # => "https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5"
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
request_body = {
  'firstName': 'Account',
  'lastName': 'Admin',
  'email': 'accountAdmin@email.com',
  'type': 'business',
  'address1': '99-99 33rd St',
  'city': 'Some City',
  'state': 'NY',
  'postalCode': '11101',
  'controller': {
      'firstName': 'John',
      'lastName': 'Controller',
      'title': 'CEO',
      'dateOfBirth': '1980-01-31',
      'ssn': '1234',
      'address': {
        'address1': '1749 18th st',
        'address2': 'apt12',
        'city': 'Des Moines',
        'stateProvinceRegion': 'IA',
        'postalCode': '50266',
        'country': 'US'
      }
  },
  'businessClassification': '9ed38155-7d6f-11e3-83c3-5404a6144203',
  'businessType': 'llc',
  'businessName': 'Jane Corp',
  'ein': '12-3456789'
}
customer = app_token.post('customers', request_body)
customer.headers['location'] # => 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```

```javascript
var requestBody = {
  firstName: 'Account',
  lastName: 'Admin',
  email: 'accountAdmin@email.com',
  type: 'business',
  address1: '99-99 33rd St',
  city: 'Some City',
  state: 'NY',
  postalCode: '11101',
  controller: {
      firstName: 'John',
      lastName: 'Controller',
      title: 'CEO',
      dateOfBirth: '1980-01-31',
      ssn: '1234'
      address: {
        address1: '1749 18th st',
        address2: 'apt 12',
        city: 'Des Moines',
        stateProvinceRegion: 'IA',
        postalCode: '50266',
        country: 'US',
      }
  },
  businessClassification: '9ed38155-7d6f-11e3-83c3-5404a6144203',
  businessType: 'llc',
  businessName: 'Jane Corp',
  ein: '12-3456789'
};
appToken
  .post('customers', requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/customers/62c3aa1b-3a1b-46d0-ae90-17304d60c3d5'
```

## Retrieve a customer

This section shows you how to retrieve a Customer belonging to the authorized Dwolla Master Account. Each `Customer` id is a part of its location resource. You can pass either an `id` or the entire `location` resource to make this request.

### HTTP request
`GET https://api.dwolla.com/customers/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Customer unique identifier. |

### HTTP status and error codes
| HTTP Status | Message |
|--------------|-------------|
| 403 | Not authorized to get a customer by id. |
| 404 | Customer not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8"
    }
  },
  "id": "FC451A7A-AE30-4404-AB95-E3553FCD733F",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "janedoe@nomail.com",
  "type": "unverified",
  "status": "unverified",
  "created": "2015-09-03T23:56:10.023Z"
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8'

customer = app_token.get customer_url
customer.firstName # => "Jane"
```
```php
<?php
$customerUrl = 'https://api-sandbox.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8';

$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customer = $customersApi->getCustomer($customerUrl);
$customer->firstName; # => "Jane"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8'

customer = app_token.get(customer_url)
customer.body['firstName']
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8';

appToken
  .get(customerUrl)
  .then(res => res.body.firstName); // => 'Jane'
```

## List and search customers

This section outlines how to retrieve your list of created Customers.

### HTTP request
`GET https://api.dwolla.com/customers`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| limit | no | integer | How many results to return. |
| offset | no | integer | How many results to skip. |
| search | no | string | Searches on `firstName`, `lastName`, and `email` fields. (`/customers?search=Doe`) |
| status | no | string | Filter by Customer status or multiple Customer statuses. Possible values: `unverified`, `retry`, `document`, `verified`, `suspended`, or `deactivated`. (e.g. `/customers?status=retry&status=document`)

### Request and response

```raw
GET https://api-sandbox.dwolla.com/customers
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "_links": {
    "first": {
      "href": "https://api-sandbox.dwolla.com/customers?limit=25&offset=0"
    },
    "last": {
      "href": "https://api-sandbox.dwolla.com/customers?limit=25&offset=0"
    },
    "self": {
      "href": "https://api-sandbox.dwolla.com/customers?limit=25&offset=0"
    }
  },
  "_embedded": {
    "customers": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F"
          }
        },
        "id": "FC451A7A-AE30-4404-AB95-E3553FCD733F",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "janedoe@nomail.com",
        "type": "unverified",
        "status": "unverified",
        "created": "2015-09-03T23:56:10.023Z"
      }
    ]
  },
  "total": 1
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customers = app_token.get "customers", limit: 10
customers._embedded.['customers'][0].firstName # => "Jane"
```
```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customers = $customersApi->_list(10, 0);
$customers->_embedded->{'customers'}[0]->firstName; # => "Jane"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer = app_token.get('customers', limit = 10)
customer.body['_embedded']['customers'][0]['firstName'] # => 'Jane'
```
```javascript
appToken
  .get('customers', { limit: 10 })
  .then(res => res.body._embedded['customers'][0].firstName); // => 'Jane'
```

## Update a customer

This endpoint can be used to facilitate the following use cases: Update Customer information, upgrade an `unverified` Customer to a `verified` Customer, suspend a Customer, deactivate a Customer, reactivate a Customer, and update a verified Customer's information to `retry` verification.

### HTTP request

`POST https://api.dwolla.com/customers/{id}`

### Update a Customer's information

A limited set of information can be updated on an existing created Customer. **Note:** A Customer's information cannot be updated when in a [status](#customer-statuses) of `document` or `suspended`.

##### Request parameters -  unverified Customer and receive-only User

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| firstName | no | string | Customer's first name. |
| lastName | no | string | Customer's last name. |
| email | no | string | Customer's email address. |
| businessName | no | string | Customer's registered business name. An empty string value will unset businessName. |

##### Request parameters -  verified Customer

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| email | no | string | Customer's email address. |
| ipAddress | no | string | Customer's IP address. |
| address1 | no | string | First line of the street address of the customer's permanent residence. **Note:** PO Boxes are not allowed. |
| address2 | no | string | Second line of the street address of the customer's permanent residence. **Note:** PO Boxes are not allowed. |
| city | no | string | City of customer's permanent residence. |
| state | no | string | Two letter abbreviation of the state in which the customer resides.  e.g. `NY`. |
| postalCode | no | string | Postal code of customer's permanent residence. Should be a five digit postal code, e.g. `50314`. |
| phone | no | string | Customer's 10 digit phone number.  No hyphens or other separators, e.g. `3334447777`. |

##### Request parameters - verified Customer with type=business

In addition to the table above, business verified Customers can update the following fields.

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| doingBusinessAs | no | string | Name that is different from the officially registered name of Customer’s business. |
| website | no | string | www.domain.com |

### Upgrade an unverified Customer to verified Customer

An unverified Customer can be upgraded to a verified Customer by supplying the necessary information required to create a verified Customer. Reference [this table](#request-parameters---verified-customer) for required information.

### Suspend a Customer

Unverified and Verified Customers can be suspended by specifying a status of `suspended` in your request. You'll need to contact Dwolla to unsuspend a Customer.

##### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| status | yes | string | Value of `suspended`. |

### Deactivate a Customer

Customers can be deactivated by specifying a status of `deactivated` in your request. A Customer **cannot** be deactivated if the Customer has a `suspended` verification status. Customers can be systematically deactivated by Dwolla if certain ACH return codes are triggered on bank transfer failures.

##### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| status | yes | string | Value of `deactivated`. |

### Reactivate a Customer

Customers can be reactivated by specifying a status of `reactivated` in your request. Reactivated Customers will be moved to the status they were in prior to being deactivated.

##### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| status | yes | string | Value of `reactivated`. |

### Retry verification

If the verified Customer has a status of `retry`, some information may have been miskeyed. You have one more opportunity to correct any mistakes using this endpoint. This time, you’ll need to provide the Customer’s full SSN. If the additional attempt fails, the resulting status will be either `document` or `suspended`.

### Customer must be in the retry state:

```noselect
{
    "_links": {
        "deactivate": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        },
        "self": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        },
        "edit-form": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f",
            "type": "application/vnd.dwolla.v1.hal+json; profile=\"https://github.com/dwolla/hal-forms\"",
            "resource-type": "customer"
        },
        "edit": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        },
        "funding-sources": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f/funding-sources",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "funding-source"
        },
        "retry-verification": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        },
        "transfers": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f/transfers",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "transfer"
        }
    },
    "id": "53863b11-1758-47c8-821f-00e6a126f97f",
    "firstName": "retry",
    "lastName": "doe",
    "email": "jdoe@nomail.com",
    "type": "personal",
    "status": "retry",
    "created": "2017-11-06T20:11:13.430Z",
    "address1": "99-99 33rd St",
    "city": "Some City",
    "state": "NY",
    "postalCode": "11101"
}
```

### Request and response

```raw
POST https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "jdoe@nomail.com",
  "ipAddress": "10.10.10.10",
  "type": "personal",
  "address1": "221 Corrected Address St.",
  "address2": "Apt 201",
  "city": "San Francisco",
  "state": "CA",
  "postalCode": "94104",
  "dateOfBirth": "1970-07-11",
  "ssn": "123-45-6789"
}

...

{
    "_links": {
        "deactivate": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        },
        "self": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        },
        "receive": {
            "href": "https://api-sandbox.dwolla.com/transfers",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "transfer"
        },
        "edit-form": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f",
            "type": "application/vnd.dwolla.v1.hal+json; profile=\"https://github.com/dwolla/hal-forms\"",
            "resource-type": "customer"
        },
        "edit": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        },
        "funding-sources": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f/funding-sources",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "funding-source"
        },
        "transfers": {
            "href": "https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f/transfers",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "transfer"
        },
        "send": {
            "href": "https://api-sandbox.dwolla.com/transfers",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "transfer"
        }
    },
    "id": "53863b11-1758-47c8-821f-00e6a126f97f",
    "firstName": "John",
    "lastName": "Doe",
    "email": "jdoe@nomail.com",
    "type": "personal",
    "status": "verified",
    "created": "2017-11-06T20:11:13.430Z",
    "address1": "221 Corrected Address St.",
    "address2": "Apt 201",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94104"
}
```
```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customerUrl = 'https://api.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f';
$customer = $customersApi->updateCustomer(array (
  'firstName' => 'John',
  'lastName' => 'Doe',
  'email' => 'jdoe@nomail.com',
  'ipAddress' => '10.10.10.10',
  'type' => 'personal',
  'address1' => '221 Corrected Address St.',
  'address2' => 'Apt 201',
  'city' => 'San Francisco',
  'state' => 'CA',
  'postalCode' => '94104',
  'dateOfBirth' => '1970-07-11',
  'ssn' => '123-45-6789',
), $customerUrl);

$customer->id; # => "53863b11-1758-47c8-821f-00e6a126f97f"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f'
request_body = {
      "firstName" => "John",
       "lastName" => "Doe",
          "email" => "jdoe@nomail.com",
      "ipAddress" => "10.10.10.10",
           "type" => "personal",
       "address1" => "221 Corrected Address St.",
       "address2" => "Apt 201",
           "city" => "San Francisco",
          "state" => "CA",
     "postalCode" => "94104",
    "dateOfBirth" => "1970-07-11",
            "ssn" => "123-45-6789"
}

customer = app_token.post customer_url, request_body
customer.id # => "53863b11-1758-47c8-821f-00e6a126f97f"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f'
request_body = {
  "firstName": "John",
  "lastName": "Doe",
  "email": "jdoe@nomail.com",
  "ipAddress": "10.10.10.10",
  "type": "personal",
  "address1": "221 Corrected Address St.",
  "address2": "Apt 201",
  "city": "San Francisco",
  "state": "CA",
  "postalCode": "94104",
  "dateOfBirth": "1970-07-11",
  "ssn": "123-45-6789"
}

customer = app_token.post(customer_url, request_body)
customer.body.id # => '53863b11-1758-47c8-821f-00e6a126f97f'
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/53863b11-1758-47c8-821f-00e6a126f97f';
var requestBody = {
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@dwolla.com",
  ipAddress: "10.10.10.10",
  type: "personal",
  address1: "221 Corrected Address St.",
  address2: "Fl 8",
  city: "Ridgewood",
  state: "NY",
  postalCode: "11385",
  dateOfBirth: "1990-07-11",
  ssn: "202-99-1516"
};

appToken
  .post(customerUrl, requestBody)
  .then(res => res.body.id); // => '53863b11-1758-47c8-821f-00e6a126f97f'
```

### If you try more than once, or Customer is not in retry state:

```noselect
{
  "code": "InvalidResourceState",
  "message": "Resource cannot be modified."
}
```

### Request parameters - retry verified Customer
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| firstName | yes | string | Customer's first name. |
| lastName | yes | string | Customer's last name. |
| email | yes | string | Customer's email address. |
| ipAddress | no | string | Customer's IP address. |
| type | yes | string | Either `personal` or `business`. If business, [see above](#additional-request-parameters-for-verified-customer-with-typebusiness) for additional required information. |
| address1 | yes | string | First line of the street address of the Customer's permanent residence. **Note:** PO Boxes are not allowed. |
| address2 | no | string | Second line of the street address of the Customer's permanent residence. **Note:** PO Boxes are not allowed. |
| city | yes | string | City of Customer's permanent residence. |
| state | yes | string | Two letter abbreviation of the state in which the customer resides, e.g. `CA`. |
| postalCode | yes | string | Postal code of Customer's permanent residence. Should be a five digit postal code, e.g. `50314`. |
| dateOfBirth | yes | string | Customer's date of birth in `YYYY-MM-DD` format. Must be 18 years or older.|
| ssn | yes | string | Customer's **full** Social Security Number. |
| phone | no | string | Customer's 10 digit phone number.  No hyphens or other separators, e.g. `3334447777`. |

### HTTP status and error codes
| HTTP Status | Message |
|--------------|-------------|
| 400 | Duplicate customer or validation error. |
| 403 | Not authorized to create customers. |

## List business classifications

Retrieve an `_embedded` list of business classifications that contains an `_embedded` list of industry classifications. An industry classification is used to identify the Customer's business and is required by Dwolla when verifying a `business` in order to better analyze the nature of a business.


### HTTP request

`GET https://api.dwolla.com/business-classifications`

### Request and response

```raw
GET https://api-sandbox.dwolla.com/business-classifications
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "_links": {},
  "_embedded": {
    "business-classifications": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/business-classifications/9ed3f669-7d6f-11e3-b545-5404a6144203"
          }
        },
        "_embedded": {
          "industry-classifications": [
            {
              "id": "9ed3f671-7d6f-11e3-803c-5404a6144203",
              "name": "Gourmet foods"
            },
            {
              "id": "9ed3f66c-7d6f-11e3-86ae-5404a6144203",
              "name": "Distilleries"
            },
            {
              ...........
            }
          ]
        },
        "id": "9ed3f669-7d6f-11e3-b545-5404a6144203",
        "name": "Food retail and service"
      }
      ...........
    ]
  },
  "total": 27
}
```

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
business_classifications = app_token.get "business-classifications"
business_classifications._embedded['business-classifications'][0].name # => "Food retail and service"
```

```php
<?php
$businessClassificationsApi = new DwollaSwagger\BusinessclassificationsApi($apiClient);

$busClassifications = $businessClassificationsApi->_list();
$busClassifications->_embedded->{'business-classifications'}[0]->name; # => "Food retail and service"
?>
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
business_classifications = app_token.get('business-classifications')
business_classifications.body['_embedded']['business-classifications'][0]['name'] # => 'Food retail and service'
```

```javascript
appToken
  .get('business-classifications')
  .then(res => res.body._embedded['business-classifications'][0].name); // => 'Food retail and service'
```

## Retrieve a business classification

This section shows you how to retrieve a business classification from a list of industry classifications. An industry classification id is needed in order to verify a `business` Customer.

### HTTP request

`GET https://api.dwolla.com/business-classifications/{id}`

### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Business classification unique identifier. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/business-classifications/9ed3a866-7d6f-11e3-a0ce-5404a6144203
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/business-classifications/9ed3a866-7d6f-11e3-a0ce-5404a6144203"
    }
  },
  "_embedded": {
    "industry-classifications": [
      {
        "id": "9ed3cf58-7d6f-11e3-81a4-5404a6144203",
        "name": "Toys and games"
      },
      {
        "id": "9ed3cf50-7d6f-11e3-8ae8-5404a6144203",
        "name": "Music"
      },
      {
        ...........
      }
    ]
  },
  "id": "9ed3a866-7d6f-11e3-a0ce-5404a6144203",
  "name": "Entertainment and media"
}
```

```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
business_classification_url = 'https://api-sandbox.dwolla.com/business-classifications/9ed3a866-7d6f-11e3-a0ce-5404a6144203'

business_classification = app_token.get business_classification_url
business_classification.name # => "Entertainment and media"
```

```php
<?php
$businessClassificationUrl = 'https://api-sandbox.dwolla.com/business-classifications/9ed3a866-7d6f-11e3-a0ce-5404a6144203';

$businessClassificationsApi = new DwollaSwagger\BusinessclassificationsApi($apiClient);

$busClassifications = $customersApi->getBusinessClassification($businessClassificationUrl);
$busClassifications->name; # => "Entertainment and media"
?>
```

```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
business_classification_url = 'https://api-sandbox.dwolla.com/business-classifications/9ed3a866-7d6f-11e3-a0ce-5404a6144203'

busClassification = app_token.get(business_classification_url)
busClassification.body['name']
```

```javascript
var businessClassificationUrl = 'https://api-sandbox.dwolla.com/business-classifications/9ed3a866-7d6f-11e3-a0ce-5404a6144203';

appToken
  .get(businessClassificationUrl)
  .then(res => res.body.name); // => 'Entertainment and media'
```

* * *
