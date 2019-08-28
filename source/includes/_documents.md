# Documents

Verified Customers of type `personal` or `business` and of status `document` require color photos of identifying documents to be uploaded for manual review in order to be verified. Currently, SDK support for document upload only exists for Ruby, Node.js, and Python. To upload a document using other languages, you must use an external HTTP library.

For more information on handling the Customer verification status of `document`, reference our [Customer verification](https://developers.dwolla.com/resources/customer-verification/handling-verification-statuses.html) resource article.

### Document resource

| Parameter | Description |
|-----------|------------|
|id | Document unique identifier |
|type | Either `passport`, `license`, `idCard`, or `other`. Must be a color scan of US Government issued identification.|
|status| Either `pending` or `reviewed`.  When a document has been manually reviewed by Dwolla, its status will be `reviewed`.  A reviewed document does not necessarily indicate that the customer has completed the identity verification process. |
| created | ISO 8601 Timestamp of document upload time and date. |
| failureReason | The reason an uploaded document was rejected. Can be: `ScanNotReadable`, `ScanNotUploaded`, `scanIdExpired`, `ScanIdTypeNotSupported`, `ScanDobMismatch` or `ScanNameMismatch`. |

```noselect
{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc"
    }
  },
  "id": "56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc",
  "status": "pending",
  "type": "passport",
  "created": "2015-09-29T21:42:16.000Z"
}
```

## Create a document for a customer

Create a document for a Customer pending verification by uploading a color scan or photo of government issued identification (see below for acceptable document types). This requires a multipart form-data POST request. The uploaded file must be a color image, in a `.jpg`, `.jpeg`, `.png`, or `.pdf` format, and less than 10MB in size.

### Acceptable documents

|    Customer type                  |   Acceptable documents       |
|-----------------------------------|------------------------------|
| Personal Verified Customer        | `passport`, `license`, or `idCard`. Must be a color scan of US Government issued identification. |
| Business Verified Customer        | Controller documents - `passport`, `license`, `idCard`, or `other`. Must be a color scan of US Government issued identification. <br> Business documents - Refer to our guide on [Handling Document status for Business Verified Customers](https://developers.dwolla.com/resources/business-verified-customer/handling-controller-and-customer-statuses.html#document-types) for acceptable documents.<br> Beneficial Owner documents - Refer to our guide on [Handling Document status for Beneficial Owners](https://developers.dwolla.com/resources/business-verified-customer/adding-beneficial-owners.html#handling-document-status) for acceptable documents.|

### HTTP request

`POST https://api.dwolla.com/customers/{id}/documents`

### Request Parameters

|Form Field| Description|
|----------|-------------|
| documentType | Acceptable values of: `passport`, `license`, `idCard`, or `other` |
| file | File contents. |

### HTTP status and error codes

| HTTP Status |    Code                  |   Description       |
|-------------|--------------------------|---------------------|
| 201         | Created                  | A document resource was created.    |
| 400         | maximumNumberOfResources | Max of four files upload allowed. Please wait for Dwolla to manually check the documents. |
| 400         | invalidFileType          | File types supported: `.jpg`, `.jpeg`, `.png`, or `.pdf`. |
| 403         | invalidResourceState     | Resource cannot be modified. Document creation not allowed for already `verified` Customers or non-`verified` Customer types. |
| 403         | notAuthorized            | Not authorized to create documents. |
| 404         | notFound                 | Customer not found. Check CustomerId. |
| 413         | fileTooLarge             | Document requests are limited to 10 MiB. |

### Request and response

```raw
curl -X POST
\ -H "Authorization: Bearer tJlyMNW6e3QVbzHjeJ9JvAPsRglFjwnba4NdfCzsYJm7XbckcR"
\ -H "Accept: application/vnd.dwolla.v1.hal+json"
\ -H "Cache-Control: no-cache"
\ -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
\ -F "documentType=passport"
\ -F "file=@foo.png"
\ 'https://api-sandbox.dwolla.com/customers/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE/documents'

...

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0
```
```ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE'

file = Faraday::UploadIO.new('mclovin.jpg', 'image/jpeg')
document = app_token.post "#{customer_url}/documents", file: file, documentType: 'license'
document.response_headers[:location] # => "https://api.dwolla.com/documents/fb919e0b-ffbe-4268-b1e2-947b44328a16"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE'

document = app_token.post('%s/documents' % customer_url, file = open('mclovin.jpg', 'rb'), documentType = 'license')
document.headers['location'] # => 'https://api-sandbox.dwolla.com/documents/fb919e0b-ffbe-4268-b1e2-947b44328a16'
```
```php
/**
 * No example for this language yet.
 **/
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE';

var requestBody = new FormData();
body.append('file', fs.createReadStream('mclovin.jpg'), {
  filename: 'mclovin.jpg',
  contentType: 'image/jpeg',
  knownLength: fs.statSync('mclovin.jpg').size
});
body.append('documentType', 'license');

appToken
  .post(`${customerUrl}/documents`, requestBody)
  .then(res => res.headers.get('location')); // => "https://api-sandbox.dwolla.com/documents/fb919e0b-ffbe-4268-b1e2-947b44328a16"
```

## List documents for a customer

This section contains information on how to retrieve a list of documents that belong to a Customer.

### HTTP request
`GET https://api.dwolla.com/customers/{id}/documents`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Customer unique identifier. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2/documents
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2/documents"
    }
  },
  "_embedded": {
    "documents": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc"
          }
        },
        "id": "56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc",
        "status": "pending",
        "type": "passport",
        "created": "2015-09-29T21:42:16.000Z"
      },
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0"
          }
        },
        "id": "11fe0bab-39bd-42ee-bb39-275afcc050d0",
        "status": "pending",
        "type": "passport",
        "created": "2015-09-29T21:45:37.000Z"
      }
    ]
  },
  "total": 2
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2'

