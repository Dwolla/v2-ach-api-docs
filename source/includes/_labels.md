# Labels

A **Label** represents a designated portion of funds within a [Verified Customer's](https://developers.dwolla.com/resources/account-types.html#verified-customer) balance. To create a label, you’ll specify the ID of a Verified Customer and an amount. Your application will maintain any other Label information or associations. Labels can be created, updated, and deleted. You can also list all Labels for a Verified Customer Record and list all entries for a specified Label. Note that a Verified Customer’s labeled amounts cannot exceed the balance available in such Verified Customer's account.

<ol class="alerts">
    <li class="alert icon-alert-info">This section outlines a premium feature for the [Dwolla API](https://www.dwolla.com/platform/). To learn more about enabling this functionality, please [contact Sales](https://www.dwolla.com/contact?b=apidocs).</li>
</ol>

### Label Links

| Link    | Description                                                           |
|---------|-----------------------------------------------------------------------|
| self    | URL of the Label resource.                                            |
| ledger-entries | GET this link to list the ledger entries for a Label. |
| update  | GET this link to update the ledger for this Verified Customer. |
| remove  | GET this link to remove the Label for this Verified Customer. |

### Label resource

| Parameter | Description                |
|-----------|----------------------------|
| _links    | A _links JSON object that contains links to suggested resources and actions available based on the current context. |
| id        | A Label unique identifier. |
| amount    | An Amount JSON object that contains value and currency keys. Reference the amount object to learn more. |
| created   | ISO-8601 timestamp. |

### Amount object

| Parameter | Description                |
|-----------|----------------------------|
| value     | Amount of funds.           |
| currency  | Acceptable values: `USD`   |

## Create a label

This section outlines how to create a new Label. When creating a Label you’ll specify an `amount` as well as the ID of a Verified Customer that the label is tied to. Upon success, the API will return a `201` with a link to the created Label resource in the `location` header.

### HTTP request

`POST https://api.dwolla.com/customers/{id}/labels`

### Request parameters

| Parameter | Required | Type   | Description                |
|-----------|----------|--------|----------------------------|
| id        | yes      | string | A Customer's unique identifier. |
| amount    | yes      | object | Amount of funds to label for a Verified Customer. An amount object. Reference the amount object to learn more.|

### HTTP status and error codes

| HTTP Status | Code          | Description |
|-------------|---------------|--------------
| 201         | created       | A Label was created. |
| 400         | ValidationError | Required - Field is required. <br> InvalidFormat - InvalidFormat. <br> Invalid - Amount can not cause label balance to be negative. |
| 403         | NotAuthorized | Not authorized to create Labels. [Contact us](https://www.dwolla.com/contact/) to enable this functionality. |
| 404         | NotFound      | Customer not found. Check CustomerId. |

### Request and response

```raw
POST https://api.dwolla.com/customers/{id}/labels
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
    "amount": {
    	"currency": "USD",
    	"value": "10.00"
    }
}

HTTP/1.1 201 Created
Location: https://api.dwolla.com/labels/e217bcac-628a-456d-a375-6cc51230616f
```
```php
<?php
$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$label = $customersApi->createLabel([
  'amount' => [
    'currency' => 'USD',
    'value' => '10.00'
  ]
], "https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C");
$label; # => "https://api-sandbox.dwolla.com/labels/375c6781-2a17-476c-84f7-db7d2f6ffb31"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
request_body = {
  :amount => {
    :currency => "USD",
    :value => "10.00"
  }
}

label = app_token.post "#{customer_url}/labels", request_body
label.response_headers[:location] # => "https://api-sandbox.dwolla.com/labels/375c6781-2a17-476c-84f7-db7d2f6ffb31"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C'
request_body = {
  'amount': {
    'currency': 'USD',
    'value': '10.00'
  }
}

label = app_token.post('%s/labels' % customer_url, request_body)
label.headers['location'] # => 'https://api-sandbox.dwolla.com/labels/375c6781-2a17-476c-84f7-db7d2f6ffb31'
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C';
var requestBody = {
  amount: {
    currency: 'USD',
    value: '10.00'
  }
};

appToken
  .post(`${customerUrl}/labels`, requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/labels/375c6781-2a17-476c-84f7-db7d2f6ffb31'
```

## Retrieve a label

This section outlines how to retrieve a label by its unique identifier.

### HTTP request

`GET https://api.dwolla.com/labels/{id}`

### Request parameters

| Parameter | Required | Type   | Description                  |
|-----------|----------|--------|------------------------------|
| id        | yes      | string | A Label's unique identifier. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "label"
        },
        "update": {
            "href": "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc/ledger-entries",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "ledger-entry"
        },
        "ledger-entries": {
            "href": "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc/ledger-entries",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "ledger-entry"
        },
        "customer": {
            "href": "https://api-sandbox.dwolla.com/customers/315a9456-3750-44bf-8b41-487b10d1d4bb",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        }
    },
    "id": "7e042ffe-e25e-40d2-b86e-748b98845ecc",
    "created": "2019-05-15T22:19:09.635Z",
    "amount": {
        "value": "10.00",
        "currency": "USD"
    }
}
```
```php
<?php
$labelUrl = "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc";

