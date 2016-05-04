# Documents

Customers of type `personal` or `business` and of status `document` require photos of identifying documents to be uploaded for manual review in order to be verified. Currently, SDK support only exists for retrieving data with regards to a `Document` resource. To create a document, you must use an external HTTP library.

### Document resource

| Parameter | Description
|-----------|------------|
|id | Document unique identifier
|type | Either `passport`, `license`, `idCard`, or `other`.
|status| Either `pending` or `reviewed`.  When a document has been manually reviewed by Dwolla, its status will be `reviewed`.  A reviewed document does not necessarily indicate that the customer has completed the identity verification process.
| created | ISO 8601 Timestamp of document upload time and date

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

## Create a document

Create a document for a Customer pending verification by uploading a photo of the document.  This requires a multipart form-data POST request.  The file must be either a `.jpg`, `.jpeg`, `.png`, `.tif`, or `.pdf` up to 10MB in size.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `ManageCustomers` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request

|Form Field| Description|
|----------|-------------|
| documentType | One of `passport`, `license`, `idCard`, or `other` |
| file | File contents.

### Request and response

```raw
curl -X POST
\ -H "Authorization: Bearer tJlyMNW6e3QVbzHjeJ9JvAPsRglFjwnba4NdfCzsYJm7XbckcR"
\ -H "Accept: application/vnd.dwolla.v1.hal+json"
\ -H "Cache-Control: no-cache"
\ -H "Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW"
\ -F "documentType=passport"
\ -F "file=@foo.png"
\ 'https://api.dwolla.com/customers/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE/documents'

...

HTTP/1.1 201 Created
Location: https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0
```
```ruby
customer_url = 'https://api.dwolla.com/customers/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE'

file = Faraday::UploadIO.new('mclovin.jpg', 'image/jpeg')
document = account_token.post "#{customer_url}/documents", file: file, documentType: 'license'
document.headers[:location] # => "https://api.dwolla.com/documents/fb919e0b-ffbe-4268-b1e2-947b44328a16"
```
```python
customer_url = 'https://api.dwolla.com/customers/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE'

# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
document = account_token.post('%s/documents' % customer_url, file = open('mclovin.jpg', 'rb'), documentType = 'license')
document.headers['location'] # => 'https://api.dwolla.com/documents/fb919e0b-ffbe-4268-b1e2-947b44328a16'
```
```javascript
var customerUrl = 'https://api.dwolla.com/customers/1DE32EC7-FF0B-4C0C-9F09-19629E6788CE';

var requestBody = new FormData();
body.append('file', fs.createReadStream('mclovin.jpg'), { filename: 'mclovin.jpg', contentType: 'image/jpeg', knownLength: 12345 });
body.append('documentType', 'license');

accountToken
  .post(`${customerUrl}/documents`, requestBody)
  .then(function(res) {
    res.headers.get('location'); // => "https://api.dwolla.com/documents/fb919e0b-ffbe-4268-b1e2-947b44328a16"
  });
```

## List documents

This section contains information on how to retrieve a list of documents that belong to a Customer.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `ManageCustomers` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/customers/{id}/documents`

### Request and response

```raw
GET https://api.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2/documents
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2/documents"
    }
  },
  "_embedded": {
    "documents": [
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
      },
      {
        "_links": {
          "self": {
            "href": "https://api.dwolla.com/documents/11fe0bab-39bd-42ee-bb39-275afcc050d0"
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
customer_url = 'https://api.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
documents = token.get "#{customer_url}/documents"
documents._embedded.documents[0].id # => "56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc"

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
documents = DwollaSwagger::CustomersApi.get_customer_documents(customer_url)
documents._embedded[:documents][0][:id] # => "56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc"
```
```php
<?php
$customerUrl = 'https://api.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2';

$customersApi = new DwollaSwagger\CustomersApi($apiClient);

$customer = $customersApi->getCustomerDocuments($customerUrl);
$customer->total; # => 2
?>
```
```python
customer_url = 'https://api.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2'

# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
documents = account_token.get('%s/documents' % customer_url)
documents.body['total'] # => 2

# Using dwollaswagger - https://github.com/Dwolla/dwolla-swagger-python
customers_api = dwollaswagger.CustomersApi(client)
documents = customers_api.get_customer_documents(customer_url)
documents.total # => 2
```
```javascript
var customerUrl = 'https://api.dwolla.com/customers/176878b8-ecdb-469b-a82b-43ba5e8704b2';

token
  .get(`${customerUrl}/documents`)
  .then(function(res) {
    res.body._embedded.documents[0].id; // => '56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc'
  });
```

## Retrieve a document

This section contains information on how to retrieve a document by its id.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token with the `ManageCustomers` <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/documents/{id}`

### Request and response

```raw
GET https://api.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

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
```ruby
document_url = 'https://api.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
document = account_token.get document_url
document.type # => "passport"

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
document = DwollaSwagger::DocumentsApi.get_document(document_url)
document.type # => "passport"
```
```php
<?php
$documentUrl = 'https://api.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc';

$documentsApi = new DwollaSwagger\DocumentsApi($apiClient);

$document = $documentsApi->getDocument($documentUrl);
$document->type; # => "passport"
?>
```
```python
document_url = 'https://api.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc'

# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
documents = account_token.get(document_url)
documents.body['type'] # => 'passport'

# Using dwollaswagger - https://github.com/Dwolla/dwolla-swagger-python
documents_api = dwollaswagger.DocumentsApi(client)
document = documents_api.get_customer(document_url)
document.type # => "passport"
```
```javascript
var documentUrl = 'https://api.dwolla.com/documents/56502f7a-fa59-4a2f-8579-0f8bc9d7b9cc';

accountToken
  .get(document_url)
  .then(function(res) {
    res.body.type; // => "passport"
  });
```
