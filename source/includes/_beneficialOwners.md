# Beneficial owners

Verified Customers of type `business` are required to verify the identity of beneficial owners in addition to the controller of the business if they are one of the following business types:

* Corporation
* LLC
* Partnership

For more information on how to add beneficial owners, or to learn more on whether certain business types are exempt, check out our [beneficial owner developer resource article](https://developers.dwolla.com/resources/business-verified-customer/adding-beneficial-owners.html). Beneficial owners may be non-US persons. 

### Beneficial owners resource

| Parameter | Description |
|-----------|------------|
| id | The beneficial owner unique identifier. |
| firstName | The legal first name of the beneficial owner.   |
| lastName |  The legal last name of the beneficial owner. |
| address | The beneficial owner's physical address. |
| verificationStatus | Possible values of `verified`, `document`, or `incomplete`.  |

```noselect
{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/beneficial-owners/caa81a5f-ec1e-4559-8b32-d90655bfd03c",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "beneficial-owner"
        }
    },
    "id": "caa81a5f-ec1e-4559-8b32-d90655bfd03c",
    "firstName": "Joe",
    "lastName": "owner",
    "address": {
        "address1": "12345 18th st",
        "address2": "Apt 12",
        "address3": "",
        "city": "Des Moines",
        "stateProvinceRegion": "IA",
        "country": "US",
        "postalCode": "50265"
    },
    "verificationStatus": "verified"
}
```

## Create a beneficial owner

This section details how to create a new beneficial owner. To create `beneficial owners`, you need to collect the beneficial owner's full name, ssn, date of birth, and permanent address. Optionally, passport information must be included for non-US persons that do not have a US issued SSN. `Beneficial owners` require additional information that will give Dwolla the ability to confirm the identity of the individual.

For more information on how to create a beneficial owner, refer to our [developer resource article](https://developers.dwolla.com/resources/business-verified-customer/adding-beneficial-owners.html).

### HTTP request
`POST https://api.dwolla.com/customers/{id}/beneficial-owners`

### Request Parameters

| Parameter | Required | Type | Description |
| ---------------|--------------|--------|----------------|
| firstName | yes  |  string |  The legal first name of the beneficial owner. |
| lastName | yes | string | The legal last name of the beneficial owner. |
| ssn | conditional | string | **Full nine digits** of beneficial owner’s social security number. **Required** for US persons. If ssn is omitted, [passport](#passport-json-object) is required. |
| dateOfBirth | Yes | string | beneficial owner’s date of birth in `YYYY-MM-DD` format. Must be 18 years or older. |
| address | Yes | object |  An [address JSON object](/#address-json-object). Full address of the beneficial owner's physical address.  |
| passport | conditional | object | An optional [passport JSON object](/#passport-json-object). **Required** for non-US persons. Includes passport identification number and country. If [passport](#passport-json-object) is omitted, ssn is required. |

### Address JSON object

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| address1 | yes | string | First line of the street address of the beneficial owner's permanent residence. **Note:** PO Boxes are not allowed. |
| address2 | no | string | Second line of the street address of the beneficial owner's permanent residence. **Note:** PO Boxes are not allowed. |
| address3 | no | string | Third line of the street address of the beneficial owner's permanent residence. **Note:** PO Boxes are not allowed. |
| city | yes | string | City of beneficial owner's permanent residence. |
| stateProvinceRegion | yes | string |  **US persons** - Two-letter US state abbreviation code of Beneficial Owner’s physical address. For two-letter US state abbreviation reference, check out the [US Postal Service guide](https://pe.usps.com/text/pub28/28apb.htm). <br> **Non-US persons** - Two-letter state, province, or region ISO abbreviation code of Beneficial Owner's physical address. For two-letter ISO abbreviation reference, check out the [ISO guide](https://en.wikipedia.org/wiki/ISO_3166-1). |
| country | yes | string | Country of beneficial owner's permanent residence. Two digit ISO code, e.g. `US`. |
| postalCode | conditional | string | Postal code of beneficial owner's permanent residence. Should be a five digit postal code, e.g. `50314`. Optional if beneficial owner is a non-US person. |

### Passport JSON object

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| number | conditional | string | Required if beneficial owner is a non-US person and has no Social Security number. |
| country | conditional | string | Country of issued passport. |

### Request and response

```raw
POST https://api-sandbox.dwolla.com/customers/81696e5d-a593-45a6-8863-3c20ad634de5/beneficial-owners
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "firstName": "document",
  "lastName": "owner",
  "ssn": "123-46-7890",
  "dateOfBirth": "1960-11-30",
  "address": {
    "address1": "123 Main St.",
    "city": "New York",
    "stateProvinceRegion": "NY",
    "country": "US",
    "postalCode": "10005"
  }
}

HTTP/1.1 201 Created
Location: https://api.dwolla.com/beneficial-owners/FC451A7A-AE30-4404-AB95-E3553FCD733F
```

```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);
$verified_customer = 'https://api-sandbox.dwolla.com/customers/81696e5d-a593-45a6-8863-3c20ad634de5';

$addOwner = $customersApi->addBeneficialOwner([
      'firstName' => 'document',
      'lastName'=> 'owner',
      'dateOfBirth' => '1990-11-11',
      'ssn' => '123-34-9876',
      'address' =>
      [
          'address1' => '18749 18th st',
          'address2' => 'apt 12',
          'address3' => '',
          'city' => 'Des Moines',
          'stateProvinceRegion' => 'IA',
          'postalCode' => '50265',
          'country' => 'US'
      ],
  ], $verified_customer);
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/81696e5d-a593-45a6-8863-3c20ad634de5'
request_body = {
  :firstName => 'John',
  :lastName => 'Doe',
  :ssn => '123-46-7890',
  :dateOfBirth => '1970-01-01',
  :address => {
    :address1 => '99-99 33rd St',
    :city => 'Some City',
    :stateProvinceRegion => 'NY',
    :country => 'US',
    :postalCode => '11101'
  }
}

beneficial_owner = app_token.post "#{customer_url}/beneficial-owners", request_body
beneficial_owner.response_headers[:location] # => "https://api-sandbox.dwolla.com/beneficial-owners/AB443D36-3757-44C1-A1B4-29727FB3111C"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
request_body = {
  'firstName': 'John',
  'lastName': 'Doe',
  'dateOfBirth': '1970-01-01',
  'ssn': '123-46-7890',
  'address': {
    'address1': '99-99 33rd St',
    'city': 'Some City',
    'stateProvinceRegion': 'NY',
    'country': 'US',
    'postalCode': '11101'
  }
}

beneficial_owner = app_token.post('%s/beneficial-owners' % customer_url, request_body)
beneficial_owner.headers['location'] # => 'https://api-sandbox.dwolla.com/beneficial-owners/AB443D36-3757-44C1-A1B4-29727FB3111C'
```

```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/07d59716-ef22-4fe6-98e8-f3190233dfb8';
var requestBody = {
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1970-01-01',
  ssn: '123-56-7890',
  address: {
    address1: '99-99 33rd St',
    city: 'Some City',
    stateProvinceRegion: 'NY',
    country: 'US'
    postalCode: '11101'
  }
};

appToken
  .post(`${customerUrl}/beneficial-owners`, requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/beneficial-owners/FC451A7A-AE30-4404-AB95-E3553FCD733F'
```

## Retrieve a beneficial owner

This section contains information on how to retrieve a beneficial owner which belongs to a Customer.

### HTTP request
`GET https://api.dwolla.com/beneficial-owners/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Beneficial owner unique identifier. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfB8
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY


```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfB8'

beneficial_owner = app_token.get beneficial_owner_url
beneficial_owner.firstName # => "Jane"
```
```php
<?php
$beneficialOwnersApi = new DwollaSwagger\BeneficialownersApi($apiClient);

$beneficialOwnerUrl = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfB8';
$beneficialOwner = $beneficialOwnersApi->getById($beneficialOwnerUrl);
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfB8'

beneficial_owner = app_token.get(beneficial_owner_url)
beneficial_owner.body['firstName']
```
```javascript
var beneficialOwnerUrl = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8';

appToken
  .get(beneficialOwnerUrl)
  .then(res => res.body.firstName); // => 'Jane'
```

## List beneficial owners

This section contains information on how to retrieve a list of beneficial owners that belong to a Customer.

### HTTP request
`GET https://api.dwolla.com/customers/{id}/beneficial-owners`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Customer unique identifier. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/customers/81696e5d-a593-45a6-8863-3c20ad634de5/beneficial-owners
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/customers/81696e5d-a593-45a6-8863-3c20ad634de5/beneficial-owners",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "beneficial-owner"
        }
    },
    "_embedded": {
        "beneficial-owners": [
            {
                "_links": {
                    "self": {
                        "href": "https://api-sandbox.dwolla.com/beneficial-owners/55469604-40ab-44b6-962f-de2c0837ba98",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "beneficial-owner"
                    },
                    "verify-with-document": {
                        "href": "https://api-sandbox.dwolla.com/beneficial-owners/55469604-40ab-44b6-962f-de2c0837ba98/documents",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "document"
                    }
                },
                "id": "55469604-40ab-44b6-962f-de2c0837ba98",
                "firstName": "document",
                "lastName": "owner1",
                "address": {
                    "address1": "18749 18th st",
                    "address2": "apt 12",
                    "address3": "",
                    "city": "Des Moines",
                    "stateProvinceRegion": "IA",
                    "country": "US",
                    "postalCode": "50265"
                },
                "verificationStatus": "document"
            },
            {
                "_links": {
                    "self": {
                        "href": "https://api-sandbox.dwolla.com/beneficial-owners/caa81a5f-ec1e-4559-8b32-d90655bfd03c",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "beneficial-owner"
                    }
                },
                "id": "caa81a5f-ec1e-4559-8b32-d90655bfd03c",
                "firstName": "Joe",
                "lastName": "owner2",
                "address": {
                    "address1": "18749 18th st",
                    "address2": "apt 12",
                    "address3": "",
                    "city": "Des Moines",
                    "stateProvinceRegion": "IA",
                    "country": "US",
                    "postalCode": "50265"
                },
                "verificationStatus": "verified"
            }
        ]
    },
    "total": 2
}

```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2'

beneficial_owners = app_token.get "#{customer_url}/beneficial-owners"
beneficial_owners._embedded['beneficial-owners'][0].id # => "56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc"
```
```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customerUrl = 'https://api-sandbox.dwolla.com/customers/81696e5d-a593-45a6-8863-3c20ad634de5';
$beneficialOwnerList = $customersApi->getBeneficialOwners($customerUrl);
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2'

beneficial_owners = app_token.get('%s/beneficial-owners' % customer_url)
beneficial_owners.body['id']
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2';

token
  .get(`${customerUrl}/beneficial-owners`)
  .then(res => res.body._embedded['beneficial-owners'][0].id); // => '56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc'
```

## Update a beneficial owner

This endpoint can be used to update a beneficial owner's information to `retry` verification. A beneficial owner's information can only be updated if their verification status is `incomplete`.

### HTTP request
`POST https://api.dwolla.com/beneficial-owners/{id}`

### Request Parameters

| Parameter | Required | Type | Description |
| ---------------|--------------|--------|----------------|
| firstName | yes  |  string |  The legal first name of the beneficial owner. |
| lastName | yes | string | The legal last name of the beneficial owner. |
| ssn | conditional | string | **Full nine digits** of beneficial owner’s social security number. If ssn is omitted, [passport](#passport-json-object) is required. |
| dateOfBirth | Yes | string | beneficial owner’s date of birth in `YYYY-MM-DD` format. Must be 18 years or older. |
| address | Yes | object |  An [address JSON object](/#address-json-object). Full address of the beneficial owner's physical address.  |
| passport | conditional | object | An optional [passport JSON object](/#passport-json-object). Required for non-US persons. Includes passport identification number and country. |

### Address JSON object

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|
| address1 | yes | string | First line of the street address of the beneficial owner's permanent residence. **Note:** PO Boxes are not allowed. |
| address2 | no | string | Second line of the street address of the beneficial owner's permanent residence. **Note:** PO Boxes are not allowed. |
| address3 | no | string | Third line of the street address of the beneficial owner's permanent residence. **Note:** PO Boxes are not allowed. |
| city | yes | string | City of beneficial owner's permanent residence. |
| stateProvinceRegion | yes | string | Two-letter US state or territory abbreviation code of beneficial owner’s physical address. For two-letter abbreviation reference, check out the [US Postal Service guide](https://pe.usps.com/text/pub28/28apb.htm). |
| country | yes | string | Country of beneficial owner's permanent residence. Two digit ISO code, e.g. `US`. |
| postalCode | yes | string | Postal code of beneficial owner's permanent residence. Should be a five digit postal code, e.g. `50314`. |

### Passport JSON object

| Parameter | Required | Type | Description |
|-----------|----------|------|-------------|
| number | conditional | string | Required if beneficial owner is a non-US person and has no Social Security number. |
| country | conditional | string | Country of issued passport. |

### Request and response

```raw
POST https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "firstName": "beneficial",
  "lastName": "owner",
  "ssn": "123-54-6789",
  "dateOfBirth": "1963-11-11",
  "address": {
    "address1": "123 Main St.",
    "address2": "Apt 123",
    "city": "Des Moines",
    "stateProvinceRegion": "IA",
    "country": "US",
    "postalCode": "50309"
  }
}

...

{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "beneficial-owner"
        }
    },
    "id": "00cb67f2-768c-4ee3-ac81-73bc4faf9c2b",
    "firstName": "beneficial",
    "lastName": "owner",
    "address": {
        "address1": "123 Main St.",
        "address2": "Apt 123",
        "city": "Des Moines",
        "stateProvinceRegion": "IA",
        "country": "US",
        "postalCode": "50309"
    },
    "verificationStatus": "verified"
}
```
```php
<?php
$beneficialOwnersApi = new DwollaSwagger\BeneficialownersApi($apiClient);

$beneficialOwnerUrl = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8';
$updateBeneficialOwner = $beneficialOwnersApi->update([
      'firstName' => 'beneficial',
      'lastName'=> 'owner',
      'dateOfBirth' => '1963-11-11',
      'ssn' => '123-54-6789',
      'address' =>
      [
          'address1' => '123 Main St.',
          'address2' => 'Apt 123',
          'city' => 'Des Moines',
          'stateProvinceRegion' => 'IA',
          'postalCode' => '50309',
          'country' => 'US'
      ],
  ], $beneficialOwnerUrl);

$updateBeneficialOwner->id; # => "00cb67f2-768c-4ee3-ac81-73bc4faf9c2b"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8'
request_body = {
  :firstName => 'beneficial',
  :lastName => 'owner',
  :ssn => '123-54-6789',
  :dateOfBirth => '1963-11-11',
  :address => {
    :address1 => '123 Main St',
    :city => 'Des Moines',
    :stateProvinceRegion => 'IA',
    :country => 'US',
    :postalCode => '50309'
  }
}

update_beneficial_owner = app_token.post beneficial_owner_url, request_body
update_beneficial_owner.id # => "00cb67f2-768c-4ee3-ac81-73bc4faf9c2b"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8'
request_body = {
  'firstName': 'beneficial',
  'lastName': 'owner',
  'dateOfBirth': '1963-11-11',
  'ssn': '123-54-6789',
  'address': {
    'address1': '123 Main St',
    'city': 'Des Moines',
    'stateProvinceRegion': 'IA',
    'country': 'US',
    'postalCode': '50309'
  }
}

update_beneficial_owner = app_token.post(beneficial_owner_url, request_body)
update_beneficial_owner.body['id'] # => '00cb67f2-768c-4ee3-ac81-73bc4faf9c2b'
```
```javascript
var beneficialOwnerUrl = 'https://api-sandbox.dwolla.com/beneficial-owners/07d59716-ef22-4fe6-98e8-f3190233dfb8';
var requestBody = {
  firstName: 'beneficial',
  lastName: 'owner',
  dateOfBirth: '1963-11-11',
  ssn: '123-54-6789',
  address: {
    address1: '123 Main St',
    city: 'Des Moines',
    stateProvinceRegion: 'IA',
    country: 'US'
    postalCode: '50309'
  }
};

appToken
  .post(beneficialOwnerUrl, requestBody)
  .then(res => res.body.id); // => '00cb67f2-768c-4ee3-ac81-73bc4faf9c2b'
```

### HTTP status and error codes
| HTTP Status | Message |
|--------------|-------------|
| 400 | Duplicate customer or validation error. |
| 403 | Not authorized to create customers. |

## Remove a beneficial owner

Delete a beneficial owner. A removed beneficial owner cannot be retrieved after being removed.

### HTTP request

`DELETE https://api.dwolla.com/beneficial-owners/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | id of beneficial owner to delete. |

### HTTP status and error codes
| HTTP Status | Message |
|--------------|-------------|
| 404 | Beneficial owner not found. |

### Request and response

```raw
DELETE https://api-sandbox.dwolla.com/beneficial-owners/692486f8-29f6-4516-a6a5-c69fd2ce854c
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/beneficial-owners/0f394602-d714-4d77-9d58-3a3e8394bcdd",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "beneficial-owner"
        }
    },
    "id": "0f394602-d714-4d77-9d58-3a3e8394bcdd",
    "firstName": "B",
    "lastName": "Owner",
    "address": {
        "address1": "123 Main St.",
        "city": "New York",
        "stateProvinceRegion": "NY",
        "country": "US",
        "postalCode": "10005"
    },
    "verificationStatus": "verified"
}

...

HTTP 200 OK
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/692486f8-29f6-4516-a6a5-c69fd2ce854c'

app_token.delete beneficial_owner_url
```
```javascript
var beneficialOwnerUrl = 'https://api-sandbox.dwolla.com/beneficial-owners/692486f8-29f6-4516-a6a5-c69fd2ce854c';

appToken.delete(beneficialOwnerUrl);
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/692486f8-29f6-4516-a6a5-c69fd2ce854c'

app_token.delete(beneficial_owner_url)
```
```php
<?php
$beneficialOwnersApi = new DwollaSwagger\BeneficialownersApi($apiClient);
$beneficialOwner = 'https://api-sandbox.dwolla.com/beneficial-owners/692486f8-29f6-4516-a6a5-c69fd2ce854c';
$deletedBeneficialOwner = $beneficialOwnersApi->deleteById($beneficialOwner);
?>
```

## Retrieve beneficial ownership status

This section contains information on how to retrieve a Customer's beneficial ownership status.

### HTTP request
`GET https://api.dwolla.com/customers/{id}/beneficial-ownership`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Customer unique identifier. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/customers/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/customers/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc/beneficial-ownership",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "beneficial-ownership"
        }
    },
    "status": "uncertified"
}

```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc'

beneficial_ownership = app_token.get "#{customer_url}/beneficial-ownership"
beneficial_ownership.status # => "uncertified"
```
```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$newCustomer = 'https://api-sandbox.dwolla.com/customers/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc';
$customerOwnershipStatus = $customersApi->getOwnershipStatus($newCustomer);
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc'

beneficial_ownership = app_token.get('%s/beneficial-ownership' % customer_url)
beneficial_ownership.body['status'] # => 'uncertified'
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc';

appToken
  .get(`${customer_url}/beneficial-ownership`)
  .then(res => res.body.status); // => "uncertified"
```

## Certify beneficial ownership

This section contains information on how to certify beneficial ownership for a business Verified Customer.

### HTTP request
`POST https://api.dwolla.com/customers/{id}/beneficial-ownership`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Customer unique identifier. |

### Request and response

```raw
POST https://api-sandbox.dwolla.com/customers/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc/beneficial-ownership
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
  "status": "certified"
}

...

{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/customers/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc/beneficial-ownership",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "beneficial-ownership"
        }
    },
    "status": "certified"
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'
request_body = {
  :status => "certified"
}

app_token.post "#{customer_url}/beneficial-ownership", request_body
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/e52006c3-7560-4ff1-99d5-b0f3a6f4f909';
var requestBody = {
  status: 'certified'
};

appToken.post(`${customerUrl}/beneficial-ownership`, requestBody);
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/e52006c3-7560-4ff1-99d5-b0f3a6f4f909'
request_body = {
    "status": "certified"
}

app_token.post('%s/beneficial-ownership' % customer_url, request_body)
```
```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);
$customerId = 'https://api-sandbox.dwolla.com/customers/e52006c3-7560-4ff1-99d5-b0f3a6f4f909';
$certifyCustomer = $customersApi->changeOwnershipStatus(['status' => 'certified' ], $customerId);
?>
```

---