$labelsApi = new DwollaSwagger\LabelsApi($apiClient);

$label = $labelsApi->getLabel($labelUrl);
$label->id; # => "7e042ffe-e25e-40d2-b86e-748b98845ecc"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
label_url = 'https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc'

label = app_token.get label_url
label.id # => "7e042ffe-e25e-40d2-b86e-748b98845ecc"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
label_url = 'https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc'

label = app_token.get(label_url)
label.body['id'] # => '7e042ffe-e25e-40d2-b86e-748b98845ecc'
```
```javascript
var labelUrl = 'https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc';

appToken
  .get(labelUrl)
  .then(res => res.body.id); // => '7e042ffe-e25e-40d2-b86e-748b98845ecc'
```

## Create a label ledger entry

To create a new entry on a Label Ledger you’ll specify the ID of the Label, as well as a positive or negative amount value (depending on if the purpose is to increase or decrease the amount tied to a Label). The amount tied to a Label cannot go negative, therefore if the amount of the label ledger entry exceeds the current amount tied to a Label then a validation error will be returned.

### HTTP request

`POST https://api.dwolla.com/labels/{id}/ledger-entries`

| Parameter | Required | Type   | Description                |
|-----------|----------|--------|----------------------------|
| id        | yes      | string | The Id of the Label to update. |
| amount    | yes      | object | Amount of funds to increase or decrease for a Label. To decrease funds in a Label a string numeric value will be supplied and prepended with a “-” operator. An amount object. Reference the amount object to learn more.|

### Request and response

```raw
POST https://api.dwolla.com/labels/e217bcac-628a-456d-a375-6cc51230616f/ledger-entries
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
 "amount": {
   "value": "-5.00",
   "currency": "USD"
 }
}

HTTP/1.1 201 Created
Location: https://api.dwolla.com/ledger-entries/76e5541d-18f4-e811-8112-e8dd3bececa8
```
```php
<?php
$labelsApi = new DwollaSwagger\LabelsApi($apiClient);

$label = $labelsApi->addLedgerEntry([
  'amount' => [
    'currency' => 'USD',
    'value' => '-5.00'
  ]
], "https://api.dwolla.com/labels/e217bcac-628a-456d-a375-6cc51230616f");
$label; # => "https://api-sandbox.dwolla.com/ledger-entries/76e5541d-18f4-e811-8112-e8dd3bececa8"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
label_url = 'https://api.dwolla.com/labels/e217bcac-628a-456d-a375-6cc51230616f'
request_body = {
  :amount => {
    :currency => "USD",
    :value => "-5.00"
  }
}

ledger_entry = app_token.post "#{label_url}/ledger-entries", request_body
ledger_entry.response_headers[:location] # => "https://api-sandbox.dwolla.com/ledger-entries/76e5541d-18f4-e811-8112-e8dd3bececa8"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
label_url = 'https://api.dwolla.com/labels/e217bcac-628a-456d-a375-6cc51230616f'
request_body = {
  'amount': {
    'currency': 'USD',
    'value': '-5.00'
  }
}

ledger_entry = app_token.post('%s/ledger-entries' % label_url, request_body)
ledger_entry.headers['location'] # => 'https://api-sandbox.dwolla.com/ledger-entries/76e5541d-18f4-e811-8112-e8dd3bececa8'
```
```javascript
var labelUrl = 'https://api.dwolla.com/labels/e217bcac-628a-456d-a375-6cc51230616f';
var requestBody = {
  amount: {
    currency: 'USD',
    value: '-5.00'
  }
};

appToken
  .post(`${labelUrl}/ledger-entries`, requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/ledger-entries/76e5541d-18f4-e811-8112-e8dd3bececa8'
```

