# Customers

```shell
{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F"
    }
  },
  "id": "FC451A7A-AE30-4404-AB95-E3553FCD733F",
  "firstName": "Bob",
  "lastName": "Dole",
  "email": "bob@dole.com",
  "type": "unverified",
  "status": "unverified",
  "created": "2015-09-03T23:56:10.023Z"
}
```

A customer represents an individual or business with whom you intend to transact with. In order to manage a user's Customers, the `ManageCustomers` OAuth scope is required. Personal and business type customers can do more than unverified customers but require more verification. Personal and business type customers can hold a balance within Dwolla, and can source transfers.

### Customer Resource

| Parameter | Description
|-----------|------------|
|id | Customer unique identifier.
|firstName | Customer's first name.
|lastName | Customer's last name.
|email | Customer's email address.
|type | Either `unverified`, `personal`, or `business`.
|status | Either `unverified`, `retry`, `document`, `verified`, or `suspended`.
|created | ISO-8601 timestamp.

## New Customer

> Request:

```shell
POST /customers
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
```

```json
{
  "firstName": "Bob",
  "lastName": "Dole",
  "email": "bob@dole.com",
  "ipAddress": "99.99.99.99",
  "type": "personal",
  "address1": "Some Adress Line 1",
  "address2": "Some Adress Line 2",
  "city": "San Francisco",
  "state": "CA",
  "postalCode": "94108",
  "dateOfBirth": "1990-03-02",
  "tin": "123121234",
  "phone": "1231231234"
}
```

> Response:

```shell
HTTP/1.1 201 Created
Location: https://api.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F
```

Create a new Customer.

<aside class="reminder">This endpoint [requires](#authentication) an OAuth access token with the `ManageCustomers` [scope](#oauth-scopes).</aside>

### HTTP Request
`POST https://api.dwolla.com/customers`

### Request Parameters
Parameter | Optional? | Description
----------|----------|-------------
firstName | no | Customer's first name.
lastName | no | Customer's last name.
email | no | Customer's email address.
ipAddress | yes | Customer's IP address.
type | no | Either `unverified`, `personal`, or `business`.
address1 | no | Customer's current street address.
address2 | no | Customer's current apartment or suite number.
city | no | Customer's current city.
state | no | Customer's current state.
postalCode | no | Customer's current postal code (zip).
tin | no | Customer's Employment Identification Number (if business) or SSN (otherwise).
phone | no | Customer's phone number.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 400 | Duplicate customer or validation error.
| 403 | Not authorized to create customers.
| 404 | Customer not found.

## List Customers

> Request:

```shell
GET /customers
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
```

> Response:

```json
{
  "_links": {
    "first": {
      "href": "https://api.dwolla.com/customers?limit=25&offset=0"
    },
    "last": {
      "href": "https://api.dwolla.com/customers?limit=25&offset=0"
    },
    "self": {
      "href": "https://api.dwolla.com/customers?limit=25&offset=0"
    }
  },
  "_embedded": {
    "customers": [
      {
        "_links": {
          "self": {
            "href": "https://api.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F"
          }
        },
        "id": "FC451A7A-AE30-4404-AB95-E3553FCD733F",
        "firstName": "Bob",
        "lastName": "Dole",
        "email": "bob@dole.com",
        "type": "unverified",
        "status": "unverified",
        "created": "2015-09-03T23:56:10.023Z"
      }
    ]
  },
  "total": 1
}
```

Retrieve a list of Customers which belong to the authorized user.

<aside class="reminder">This endpoint [requires](#authentication) an OAuth access token with the `ManageCustomers` [scope](#oauth-scopes).</aside>

### HTTP Request
`GET https://api.dwolla.com/customers`

### Request Parameters

Parameter | Optional? | Description
----------|------------|-------------
limit | yes | How many results to return.
offset | yes | How many results to skip.

### Errors
| HTTP Status | Message |
|--------------|-------------|

## Get a Customer by ID

> Request:

```shell
GET /customers/07D59716-EF22-4FE6-98E8-F3190233DFB8
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
```

> Response:

```json
{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/customers/FC451A7A-AE30-4404-AB95-E3553FCD733F"
    }
  },
  "id": "FC451A7A-AE30-4404-AB95-E3553FCD733F",
  "firstName": "Bob",
  "lastName": "Dole",
  "email": "bob@dole1.com",
  "type": "unverified",
  "status": "unverified",
  "created": "2015-09-03T23:56:10.023Z"
}
```

Retrieve a Customer which belongs to the authorized user.

<aside class="reminder">This endpoint [requires](#authentication) an OAuth access token with the `ManageCustomers` [scope](#oauth-scopes).</aside>

### HTTP Request
`GET https://api.dwolla.com/customers/{id}`

### Request Parameters

Parameter | Optional? | Description
----------|------------|-------------
id | no | Customer unique identifier.

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 403 | Not authorized to get a customer by id. |
| 404 | Customer not found. |