documents = app_token.get "#{customer_url}/documents"
documents._embedded['documents'][0].id # => "56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc"
```
```php
<?php
$customerUrl = 'https://api-sandbox.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2';

$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customer = $customersApi->getCustomerDocuments($customerUrl);
$customer->total; # => 2
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
customer_url = 'https://api-sandbox.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2'

documents = app_token.get('%s/documents' % customer_url)
documents.body['total'] # => 2
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2';

token
  .get(`${customerUrl}/documents`)
  .then(res => res.body._embedded['documents'][0].id); // => '56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc'
```

## Create a document for a beneficial owner

Create a document for a beneficial owner pending verification by uploading a photo of the document.  This requires a multipart form-data POST request.  The file must be either a `.jpg`, `.jpeg`, `.png`, or `.pdf` up to 10MB in size.

### HTTP request
`POST https://api.dwolla.com/beneficial-owners/{id}/documents`

### Request parameters
|Form Field| Description|
|----------|-------------|
| documentType | One of `passport`, `license`, `idCard`, or `other` |
| file | File contents. |

### Request and response

```raw
curl -X POST
\ -H "Authorization: Bearer tJlyMNW6e3QVbzHjeJ9JvAPsRglFjwnba4NdfCzsYJm7XbckcR"
\ -H "Accept: application/vnd.dwolla.v1.hal+json"
\ -H "Cache-Control: no-cache"
\ -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
\ -F "documentType=passport"
\ -F "file=@foo.png"
\ 'https://api-sandbox.dwolla.com/beneficial-owners/1de32ec7-ff0b-4c0c-9f09-19629e6788ce/documents'

...

HTTP/1.1 201 Created
Location: https://api-sandbox.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0
```
```ruby
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE'

file = Faraday::UploadIO.new('mclovin.jpg', 'image/jpeg')
document = app_token.post "#{beneficial_owner_url}/documents", file: file, documentType: 'license'
document.response_headers[:location] # => "https://api.dwolla.com/documents/fb919e0b-ffbe-4268-b1e2-947b44328a16"
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE'

document = app_token.post('%s/documents' % customer_url, file = open('mclovin.jpg', 'rb'), documentType = 'license')
document.headers['location'] # => 'https://api-sandbox.dwolla.com/documents/fb919e0b-ffbe-4268-b1e2-947b44328a16'
```
```php
/**
 * No example for this language yet.
 **/
```
```javascript
var beneficialOwnerUrl = 'https://api-sandbox.dwolla.com/beneficial-owners/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE';

var requestBody = new FormData();
body.append('file', fs.createReadStream('mclovin.jpg'), {
  filename: 'mclovin.jpg',
  contentType: 'image/jpeg',
  knownLength: fs.statSync('mclovin.jpg').size
});
body.append('documentType', 'license');

appToken
  .post(`${beneficialOwnerUrl}/documents`, requestBody)
  .then(res => res.headers.get('location')); // => "https://api-sandbox.dwolla.com/documents/fb919e0b-ffbe-4268-b1e2-947b44328a16"
```