## Retrieve a label ledger entry

This section outlines how to retrieve a Label Ledger entry by its unique identifier

### HTTP request

`GET https://api.dwolla.com/ledger-entries/{id}`

Request parameters

| Parameter | Required | Type   | Description                  |
|-----------|----------|--------|------------------------------|
| id        | yes      | string | A Label Ledger entry unique identifier. |

### Request and response

```raw
GET https://api.dwolla.com/ledger-entries/32d68709-62dd-43d6-a6df-562f4baec526
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/ledger-entries/32d68709-62dd-43d6-a6df-562f4baec526",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "ledger-entry"
        },
        "label": {
            "href": "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "label"
        }
    },
    "id": "32d68709-62dd-43d6-a6df-562f4baec526",
    "amount": {
        "value": "-5.00",
        "currency": "USD"
    },
    "created": "2019-05-16T01:54:58.062Z"
}
```
```php
<?php
$ledgerEntryUrl = "https://api-sandbox.dwolla.com/ledger-entries/32d68709-62dd-43d6-a6df-562f4baec526";

$ledgerEntriesApi = new DwollaSwagger\LedgerentriesApi($apiClient);

$ledgerEntry = $ledgerEntriesApi->getLedgerEntry($ledgerEntryUrl);
$ledgerEntry->id; # => "7e042ffe-e25e-40d2-b86e-748b98845ecc"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
ledger_entry_url = 'https://api-sandbox.dwolla.com/ledger-entries/32d68709-62dd-43d6-a6df-562f4baec526'

ledger_entry = app_token.get ledger_entry_url
ledger_entry.id # => "32d68709-62dd-43d6-a6df-562f4baec526"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
ledger_entry_url = 'https://api-sandbox.dwolla.com/ledger-entries/32d68709-62dd-43d6-a6df-562f4baec526'

ledger_entry = app_token.get(ledger_entry_url)
ledger_entry.body['id'] # => '32d68709-62dd-43d6-a6df-562f4baec526'
```
```javascript
var ledgerEntryUrl = 'https://api-sandbox.dwolla.com/ledger-entries/32d68709-62dd-43d6-a6df-562f4baec526';

appToken
  .get(ledgerEntryUrl)
  .then(res => res.body.id); // => '32d68709-62dd-43d6-a6df-562f4baec526'
```

## List label ledger entries

This section outlines how to list the history of Label entries. Label ledger entries are sorted by created date in descending order (most recent first).

### HTTP request

`GET https://api.dwolla.com/labels/{id}/ledger-entries`

### Request parameters

| Parameter | Required | Type    | Description                |
|-----------|----------|---------|----------------------------|
| id        | yes      | string  | The Id of the Label for listing label ledger entries. |
| limit     | no       | integer | Number of results to return. Defaults to 25. |
| offset    | no       | integer | Number of results to skip. Used for pagination. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc/ledger-entries
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc/ledger-entries",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "ledger-entry"
        },
        "first": {
            "href": "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc/ledger-entries?limit=25&offset=0",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "ledger-entry"
        },
        "last": {
            "href": "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc/ledger-entries?limit=25&offset=0",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "ledger-entry"
        }
    },
    "_embedded": {
        "ledger-entries": [
            {
                "_links": {
                    "self": {
                        "href": "https://api-sandbox.dwolla.com/ledger-entries/32d68709-62dd-43d6-a6df-562f4baec526",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "ledger-entry"
                    },
                    "label": {
                        "href": "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "label"
                    }
                },
                "id": "32d68709-62dd-43d6-a6df-562f4baec526",
                "amount": {
                    "value": "-5.00",
                    "currency": "USD"
                },
                "created": "2019-05-16T01:54:58.062Z"
            },
            {
                "_links": {
                    "self": {
                        "href": "https://api-sandbox.dwolla.com/ledger-entries/b71ccd39-6b03-4f16-aff0-1ae29eeadaa8",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "ledger-entry"
                    },
                    "label": {
                        "href": "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "label"
                    }
                },
                "id": "b71ccd39-6b03-4f16-aff0-1ae29eeadaa8",
                "amount": {
                    "value": "10.00",
                    "currency": "USD"
                },
                "created": "2019-05-15T22:19:09.635Z"
            }
        ]
    },
    "total": 2
}
```
```php
<?php
$labelUrl = 'https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc';

$labelsApi = new DwollaSwagger\LabelsApi($apiClient);

