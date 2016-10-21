# Root

The "root" serves as an entry point to the API, providing your application with the ability to fetch and discover resources available based on the OAuth `access_token` provided in the request. If a user [account access token](#request-user-authorization) is provided in the request, the API will return links to resources that belong to a Dwolla account of that user (i.e. "accounts" and "customers"). Alternatively, if an [application access token](#application-access-token) is provided in the request, the API will return links to resources that belong to the Dwolla application (i.e. "events" and "webhook-subscriptions").

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth account access token or an *Application* access token but does not require a particular <a href="#oauth-scopes">scope</a>.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/`

### Request and response

```raw
GET https://api.dwolla.com/
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "account": {
      "href": "https://api-uat.dwolla.com/accounts/ad5f2162-404a-4c4c-994e-6ab6c3a13254"
    },
    "customers": {
      "href": "https://api-uat.dwolla.com/customers"
    }
  }
}
```
```ruby
root = token.get "/"
root._links.account.href # => "https://api-uat.dwolla.com/accounts/ad5f2162-404a-4c4c-994e-6ab6c3a13254"
```
```php
/**
 *  No example for this language yet. Coming soon.
 **/
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
root = token.get('/')
root.body['_links']['account']['href'] # => 'https://api-uat.dwolla.com/accounts/ad5f2162-404a-4c4c-994e-6ab6c3a13254'

# Using dwollaswagger - https://github.com/Dwolla/dwolla-swagger-python
root_api = dwollaswagger.RootApi(client)
an_account = root_api.root()
an_account._links['account']['href'] # => 'https://api-uat.dwolla.com/accounts/ad5f2162-404a-4c4c-994e-6ab6c3a13254'
```
```javascript
token
  .get('/')
  .then(res => res.body._links.account.href); // => 'https://api-uat.dwolla.com/accounts/ad5f2162-404a-4c4c-994e-6ab6c3a13254'
```
* * *