## List documents for a beneficial owner

This section contains information on how to retrieve a list of documents that belong to a beneficial owner.

### HTTP request
`GET https://api.dwolla.com/beneficial-owners/{id}/documents`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Beneficial owner unique identifier. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/beneficial-owners/176878b8-ecdb-469b-a82b-43ba5e8704b2/documents
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/beneficial-owners/176878b8-ecdb-469b-a82b-43ba5e8704b2/documents"
    }
  },
  "_embedded": {
    "documents": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc"
          }
        },
        "id": "56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc",
        "status": "pending",
        "type": "passport",
        "created": "2015-09-29T21:42:16.000Z"
      },
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0"
          }
        },
        "id": "11fe0bab-39bd-42ee-bb39-275afcc050d0",
        "status": "pending",
        "type": "passport",
        "created": "2015-09-29T21:45:37.000Z"
      }
    ]
  },
  "total": 2
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/176878b8-ecdb-469b-a82b-43ba5e8704b2'

documents = token.get "#{beneficial_owner_url}/documents"
documents._embedded['documents'][0].id # => "56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc"
```
```php
<?php
$beneficialOwnersApi = new DwollaSwagger\BeneficialownersApi($apiClient);
$beneficialOwner = 'https://api-sandbox.dwolla.com/beneficial-owners/55469604-40ab-44b6-962f-de2c0837ba98';
$listDocsBeneficialOwner = $beneficialOwnersApi->getBeneficialOwnerDocuments($beneficialOwner);
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
beneficial_owner_url = 'https://api-sandbox.dwolla.com/beneficial-owners/176878b8-ecdb-469b-a82b-43ba5e8704b2'

documents = app_token.get('%s/documents' % beneficial_owner_url)
documents.body['total'] # => 2
```
```javascript
var beneficialOwnerUrl = 'https://api-sandbox.dwolla.com/beneficial-owners/176878b8-ecdb-469b-a82b-43ba5e8704b2';

token
  .get(`${beneficialOwnerUrl}/documents`)
  .then(res => res.body._embedded['documents'][0].id); // => '56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc'
```

## Retrieve a document

This section contains information on how to retrieve a document by its id.

### HTTP request
`GET https://api.dwolla.com/documents/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Document unique identifier. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc"
    }
  },
  "id": "56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc",
  "status": "pending",
  "type": "passport",
  "created": "2015-09-29T21:42:16.000Z"
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
document_url = 'https://api-sandbox.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc'

document = app_token.get document_url
document.type # => "passport"
```
```php
<?php
$documentUrl = 'https://api-sandbox.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc';

$documentsApi = new DwollaSwagger\DocumentsApi($apiClient);

$document = $documentsApi->getDocument($documentUrl);
$document->type; # => "passport"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
document_url = 'https://api-sandbox.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc'

documents = app_token.get(document_url)
documents.body['type'] # => 'passport'
```
```javascript
var documentUrl = 'https://api-sandbox.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc';

appToken
  .get(document_url)
  .then(res => res.body.type); // => "passport"
```

* * *