$ledgerEntries = $labelsApi->getLedgerEntriesForLabel($labelUrl);
$ledgerEntries->_embedded->{'ledger-entries'}[0]->id; # => "32d68709-62dd-43d6-a6df-562f4baec526"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
label_url = 'https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc'

ledger_entries = app_token.get "#{label_url}/ledger-entries"
ledger_entries._embedded['ledger-entries'][0].id # => "32d68709-62dd-43d6-a6df-562f4baec526"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
label_url = 'https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc'

ledger_entries = app_token.get('%s/ledger-entries' % label_url)
ledger_entries.body['_embedded']['ledger-entries'][0]['id'] # => '32d68709-62dd-43d6-a6df-562f4baec526'
```
```javascript
var labelUrl = 'https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc';

appToken
  .get(`${labelUrl}/ledger-entries`)
  .then(res => res.body._embedded['ledger-entries'][0].id); // => '32d68709-62dd-43d6-a6df-562f4baec526'
```

## List labels for a customer

List all Labels for a specified Verified Customer. Labels are sorted by created date in descending order (most recent first).

### HTTP request

`GET https://api.dwolla.com/customers/{id}/labels`

### Request parameters

| Parameter | Required | Type    | Description                |
|-----------|----------|---------|----------------------------|
| id        | yes      | string  | Customer unique identifier to retrieve labels for. |
| limit     | no       | integer | Number of results to return. Defaults to 25. |
| offset    | no       | integer | Number of results to skip. Used for pagination. |

### Request and response

```raw
GET https://api.dwolla.com/customers/315a9456-3750-44bf-8b41-487b10d1d4bb/labels
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/customers/315a9456-3750-44bf-8b41-487b10d1d4bb/labels",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "label"
        },
        "first": {
            "href": "https://api-sandbox.dwolla.com/customers/315a9456-3750-44bf-8b41-487b10d1d4bb/labels?limit=25&offset=0",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "label"
        },
        "last": {
            "href": "https://api-sandbox.dwolla.com/customers/315a9456-3750-44bf-8b41-487b10d1d4bb/labels?limit=25&offset=0",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "label"
        },
        "customer": {
            "href": "https://api-sandbox.dwolla.com/customers/315a9456-3750-44bf-8b41-487b10d1d4bb",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        }
    },
    "_embedded": {
        "labels": [
            {
                "_links": {
                    "self": {
                        "href": "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "label"
                    },
                    "update": {
                        "href": "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc/ledger-entries",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "ledger-entry"
                    },
                    "ledger-entries": {
                        "href": "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc/ledger-entries",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "ledger-entry"
                    },
                    "customer": {
                        "href": "https://api-sandbox.dwolla.com/customers/315a9456-3750-44bf-8b41-487b10d1d4bb",
                        "type": "application/vnd.dwolla.v1.hal+json",
                        "resource-type": "customer"
                    }
                },
                "id": "7e042ffe-e25e-40d2-b86e-748b98845ecc",
                "created": "2019-05-15T22:19:09.635Z",
                "amount": {
                    "value": "5.00",
                    "currency": "USD"
                }
            }
        ]
    },
    "total": 1
}
```
```php
<?php
$customerUrl = 'https://api-sandbox.dwolla.com/customers/315a9456-3750-44bf-8b41-487b10d1d4bb';

$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$labels = $customersApi->getLabelsForCustomer($customerUrl);
$labels->_embedded->{'labels'}[0]->id; # => "7e042ffe-e25e-40d2-b86e-748b98845ecc"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/315a9456-3750-44bf-8b41-487b10d1d4bb'

labels = app_token.get "#{customer_url}/labels"
labels._embedded['labels'][0].id # => "7e042ffe-e25e-40d2-b86e-748b98845ecc"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/315a9456-3750-44bf-8b41-487b10d1d4bb'

labels = app_token.get('%s/labels' % customer_url)
labels.body['_embedded']['labels'][0]['id'] # => '7e042ffe-e25e-40d2-b86e-748b98845ecc'
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/5b29279d-6359-4c87-a318-e09095532733';

appToken
  .get(`${customerUrl}/labels`)
  .then(res => res.body._embedded['labels'][0].id); // => '7e042ffe-e25e-40d2-b86e-748b98845ecc'
```

## Create a label reallocation

