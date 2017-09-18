# Customers

A Customer represents an individual or business with whom you intend to transact with and is programmatically created and managed by a Dwolla [account](#accounts) via the API. In order for a Dwolla `Account` to create and manage Customers, an application must obtain permission from Dwolla before being enabled in production.

<ol class="alerts">
    <li class="alert icon-alert-info">This section outlines functionality for [the Access API](https://www.dwolla.com/access-api), a premium product that only approved partners may access in production. To learn more about entering into an Access API agreement, please [contact Sales](https://www.dwolla.com/contact?b=apidocs).</li>
</ol>

### Verified and unverified Customers

With a transfer of money, at least one party must complete the identity verification process, either the sender or the receiver. It’s your decision about which party completes this process, based on your business model, and you may want to have both parties complete the identity verification process. In cases where a Customer is sending funds to or receiving funds from your account, the Customer can remain unverified because your account is already verified. However, if you need to transfer funds between your Customers, at least one of them will need to be verified.

For more information on Access API account types, reference the [account types](https://developers.dwolla.com/resources/account-types/access-api-accounts.html) resource article.

### Receive-only
Receive-only customers are restricted to a "payouts only" business model. A receive-only customer maintains limited functionality in the API and is only eligible to receive transfers to an attached bank account from the Dwolla `Account` that created it.

### Migrating Dwolla user Accounts to Access API Customers
Dwolla offers a seamless process for migrating existing user [Accounts](#accounts) managed via OAuth on your platform to Access API [Customers](#customers). The user Account will maintain existing functionality on dwolla.com and will act as a separate Access API Customer upon completion of the migration. To learn more about upgrading to the Access API, please [contact Sales](https://www.dwolla.com/contact?b=apidocs).

### Customer links
| Link | Description|
|------|------------|
| self | URL of the Customer resource
| receive | Follow the link to create a transfer to this Customer.
| funding-sources | GET this link to list the Customer's funding sources.
| transfers | GET this link to list the Customer's transfers
| send | (optional) If this link exists, this Customer can send funds.  POST to this URL to create a transfer.
| retry-verification | If the Customer has a `status` of `retry`, POST to this link to attempt to correct their identity verification information.
| verify-with-document | If the Verified Customer of type `personal` or `business` has a `status` of `document`, POST to this link to upload a new photo document to verify the Customer's identity. If type `business`, the authorized representaive of the business. Read about [Documents](#documents).
| verify-business-with-document | If the Verified Customer of type `business` has a `status` of `document`, POST to this link to upload a new photo document to verify the identity of the business itself.  Read about [Documents](#documents).
| verify-authorized-representative-and-business-with-document | If the Verified Customer of type `business` has a `status` of `document`, POST to this link to upload new photo documents to verify the identity of the authorized representative of the business as well as the business itself.  Read about [Documents](#documents).

### Customer resource

| Parameter | Description
|-----------|------------|
|id | Customer’s unique identifier.
|firstName | Customer's first name.
|lastName | Customer's last name.
|email | Customer's email address.
|type | Either `unverified`, `personal`, `business`, or `receive-only`.
|status | If type is **unverified** or **receive-only**: status can be `unverified` or `suspended`. <br> If type is **personal** or **business**: status can be `retry`, `document`, `verified`, or `suspended`.
|created | ISO-8601 timestamp.

### Customer statuses

| Status | Description
|--------|------------|
| unverified | Customers of type `unverified` or `receive-only` always have this status.
| retry | Verified Customers of type `personal` or `business` can have this status. The initial verification attempt failed because the information provided did not satisfy our verification check.  You can make one additional attempt by changing some or all the attributes of the existing Customer with a POST request. If the additional attempt fails, the resulting status will be either `document` or `suspended`.
| document | Verified Customers of type `personal` or `business` can have this status. Dwolla requires additional documentation to identify the Customer in the `document` status.  Read about [Documents](#documents).
| verified | Verified Customers of type `personal` or `business` can have this status. The Customer is currently verified.
| suspended | All Customer types can have a status of `suspended`. The Customer is suspended and may neither send nor receive funds. Contact Dwolla support for more information.

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

This section details how to create a new Customer. To create `Unverified Customers`, you need to provide only the customer's full name and email address, as well as a business name if applicable.  `Verified Customers` require additional information that will give Dwolla the ability to confirm the identity of the individual or business. Verified Customers can include type `business` or `personal`. For businesses, Dwolla will need to verify information about both the business and the “authorized representative” for that business. For `Receive-only Customers`, you'll provide the customer's full name, `type` with the value of `receive-only`, and `businessName` if applicable.

### HTTP request
`POST https://api.dwolla.com/customers`

### Request parameters - unverified Customer
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| firstName | yes | string | Customer's first name. |
| lastName | yes | string | Customer's last name. |
| email | yes | string | Customer's email address. |
| businessName | yes | string | Customer's registered business name. (**Optional** if not a business entity) |
| ipAddress | no | string | Customer's IP address. |

### Request parameters - verified Customer
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| firstName | yes | string | Customer or if business, authorized representative’s first name.
| lastName | yes | string | Customer or if business, authorized representative’s last name.
| email | yes | string | Customer's email address.
| ipAddress | no | string | Customer's IP address.
| type | yes | string | Either `personal` or `business`. If business, [see below](#additional-request-parameters-for-verified-customer-with-typebusiness) for additional required information.
| address1 | yes | string | First line of the street address of the Customer's permanent residence. Must be 50 characters or less. **Note:** PO Boxes are not allowed.
| address2 | no | string | Second line of the street address of the Customer's permanent residence. Must be 50 characters or less. **Note:** PO Boxes are not allowed.
| city | yes | string | City of Customer's permanent residence.
| state | yes | string | Two letter abbreviation of the state in which the Customer resides, e.g. `CA`.
| postalCode | yes | string | Postal code of Customer's permanent residence. Should be a five digit postal code, e.g. `50314`.
| dateOfBirth | yes | string | Customer or if business, authorized representative’s date of birth in `YYYY-MM-DD` format. Must be 18 years or older.
| ssn | yes | string | Last four digits of the Customer's Social Security Number.
| phone | no | string | Customer or if business, authorized representative’s 10 digit phone number.  No hyphens or other separators, e.g. `3334447777`.

### Additional request parameters for verified Customer with type=business
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| businessClassification | yes | string | The [industry classification](#list-business-classifications) id that corresponds to Customer’s business  |
| businessType | yes | string | Business structure. Possible values are `corporation`, `llc`, `partnership`, and `soleproprietorship` |
| businessName | yes | string | Customer’s registered business name. |
| ein | yes | string | Employer Identification Number. **Note:** If the `businessType` is a sole proprietorship then ein can be omitted from the request. |
| doingBusinessAs | no | string | Name that is different from the officially registered name of Customer’s business. |
| website | no | string | www.domain.com |

### Request parameters - receive-only
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| firstName | yes | string | Customer's first name. |
| lastName | yes | string | Customer's last name. |
| email | yes | string | Customer's email address. |
| type | yes | string | Value of `receive-only`. |
| businessName | yes | string | Customer's registered business name. (**Optional** if not a business entity) |
| ipAddress | no | string | Customer's IP address. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 400 | Duplicate customer or validation error.
| 403 | Not authorized to create customers.

### Unverified Customer

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
request_body = {
  :firstName => 'Jane',
  :lastName => 'Merchant',
  :email => 'jmerchant@nomail.net',
  :ipAddress => '99.99.99.99'
}

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
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
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
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

### Verified Customer

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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
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
customer.headers[:location] # => "https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C"
```
```python
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

# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
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
### Receive-only customer

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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
request_body = {
  :firstName => 'Jane',
  :lastName => 'Merchant',
  :email => 'jmerchant@nomail.net',
  :type => 'receive-only',
  :businessName => 'Jane Corp llc',
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
  'type' => 'receive-only',
  'businessName' => 'Jane Corp llc',
  'ipAddress' => '99.99.99.99'
]);
$customer; # => "https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
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

## List business classifications

Retrieve a list of industry classifications to identify the Customer’s business. An industry classification is required by Dwolla when verifying a `business` in order to better analyze the nature of a business.

### HTTP request
`GET https://api.dwolla.com/business-classifications`

### Request and response

```noselect
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
              "id": "9ed3f66a-7d6f-11e3-8acd-5404a6144203",
              "name": "Breweries"
            },
            {
              "id": "9ed3f66d-7d6f-11e3-9101-5404a6144203",
              "name": "Alcoholic beverage drinking places"
            },
            {
              "id": "9ed3f66e-7d6f-11e3-9480-5404a6144203",
              "name": "Beer, wine, and liquor store"
            },
            {
              "id": "9ed3f66b-7d6f-11e3-95ac-5404a6144203",
              "name": "Wineries"
            },
            {
              "id": "9ed3f674-7d6f-11e3-9619-5404a6144203",
              "name": "Tobacco"
            },
            {
              "id": "9ed3f673-7d6f-11e3-adb1-5404a6144203",
              "name": "Restaurant"
            },
            {
              "id": "9ed3f676-7d6f-11e3-af8e-5404a6144203",
              "name": "Supplement store"
            },
            {
              "id": "9ed3f675-7d6f-11e3-afad-5404a6144203",
              "name": "Pharmacy and drugstore"
            },
            {
              "id": "9ed3f670-7d6f-11e3-b1ce-5404a6144203",
              "name": "Coffee and tea"
            },
            {
              "id": "9ed3f66f-7d6f-11e3-b1df-5404a6144203",
              "name": "Catering services"
            },
            {
              "id": "9ed3f672-7d6f-11e3-b67a-5404a6144203",
              "name": "Specialty and miscellaneous food store"
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

## Retrieve a business classification

This section shows you how to retrieve a business classification from a list of industry classifications. An industry classification id is needed in order to verify a `business` Customer.

### HTTP request
`GET https://api.dwolla.com/business-classifications/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Business classification unique identifier. |

### Request and response

```noselect
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
        "id": "9ed3cf5c-7d6f-11e3-8d0e-5404a6144203",
        "name": "Gambling"
      },
      {
        "id": "9ed3cf53-7d6f-11e3-8ee9-5404a6144203",
        "name": "Cable, satellite, and other pay TV and radio broadcasting"
      },
      {
        "id": "9ed3cf59-7d6f-11e3-9158-5404a6144203",
        "name": "Slot machines"
      },
      {
        "id": "9ed3cf57-7d6f-11e3-921d-5404a6144203",
        "name": "Theater tickets"
      },
      {
        "id": "9ed3cf4f-7d6f-11e3-97ea-5404a6144203",
        "name": "Motion picture and video"
      },
      {
        "id": "9ed3cf5a-7d6f-11e3-9a99-5404a6144203",
        "name": "Digital content"
      },
      {
        "id": "9ed3cf5b-7d6f-11e3-a368-5404a6144203",
        "name": "Entertainers"
      },
      {
        "id": "9ed3a867-7d6f-11e3-a6e4-5404a6144203",
        "name": "Memorabilia"
      },
      {
        "id": "9ed3cf52-7d6f-11e3-b0da-5404a6144203",
        "name": "Music store - CDs, cassettes and albums"
      },
      {
        "id": "9ed3cf5d-7d6f-11e3-b35e-5404a6144203",
        "name": "Online gaming"
      },
      {
        "id": "9ed3cf55-7d6f-11e3-b43c-5404a6144203",
        "name": "Adult digital content"
      },
      {
        "id": "9ed3cf51-7d6f-11e3-b49f-5404a6144203",
        "name": "Movie store - DVDs, videotapes"
      },
      {
        "id": "9ed3cf5e-7d6f-11e3-b9d5-5404a6144203",
        "name": "Video games and systems"
      },
      {
        "id": "9ed3cf56-7d6f-11e3-ba87-5404a6144203",
        "name": "Concert tickets"
      },
      {
        "id": "9ed3cf54-7d6f-11e3-bf23-5404a6144203",
        "name": "Cable and other subscription programming"
      }
    ]
  },
  "id": "9ed3a866-7d6f-11e3-a0ce-5404a6144203",
  "name": "Entertainment and media"
}
```

## Update a customer

This endpoint can be used to facilitate the following use cases: Update Customer information, upgrade an `unverified` Customer to a `verified` Customer, suspend a Customer, deactivate a Customer, and update a verified Customer's information to `retry` verification.

### HTTP request
`POST https://api.dwolla.com/customers/{id}`

### Update a Customer's information
A limited set of information can be updated on an existing created Customer. **Note:** A Customer's information cannot be updated when in a [status](#customer-statuses) of `document` or `suspended`.

##### Request parameters -  unverified Customer
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| firstName | no | string | Customer's first name. |
| lastName | no | string | Customer's last name. |
| email | no | string | Customer's email address. |

##### Request parameters -  verified Customer
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| email | no | string | Customer's email address.
| ipAddress | no | string | Customer's IP address.
| address1 | no | string | First line of the street address of the customer's permanent residence. **Note:** PO Boxes are not allowed.
| address2 | no | string | Second line of the street address of the customer's permanent residence. **Note:** PO Boxes are not allowed.
| city | no | string | City of customer's peramanent residence.
| state | no | string | Two letter abbreviation of the state in which the customer resides.  e.g. `NY`.
| postalCode | no | string | Postal code of customer's permanent residence. Should be a five digit postal code, e.g. `50314`.
| phone | no | string | Customer's 10 digit phone number.  No hyphens or other separators, e.g. `3334447777`.

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
Unverified and Verified Customers can be deactivated by specifying a status of `deactivated` in your request. A Customer **cannot** be deactivated if the following conditions are true: Customer has a `suspended` verification status, a Customer has transfers that are `pending`, or if there are funds available in the Customer's `balance`(*Verified Customers only*).

##### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| status | yes | string | Value of `deactivated`. |

### Retry verification
If the verified Customer has a status of `retry`, some information may have been miskeyed. You have one more opportunity to correct any mistakes using this endpoint. This time, you’ll need to provide the Customer’s full SSN. If the additional attempt fails, the resulting status will be either `document` or `suspended`.

### Customer must be in the retry state:

```noselect
{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/customers/730CA23F-06C5-45CC-AA6B-8EC2D6EE109F"
    },
    "funding-sources": {
      "href": "https://api.dwolla.com/customers/730CA23F-06C5-45CC-AA6B-8EC2D6EE109F/funding-sources"
    },
    "transfers": {
      "href": "https://api.dwolla.com/customers/730CA23F-06C5-45CC-AA6B-8EC2D6EE109F/transfers"
    },
    "retry-verification": {
      "href": "https://api.dwolla.com/customers/730CA23F-06C5-45CC-AA6B-8EC2D6EE109F"
    }
  },
  "id": "730CA23F-06C5-45CC-AA6B-8EC2D6EE109F",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jdoe@nomail.com",
  "type": "personal",
  "status": "retry",
  "created": "2015-10-06T01:18:26.923Z"
}
```

### Request and response

```raw
POST https://api-sandbox.dwolla.com/customers/132681FA-1B4D-4181-8FF2-619CA46235B1
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

HTTP/1.1 200 OK
Location: https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F
```
```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customerUrl = 'https://api.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F';
$customer = $customersApi->updateCustomer($customerUrl, array (
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
));
$customer->id; # => "FC451A7A-AE30-4404-AB95-E3553FCD733F"
?>
```
```ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F'
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

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
customer = app_token.post customer_url, request_body
customer.id # => "FC451A7A-AE30-4404-AB95-E3553FCD733F"
```
```python
customer_url = 'https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F'
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

# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
customer = app_token.post('customers', request_body)
customer.body.id # => 'FC451A7A-AE30-4404-AB95-E3553FCD733F'
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F';
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
  .then(res => res.body.id); // => 'FC451A7A-AE30-4404-AB95-E3553FCD733F'
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

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 400 | Duplicate customer or validation error.
| 403 | Not authorized to create customers.

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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
customers = app_token.get "customers", limit: 10
customers._embedded.customers[0].firstName # => "Jane"
```
```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customers = $customersApi->_list(10, 0);
$customers->_embedded->customers[0]->firstName; # => "Jane"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
customer = app_token.get('customers', limit = 10)
customer.body['_embedded']['customers'][0]['firstName'] # => 'Jane'
```
```javascript
appToken
  .get('customers', { limit: 10 })
  .then(res => res.body._embedded.customers[0].firstName); // => 'Jane'
```

## Retrieve a customer

This section shows you how to retrieve a Customer belonging to the authorized user Account. Each `Customer` id is a part of its location resource. The developer can pass either an `id` or the entire `location` resource to make this request.

### HTTP request
`GET https://api.dwolla.com/customers/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Customer unique identifier. |

### Errors
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
```
```ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
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
customer_url = 'https://api-sandbox.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8'

# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
customer = app_token.get(customer_url)
customer.body['firstName']
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/07D59716-EF22-4FE6-98E8-F3190233DFB8';

appToken
  .get(customerUrl)
  .then(res => res.body.firstName); // => 'Jane'
```

## Create an on-demand transfer authorization

This section outlines how to create an on-demand bank transfer authorization for your Customer. On-demand authorization allows Customers to authorize Dwolla to transfer variable amounts from their bank account using ACH at a later point in time for products or services delivered. This on-demand authorization is supplied along with the Customer's bank details when creating a [new Customer funding source](#new-funding-source-for-a-customer).

When on-demand authorization is enabled for your application the Customer is presented with text on a “add bank account” screen in your user interface(UI) giving authorization to Dwolla for future variable payments. **Note:** On-demand payments come as part of our Access API and requires additional approval before getting started. Please [contact Sales](https://www.dwolla.com/contact?b=apidocs) for more information on enabling.

### HTTP request
`POST https://api.dwolla.com/on-demand-authorizations`

### HTTP Status and Error Codes
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
/**
 * No example for this language yet.
 **/
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
on_demand_authorization = app_token.post('on-demand-authorizations')
on_demand_authorization.body['buttonText'] # => 'Agree & Continue'
```
```javascript
appToken
  .post('on-demand-authorizations')
  .then(res => res.body.buttonText); // => "Agree & Continue"
```

## Create a funding source for a customer
There are two methods available for adding a bank or credit union account to a Customer. You can either collect the Customer's bank account information and pass it to Dwolla via the [new Customer funding source](#new-funding-source-for-a-customer) endpoint, or you can send the Customer through the the [Instant Account Verification](#instant-account-verification-iav) (IAV) flow which will add and verify a bank account within seconds.

Before a Dwolla account or Access API Customer is eligible to transfer money from their bank or credit union account they need to verify ownership of the account, either via Instant Account Verification (IAV) or micro-deposits. For more information on bank account verification, reference this [funding source verification](https://developers.dwolla.com/resources/funding-source-verification.html) resource article.

### New funding source for a customer
Create a new Funding Source for a Customer.  Customers can have a maximum of 6 funding sources.

### HTTP request
`POST https://api.dwolla.com/customers/{id}/funding-sources`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| _links | no | object | A <code>_links</code> JSON object containing an `on-demand-authorization` link relation. See example raw request and response below. |
| routingNumber | yes | string | The bank account's routing number. |
| accountNumber | yes | string | The bank account number. |
| type | yes | string | Type of bank account: `checking` or `savings`. |
| name | yes | string | Arbitrary nickname for the funding source. Must be 50 characters or less. |
| channels | no | array | An array containing a list of processing channels.  ACH is the default processing channel for bank transfers. Acceptable value for channels is: "wire". e.g. `“channels”: [ “wire” ]`. A funding source (Bank Account) added using the wire channel only supports a funds transfer going to the bank account from a balance. As a result, wire as a destination funding source can only be added where the Customer account type is a Verified Customer. **Note:** `channels` is a premium feature that must be enabled on your account and is only available to select [Access API](https://www.dwolla.com/access-api) partners. |

### HTTP Status and Error Codes
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
  "type": "checking",
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
  "type" => "checking",
  "name" => "Jane Doe’s Checking"
], "https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C");
$fundingSource; # => "https://api-sandbox.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
customer_url = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
request_body = {
  routingNumber: '222222226',
  accountNumber: '123456789',
  type: 'checking',
  name: 'Jane Doe’s Checking'
}

funding_source = app_token.post "#{customer_url}/funding-sources", request_body
funding_source.headers[:location] # => "https://api-sandbox.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
customer_url = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
request_body = {
  'routingNumber': '222222226',
  'accountNumber': '123456789',
  'type': 'checking',
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
  'type': 'checking',
  'name': 'Jane Doe’s Checking'
};

appToken
  .post(`${customerUrl}/funding-sources`, requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/funding-sources/375c6781-2a17-476c-84f7-db7d2f6ffb31'
```
### Instant account verification (IAV)
IAV is a simple and secure process which requires both server-side and client-side interaction. Your server requests a [single-use token](#generate-an-iav-token) which is used to represent the Customer that is adding or verifying their bank. The client-side implementation includes the dwolla.js library on the page that is used to render the IAV flow.

```javascriptnoselect
<script src="https://cdn.dwolla.com/1/dwolla.js"></script>
<script type="text/javascript">
  var iavToken = '4adF858jPeQ9RnojMHdqSD2KwsvmhO7Ti7cI5woOiBGCpH5krY';
  dwolla.configure('sandbox');
  dwolla.iav.start(iavToken, { container: 'iavContainer' }, function(err, res) {
    console.log('Error: ' + JSON.stringify(err) + ' -- Response: ' + JSON.stringify(res))
  })
</script>
```

### Generate an IAV token

Get a single-use IAV token for a Customer.

### HTTP Request
`POST https://api.dwolla.com/customers/{id}/iav-token`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Customer unique identifier. |

### Errors
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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
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
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
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

### Initiate IAV flow

Initiate instant account verification for a Customer.

#### dwolla.js
`dwolla.js` is a JavaScript library that gives you the ability to render the IAV flow within a specified container. Call the function `dwolla.iav.start()` and pass the following arguments: the container where you want IAV to render, the Customer's single-use [IAV token](#generate-an-iav-token), and a callback to handle the `response` or `error`. This will initiate an HTTP request asking Dwolla to load IAV in the specified container. Once the Customer successfully completes the IAV flow, Dwolla sends a response that includes either an error or a link to the newly created and verified funding source resource.

#### Usage and configuration

##### Include dwolla.js

**Development version:**
`<script src="https://cdn.dwolla.com/1/dwolla.js"></script>`

**Production (minified) version:**
`<script src="https://cdn.dwolla.com/1/dwolla.min.js"></script>`

##### Configure dwolla.js

```javascriptnoselect
// Sandbox
dwolla.configure('sandbox');

// Production
dwolla.configure('prod');
```
##### Example

```noselect
<head>
<script src="https://cdn.dwolla.com/1/dwolla.js"></script>
<!-- jQuery is used for example purposes -->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
</head>

<div id="controls">
  <input type="button" id="start" value="Start">
</div>
<div id="iavContainer"></div>

<script type="text/javascript">
$('#start').click(function() {
  var iavToken = '4adF858jPeQ9RnojMHdqSD2KwsvmhO7Ti7cI5woOiBGCpH5krY';
  dwolla.configure('sandbox');
  dwolla.iav.start(iavToken, {
    container: 'iavContainer',
    stylesheets: [
      'http://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext',
      'http://myapp.com/iav/customStylesheet.css'
    ],
    microDeposits: false,
    fallbackToMicroDeposits: true
  }, function(err, res) {
    console.log('Error: ' + JSON.stringify(err) + ' -- Response: ' + JSON.stringify(res));
  });
});
</script>
```

### Response:

```noselect
{
  "_links": {
    "funding-source": {
      "href": "https://api.dwolla.com/funding-sources/3daf2382-e0e4-444a-863e-544239a261e3"
    }
  }
}
```

### Errors

| Code | Message |
|--------------|-------------|
| UnexpectedPage |IAV navigated to an unexpected page and was cancelled. |
| InvalidIavToken |Invalid IAV token. |
| UnsupportedBank |The customer's bank is not supported by the IAV flow. |
| RateLimitReached |The customer exceeded the max # of IAV attempts. |

## List funding sources for a customer

Retrieve a list of funding sources that belong to a Customer. By default, all funding sources are returned unless the `removed` querystring parameter is set to `false` in the request.

### HTTP request
`GET https://api.dwolla.com/customers/{id}/funding-sources`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| id | yes | string | Customer's unique identifier. |
| removed | no | string | Filter removed funding sources. Defaults to `true`. Set to `false` to filter out removed funding sources from list (i.e. - /customers/{id}/funding-sources?removed=false). |

### Errors
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
        "created": "2015-10-02T21:00:28.153Z"
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
        "name": "Jane Doe’s Checking",
        "created": "2015-10-02T22:03:45.537Z"
        "fingerprint": "4cf31392f678cb26c62b75096e1a09d4465a801798b3d5c3729de44a4f54c794"
      }
    ]
  }
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
customer_url = 'https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733'

funding_sources = app_token.get "#{customer}/funding-sources"
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
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
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
| endDate | no | string | Only include transactions created before than this date. ISO-8601 format: `YYYY-MM-DD`. Can optionally be used with `startDate` to specify a date range. |
| status | no | string | Filter results on transaction status. Possible values: `pending`, `processed`, `failed`, or `cancelled`. |
| correlationId | no | string | A string value to search on if a `correlationId` was specified on a transfer or mass payment item. |
| limit | no | integer | Number of search results to return. Defaults to 25. |
| offset | no | integer | Number of search results to skip. Used for pagination. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 403 | Not authorized to list transfers. |
| 404 | Customer not found. |

### Request and response

```raw
GET http://api-sandbox.dwolla.com/customers/01B47CB2-52AC-42A7-926C-6F1F50B1F271/transfers
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "first": {
      "href": "https://api-sandbox.dwolla.com/customers/01b47cb2-52ac-42a7-926c-6f1f50b1f271/transfers?limit=25&offset=0"
    },
    "last": {
      "href": "https://api-sandbox.dwolla.com/customers/01b47cb2-52ac-42a7-926c-6f1f50b1f271/transfers?limit=25&offset=0"
    },
    "self": {
      "href": "http://api-sandbox.dwolla.com/customers/01B47CB2-52AC-42A7-926C-6F1F50B1F271/transfers"
    }
  },
  "_embedded": {
    "transfers": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/transfers/4C8AD8B8-3D69-E511-80DB-0AA34A9B2388"
          },
          "source": {
            "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
          },
          "destination": {
            "href": "https://api-sandbox.dwolla.com/customers/01B47CB2-52AC-42A7-926C-6F1F50B1F271"
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
      },
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/transfers/9DC99076-3D69-E511-80DB-0AA34A9B2388"
          },
          "source": {
            "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
          },
          "destination": {
            "href": "https://api-sandbox.dwolla.com/customers/01B47CB2-52AC-42A7-926C-6F1F50B1F271"
          }
        },
        "id": "9DC99076-3D69-E511-80DB-0AA34A9B2388",
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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
customer_url = 'http://api-sandbox.dwolla.com/customers/01B47CB2-52AC-42A7-926C-6F1F50B1F271'

transfers = app_token.get "#{customer_url}/transfers"
transfers._embedded.transfers[0].status # => "pending"
```
```php
<?php
$customerUrl = 'http://api-sandbox.dwolla.com/customers/01B47CB2-52AC-42A7-926C-6F1F50B1F271';

$TransfersApi = new DwollaSwagger\TransfersApi($apiClient);

$transfers = $TransfersApi->getCustomerTransfers($customerUrl);
$transfers->_embedded->transfers[0]->status; # => "pending"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
customer_url = 'http://api-sandbox.dwolla.com/customers/01B47CB2-52AC-42A7-926C-6F1F50B1F271'

transfers = app_token.get('%s/transfers' % customer_url)
transfers.body['_embedded']['transfers'][0]['status'] # => 'pending'
```
```javascript
var customerUrl = 'http://api-sandbox.dwolla.com/customers/01B47CB2-52AC-42A7-926C-6F1F50B1F271';

appToken
  .get(`${customerUrl}/transfers`)
  .then(res => res.body._embedded.transfers[0].status); // => "pending"
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
| correlationId | no | string | A unique string value attached to a transfer which can be used for traceability between Dwolla and a partner application. Must be less than 255 characters and contain no spaces. Acceptable characters are: a-Z, 0-9, -, ., and _.

### HTTP Status and Error Codes
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
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
customer_url = 'https://api-sandbox.dwolla.com/customers/ca32853c-48fa-40be-ae75-77b37504581b'

mass_payments = app_token.get "#{customer_url}/mass-payments", limit: 10
mass_payments._embedded['mass-payments'][0].status # => "complete"
```
```php
/**
 *  No example for this language yet. Coming soon.
 **/
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
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
