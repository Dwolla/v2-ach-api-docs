# Root

The "root" serves as an entry point to the API, providing your application with the ability to fetch and discover resources available based on the OAuth `access_token` provided in the request. If an application access token is provided in the request, the API will return links to resources that belong to the Dwolla application (i.e. "events" and "webhook-subscriptions").

### HTTP request
`GET https://api.dwolla.com/`

### Request and response

```raw
GET https://api-sandbox.dwolla.com/
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "account": {
      "href": "https://api-sandbox.dwolla.com/accounts/ad5f2162-404a-4c4c-994e-6ab6c3a13254"
    },
    "customers": {
      "href": "https://api-sandbox.dwolla.com/customers"
    }
  }
}
```
```ruby
root = app_token.get "/"
root._links.account.href # => "https://api-sandbox.dwolla.com/accounts/ad5f2162-404a-4c4c-994e-6ab6c3a13254"
```
```php
<?php
$rootApi = new DwollaSwagger\RootApi($apiClient);

$root = $rootApi->root();
$accountUrl = $root->_links["account"]->href; # => "https://api-sandbox.dwolla.com/accounts/ad5f2162-404a-4c4c-994e-6ab6c3a13254"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
root = app_token.get('/')
root.body['_links']['account']['href'] # => 'https://api-sandbox.dwolla.com/accounts/ad5f2162-404a-4c4c-994e-6ab6c3a13254'
```
```javascript
appToken
  .get('/')
  .then(res => res.body._links.account.href); // => 'https://api-sandbox.dwolla.com/accounts/ad5f2162-404a-4c4c-994e-6ab6c3a13254'
```
* * *