This section outlines how to create a Label reallocation. When creating a Label reallocation you’ll specify an amount as well as from and to which correspond respectively to a Label that will be reduced and a Label that will be increased. The `from` and `to` Labels must belong to the same Verified Customer. Upon success, the API will return a 201 with a link to the created Label reallocation resource in the Location header. A Label reallocation will only occur if the `from` Label has an amount that is equal to or greater than the amount specified in the Label reallocation request. Label ledger entries will be created for both Labels included in the reallocation.

### HTTP request

`POST https://api.dwolla.com/label-reallocations`

### Request parameters

| Parameter | Required | Type    | Description                |
|-----------|----------|---------|----------------------------|
| _links    | yes      | string  | A _links JSON object that includes the desired `from` and `to` Label. |
| amount    | yes      | object  | Amount of funds to reallocate for single Verified Customer Record. An amount object. Reference the amount object to learn more. |

### Request and response

```raw
POST https://api.dwolla.com/label-reallocations
Content-Type: application/vnd.dwolla.v1.hal+json
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
 "_links":{
   "from": {
     "href": "https://api.dwolla.com/labels/c91c501c-f49b-48be-a93b-12b45e152d45"
   },
   "to": {
     "href": "https://api.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc"
   }
 },
 "amount": {
   "value": "15.00",
   "currency": "USD"
 }
}

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/label-reallocations/fd36b78c-42f3-4e21-8efb-09196fccbd21
```
```php
<?php
$labelReallocationsApi = new DwollaSwagger\LabelreallocationsApi($apiClient);

$labelReallocation = $labelReallocationsApi->reallocateLabel([
  '_links' => [
    'from' => [
      'href' => 'https://api-sandbox.dwolla.com/labels/c91c501c-f49b-48be-a93b-12b45e152d45',
    ],
    'to' => [
      'href' => 'https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc'
    ]
  ],
  'amount' => [
    'currency' => 'USD',
    'value' => '15.00'
  ]
]);
$labelReallocation; # => "https://api-sandbox.dwolla.com/label-reallocations/fd36b78c-42f3-4e21-8efb-09196fccbd21"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
request_body = {
  :_links => {
    :from => {
      :href => "https://api-sandbox.dwolla.com/labels/c91c501c-f49b-48be-a93b-12b45e152d45"
    },
    :to => {
      :href => "https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc"
    }
  },
  :amount => {
    :currency => "USD",
    :value => "15.00"
  }
}

labelReallocation = app_token.post "label-reallocations", request_body
labelReallocation.response_headers[:location] # => "https://api-sandbox.dwolla.com/label-reallocations/fd36b78c-42f3-4e21-8efb-09196fccbd21"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
request_body = {
  '_links': {
    'from': {
      'href': 'https://api-sandbox.dwolla.com/labels/c91c501c-f49b-48be-a93b-12b45e152d45'
    },
    'to': {
      'href': 'https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc'
    }
  },
  'amount': {
    'currency': 'USD',
    'value': '15.00'
  }
}

labelReallocation = app_token.post('transfers', request_body)
labelReallocation.headers['location'] # => 'https://api-sandbox.dwolla.com/label-reallocations/fd36b78c-42f3-4e21-8efb-09196fccbd21'
```
```javascript
var requestBody = {
  _links: {
    from: {
      href: 'https://api-sandbox.dwolla.com/labels/c91c501c-f49b-48be-a93b-12b45e152d45'
    },
    to: {
      href: 'https://api-sandbox.dwolla.com/labels/7e042ffe-e25e-40d2-b86e-748b98845ecc'
    }
  },
  amount: {
    currency: 'USD',
    value: '1.00'
  }
};

appToken
  .post('label-reallocations', requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/label-reallocations/fd36b78c-42f3-4e21-8efb-09196fccbd21'
```

## Retrieve a label reallocation

This section outlines how to retrieve a Label reallocation by its unique identifier.

### HTTP request

`GET https://api.dwolla.com/label-reallocations/{id}`

### Request parameters

| Parameter | Required | Type    | Description                |
|-----------|----------|---------|----------------------------|
| id        | yes      | string  | Label unique identifier    |

### Request and response

