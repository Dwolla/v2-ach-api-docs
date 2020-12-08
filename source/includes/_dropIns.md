# Drop-in Components

Dwolla’s UI drop-in components library allows developers to leverage isolated functions or build connected flows in their web applications, which expedites the integration process with the Dwolla Platform. Each component within this library includes HTML, CSS and JavaScript that developers can drop-in and customize to fit the look and feel of their application.

Dwolla's [UI components library](https://developers/dwolla.com/concepts/drop-in-components), dwolla-web.js, requires a unique client-side token that is generated using a server-side SDK. The client token contains granular permissions to perform a specific action on behalf of a [Customer](#customers). 

#### Client Token lifetime

**Client-tokens** are single-use tokens that are valid for up to 1 hour after being generated. More than one client token can be generated and valid at one time.

## Create a client token

The client token API request requires an `action` as well as a `link` which points to the Customer that identifies the end-user performing the action within the drop-in component. The `action` is a string that contains a granular permission for the Customer performing the action within a drop-in component. **Note:** This endpoint requires [application authorization](#application-authorization).

#### Client token actions
| Component | Component Name | Action |
|-----------|----------------|--------|
| Create an Unverified Customer | dwolla-customer-create | customer.create |
| Upgrade an Unverified Customer | dwolla-customer-update | customer.update |
| Create a personal Verified Customer | dwolla-personal-vcr | customer.create |
| Document upload for a Customer | dwolla-document-upload | customer.documents.create |
| Display a Verified Customer’s Balance | dwolla-balance-display | customer.fundingsources.read |

#### HTTP request

`POST https://api.dwolla.com/client-tokens`


#### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| action | yes | object | A granular permission for the Customer performing an action within a drop-in component. [Reference the client token actions to learn more](#client-token-actions). |
| _links | yes | object | A _links JSON object that contains a link the desired `customer` performing the action within the drop-in component. |

#### Request and response

```raw
POST https://api-sandbox.dwolla.com/client-tokens 
Accept: application/vnd.dwolla.v1.hal+json Content-Type: application/json
Authorization: Bearer {{token}}
{
"action": "customer.update”,
  "_links": {
    “customer”: {
        “href”: “https://api-sandbox.dwolla.com/customers/{{customerId}}” 
    }
  }
}

...

{
 "token": "4adF858jPeQ9RnojMHdqSD2KwsvmhO7Ti7cI5woOiBGCpH5krY"
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
request_body = {
  :_links => {
    :customer => {
      :href => "https://api-sandbox.dwolla.com/customers/707177c3-bf15-4e7e-b37c-55c3898d9bf4"
    }
  },
  :action => "customer.update"
}

client_token = app_token.post "client-tokens", request_body
client_token.token # => "4adF858jPeQ9RnojMHdqSD2KwsvmhO7Ti7cI5woOiBGCpH5krY"
```
```php
/**
 * No example for this language yet.
 **/
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
request_body = {
  '_links': {
    'customer': {
      'href': 'https://api-sandbox.dwolla.com/customers/707177c3-bf15-4e7e-b37c-55c3898d9bf4'
    }
  },
  'action': 'customer.update'
}

client_token = app_token.post('client-tokens', request_body)
client_token.body['token'] # => '4adF858jPeQ9RnojMHdqSD2KwsvmhO7Ti7cI5woOiBGCpH5krY'
```
```javascript
var requestBody = {
  _links: {
    customer: {
      href: 'https://api-sandbox.dwolla.com/customers/707177c3-bf15-4e7e-b37c-55c3898d9bf4'
    }
  },
  action: 'customer.update'
};

appToken
 .post(`/client-tokens`)
 .then(res => res.body.token); // => '4adF858jPeQ9RnojMHdqSD2KwsvmhO7Ti7cI5woOiBGCpH5krY'
```


* * *