```raw
GET https://api.dwolla.com/label-reallocations/fd36b78c-42f3-4e21-8efb-09196fccbd21
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

…

{
    "_links": {
        "self": {
            "href": "https://api-sandbox.dwolla.com/label-reallocations/fd36b78c-42f3-4e21-8efb-09196fccbd21",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "label-reallocation"
        },
        "to-ledger-entry": {
            "href": "https://api-sandbox.dwolla.com/ledger-entries/d8a4bf7a-3fa0-48b9-873c-765d7375c59f",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "ledger-entry"
        },
        "from-ledger-entry": {
            "href": "https://api-sandbox.dwolla.com/ledger-entries/f6a44994-b4da-48e3-bd10-d3a168e6a77d",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "ledger-entry"
        }
    },
    "created": "2019-05-16T13:41:31.036Z"
}
```
```php
<?php
$labelReallocationUrl = 'https://api-sandbox.dwolla.com/label-reallocations/fd36b78c-42f3-4e21-8efb-09196fccbd21';

$labelReallocationsApi = new DwollaSwagger\LabelreallocationsApi($apiClient);

$labelReallocation = $labelReallocationsApi->getLabelReallocation($labelReallocationUrl);
$labelReallocation->created; # => "2019-05-16T13:41:31.036Z"
?>
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
label_reallocation_url = 'https://api-sandbox.dwolla.com/label-reallocations/fd36b78c-42f3-4e21-8efb-09196fccbd21'

label_reallocation = app_token.get label_reallocation_url
label_reallocation.created # => "2019-05-16T13:41:31.036Z"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
label_reallocation_url = 'https://api-sandbox.dwolla.com/label-reallocations/fd36b78c-42f3-4e21-8efb-09196fccbd21'

label_reallocation = app_token.get(label_reallocation_url)
label_reallocation.body['created'] # => '2019-05-16T13:41:31.036Z'
```
```javascript
var labelReallocationUrl = 'https://api-sandbox.dwolla.com/label-reallocations/fd36b78c-42f3-4e21-8efb-09196fccbd21';

appToken
  .get(labelReallocationUrl)
  .then(res => res.body.created); // => '2019-05-16T13:41:31.036Z'
```


## Remove a label

This section outlines how to remove a Label by its unique identifier. The amount of a Label must be reduced to zero prior to removing a label. Once a label is removed it can no longer be retrieved by its unique identifier.

### HTTP request

`DELETE https://api.dwolla.com/labels/{id}`

### Request parameters

| Parameter | Required | Type    | Description                |
|-----------|----------|---------|----------------------------|
| id        | yes      | string  | Label unique identifier    |

### Request and response

```raw
DELETE https://api.dwolla.com/labels/30165ded-2f32-4ee9-b340-ac44dda1d7fc
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

{
    "_links": {
        "ledger-entries": {
            "href": "https://api-sandbox.dwolla.com/labels/30165ded-2f32-4ee9-b340-ac44dda1d7fc/ledger-entries",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "ledger-entry"
        },
        "self": {
            "href": "https://api-sandbox.dwolla.com/labels/30165ded-2f32-4ee9-b340-ac44dda1d7fc",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "label"
        },
        "remove": {
            "href": "https://api-sandbox.dwolla.com/labels/30165ded-2f32-4ee9-b340-ac44dda1d7fc",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "label"
        },
        "customer": {
            "href": "https://api-sandbox.dwolla.com/customers/315a9456-3750-44bf-8b41-487b10d1d4bb",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "customer"
        },
        "update": {
            "href": "https://api-sandbox.dwolla.com/labels/30165ded-2f32-4ee9-b340-ac44dda1d7fc/ledger-entries",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "ledger-entry"
        }
    },
    "id": "30165ded-2f32-4ee9-b340-ac44dda1d7fc",
    "created": "2019-05-16T14:56:52.629Z",
    "amount": {
        "value": "0.00",
        "currency": "USD"
    }
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
label_url = 'https://api-sandbox.dwolla.com/labels/30165ded-2f32-4ee9-b340-ac44dda1d7fc'

app_token.delete label_url
```
```javascript
var labelUrl = 'https://api-sandbox.dwolla.com/labels/30165ded-2f32-4ee9-b340-ac44dda1d7fc';

appToken.delete(labelUrl);
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
label_url = 'https://api-sandbox.dwolla.com/labels/30165ded-2f32-4ee9-b340-ac44dda1d7fc'

app_token.delete(label_url)
```
```php
<?php
$labelsApi = new DwollaSwagger\LabelsApi($apiClient);
$labelsApi->removeLabel('https://api-sandbox.dwolla.com/labels/30165ded-2f32-4ee9-b340-ac44dda1d7fc');
?>
```

### HTTP status and error codes

| HTTP Status | Code                 | Description |
|-------------|----------------------|--------------
| 403         | InvalidResourceState | Amount must be zero to remove label. |

* * *
