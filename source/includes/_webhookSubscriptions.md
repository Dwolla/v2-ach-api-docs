# Webhook subscriptions

Create a webhook subscription to receive `POST` requests from Dwolla (called webhooks) when events associated with your application occur.  [Webhooks](#webhooks) are sent to a URL which you provide when creating a webhook subscription. Refer to the [events](#events) section for the list of events that trigger webhooks.

##### **Automatic pause of a webhook subscription**
Dwolla will automatically pause subscribed webhook endpoints that are no longer reachable. The webhook subscription will be paused after **400 consecutive failures**. This will help us to ensure that unavailable endpoints don’t cause delays or issues in delivery of notifications for other API partners. Webhook subscriptions can be unpaused by calling [this endpoint](https://docsv2.dwolla.com/#update-a-webhook-subscription).

### Acknowledgement and retries
When your application receives a [webhook](#webhooks), it should respond with a HTTP 2xx status code to indicate successful receipt. If Dwolla receives a status code greater than or equal to 400, or your application fails to respond within 20 seconds of the attempt, another attempt will be made.

Dwolla will re-attempt delivery 8 times over the course of 72 hours according the backoff schedule below. If a webhook was successfully received but you would like the information again, you can call [retrieve a webhook by its Id](#retrieve-a-webhook).

| Retry number | Interval (relative to last retry) | Interval (relative to original attempt) |
|:------------:|:---------------------------------:|:---------------------------------------:|
|       1      |              15 min               |                  15 min                 |
|       2      |              45 min               |                   1 h                   |
|       3      |               2 h                 |                   3 h                   |
|       4      |               3 h                 |                   6 h                   |
|       5      |               6 h                 |                  12 h                   |
|       6      |              12 h                 |                  24 h                   |
|       7      |              24 h                 |                  48 h                   |
|       8      |              24 h                 |                  72 h                   |

### Webhook subscription resource

| Parameter      | Description                                                                   |
|----------------|-------------------------------------------------------------------------------|
| id             | Webhook subscription unique identifier.                                       |
| url            | Subscribed url where Dwolla should deliver the webhook notification.          |
| paused         | A boolean `true` or `false` value indicating if the webhook subscription is paused. A webhook subscription will be automatically paused after 400 consecutive failures. In addition, a subscription can be paused or unpaused by calling [this endpoint](https://docsv2.dwolla.com/#update-a-webhook-subscription) in the API.  |
| created        | ISO-8601 timestamp                                                            |

## Create a webhook subscription

This section details how to create a webhook subscription to deliver [webhooks](#webhooks) to a specified URL.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint requires an OAuth [application access token](#application-access-token).</li>
</ol>

### HTTP Request
`POST https://api.dwolla.com/webhook-subscriptions`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| url | yes | string | Where Dwolla should deliver the webhook notification. |
| secret | yes | string | A random, secret key, only known by your application. This secret key should be securely stored and used later when [validating the authenticity](https://developers.dwolla.com/guides/webhooks/validating-webhooks.html) of the webhook request from Dwolla. |

### Request and response

```raw
POST https://api-sandbox.dwolla.com/webhook-subscriptions
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer 0Sn0W6kzNicvoWhDbQcVSKLRUpGjIdlPSEYyrHqrDDoRnQwE7Q
{
    "url": "http://myapplication.com/webhooks",
    "secret": "sshhhhhh"
}
```
```ruby
request_body = {
  :url => "http://myawesomeapplication.com/destination",
  :secret => "your webhook secret"
}

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
subscription = app_token.post "webhook-subscriptions", request_body
subscription.headers[:location] # => "https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216"

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
subscription = DwollaSwagger::WebhooksubscriptionsApi.create(:body => request_body)
subscription # => "https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216"
```
```javascript
var requestBody = {
  url: 'http://myawesomeapplication.com/destination',
  secret: 'your webhook secret'
};

applicationToken
  .post('webhook-subscriptions', requestBody)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'
```
```python
request_body = {
  'url': 'http://myapplication.com/webhooks',
  'secret': 'sshhhhhh'
}

# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
retries = app_token.post('webhook-subscriptions', request_body)
retries.body['total'] # => 1

# Using dwollaswagger - https://github.com/Dwolla/dwolla-swagger-python
webhook_api = dwollaswagger.WebhooksubscriptionsApi(client)
subscription = webhook_api.create(body = request_body)
subscription # => 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'
```
```php
<?php
$webhookApi = new DwollaSwagger\WebhooksubscriptionsApi($apiClient);

$subscription = $webhookApi->create(array (
  'url' => 'http://myapplication.com/webhooks',
  'secret' => 'sshhhhhh',
));
$subscription; # => "https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216"
?>
```

## Retrieve a webhook subscription

This section details how to retrieve a webhook subscription by its id.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint requires an OAuth [application access token](#application-access-token).</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/webhook-subscriptions/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Webhook subscription unique identifier. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Webhook subscription not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/webhook-subscriptions/077dfffb-4852-412f-96b6-0fe668066589"
    },
    "webhooks": {
      "href": "https://api-sandbox.dwolla.com/webhook-subscriptions/077dfffb-4852-412f-96b6-0fe668066589/webhooks"
    }
  },
  "id": "077dfffb-4852-412f-96b6-0fe668066589",
  "url": "http://myapplication.com/webhooks",
  "created": "2015-10-28T16:20:47+00:00"
}
```
```ruby
webhook_subscription_url = 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
webhook_subscription = app_token.get webhook_subscription_url
webhook_subscription.created # => 2015-10-28T16:20:47+00:00

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
webhook_subscription = DwollaSwagger::WebhooksubscriptionApi.id webhook_subscription_url
webhook_subscription.created # => 2015-10-28T16:20:47+00:00
```
```javascript
var webhookSubscriptionUrl = 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216';

applicationToken
  .get(webhookSubscriptionUrl)
  .then(res => res.body.created); // => '2016-04-20T15:49:50.340Z'
```
```python
webhook_subscription_url = 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'

# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
webhook_subscription = app_token.get(webhook_subscription_url)
webhook_subscription.body['created'] # => '2015-10-28T16:20:47+00:00'

# Using dwollaswagger - https://github.com/Dwolla/dwolla-swagger-python
webhook_api = dwollaswagger.WebhooksubscriptionsApi(client)
retrieved = webhook_api.id(webhook_subscription_url)
retrieved.created # => 2015-10-28T16:20:47+00:00
```
```php
<?php
$webhookApi = new DwollaSwagger\WebhooksubscriptionsApi($apiClient);
$retrieved = $webhookApi->id('https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216');

$retrieved->created; # => 2015-10-28T16:20:47+00:00
?>
```

## Update a webhook subscription

This section details how to pause a webhook subscription. When a webhook subscription is paused Dwolla will continue to create webhooks but not send them to your subscribed webhook url. This is useful if your webhook endpoint is unavailable and you want to temporarily disable webhook requests.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint requires an OAuth [application access token](#application-access-token).</li>
</ol>

### HTTP Request
`POST https://api.dwolla.com/webhook-subscriptions/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Webhook unique identifier. |
| paused | yes | string | Specify a value of `true` to pause the associated webhook subscription. |

### Request and response

```raw
POST https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer 0Sn0W6kzNicvoWhDbQcVSKLRUpGjIdlPSEYyrHqrDDoRnQwE7Q
{
    "paused": true
}
```
```ruby
webhook_subscription_url = 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'

request_body = {
  :paused => true
}

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
subscription = app_token.post "#{webhook_subscription_url}", request_body
```
```javascript
var webhookSubscriptionUrl = 'https://api-sandbox.dwolla.com/funding-sources/692486f8-29f6-4516-a6a5-c69fd2ce854c';

var requestBody = {
  paused: true
};

applicationToken
  .post(webhookSubscriptionUrl, requestBody)
  .then(res => res.body.paused); // => 'true'
```
```python
webhook_subscription_url = 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'

request_body = {
  'paused': true
}

# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
subscription = app_token.post(webhook_subscription_url, request_body)
subscription.body['paused'] # => true
```
```php
<?php
$webhookSubscriptionUrl = 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'

$webhookApi = new DwollaSwagger\WebhooksubscriptionsApi($apiClient);

$subscription = $webhookApi->updateSubscription(array (
  'paused' => true
), $webhookSubscriptionUrl);
?>
```

## List webhook subscriptions

This section covers how to retrieve a list of webhook subscriptions that belong to an application.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint requires an OAuth [application access token](#application-access-token).</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/webhook-subscriptions`

### Request and response

```raw
GET https://api-sandbox.dwolla.com/webhook-subscriptions
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/webhook-subscriptions"
    }
  },
  "_embedded": {
    "webhook-subscriptions": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/webhook-subscriptions/f4d21628-fde2-4d3a-b69a-0a7cb42adc4c"
          },
          "webhooks": {
            "href": "https://api-sandbox.dwolla.com/webhook-subscriptions/f4d21628-fde2-4d3a-b69a-0a7cb42adc4c/webhooks"
          }
        },
        "id": "f4d21628-fde2-4d3a-b69a-0a7cb42adc4c",
        "url": "https://destination.url",
        "created": "2015-08-19T21:43:49.000Z"
      }
    ]
  },
  "total": 1
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
webhook_subscriptions = app_token.get "webhook-subscriptions"
webhook_subscriptions.total # => 1

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
webhook_subscriptions = DwollaSwagger::WebhooksubscriptionsApi.list
webhook_subscriptions.total # => 1
```
```javascript
applicationToken
  .get('webhook-subscriptions')
  .then(res => res.body.total); // => 1
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
webhook_subscriptions = app_token.get('webhook-subscriptions')
webhook_subscriptions.body['total'] # => 1

# Using dwollaswagger - https://github.com/Dwolla/dwolla-swagger-python
webhook_api = dwollaswagger.WebhooksubscriptionsApi(client)
retrieved = webhook_api.list()
retrieved.total # => 1
```
```php
<?php
$webhookApi = new DwollaSwagger\WebhooksubscriptionsApi($apiClient);

$retrieved = $webhookApi->_list();
$retrieved->total; # => 1
?>
```

## Delete a webhook subscription

Delete a Webhook Subscription to stop receiving Webhooks at the URL specified. If using an SDK, the request was successful unless an exception was thrown stating otherwise.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint requires an OAuth [application access token](#application-access-token).</li>
</ol>

### HTTP request
`DELETE https://api.dwolla.com/webhook-subscriptions/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Webhook unique identifier. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Webhook subscription not found. |

### Request and response

```raw
DELETE https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY
```
```ruby
webhook_subscription_url = 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
app_token.delete webhook_subscription_url

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
DwollaSwagger::WebhooksubscriptionApi.delete_by_id(webhook_subscription_url)
```
```javascript
var webhookSubscriptionUrl = 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216';

applicationToken.delete(webhookSubscriptionUrl);
```
```python
webhook_subscription_url = 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'

# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
app_token.delete(webhook_subscription_url)

# Using dwollaswagger - https://github.com/Dwolla/dwolla-swagger-python
webhook_api = dwollaswagger.WebhooksubscriptionsApi(client)
webhook_api.delete_by_id(webhook_subscription_url)
```
```php
<?php
$webhookApi = new DwollaSwagger\WebhooksubscriptionsApi($apiClient);
$webhookApi->deleteById('https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216');
?>
```

## List webhooks for a webhook subscription

This section covers how to view all fired [webhooks](#webhooks) for a webhook subscription.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint requires an OAuth [application access token](#application-access-token).</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/webhook-subscriptions/{id}/webhooks`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Webhook subscription unique identifier. |
| limit | no | integer | How many results to return. Defaults to 25. |
| offset | no | integer | How many results to skip. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/webhook-subscriptions/10d4133e-b308-4646-b276-40d9d36def1c/webhooks
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {},
  "total": 0,
  "items": [
    {
      "_links": {},
      "id": "string",
      "topic": "string",
      "accountId": "string",
      "eventId": "string",
      "subscriptionId": "string",
      "attempts": [
        {
          "id": "string",
          "request": {
            "created": "2015-07-23T14:19:37.006Z",
            "url": "string",
            "headers": [
              {
                "name": "string",
                "value": "string"
              }
            ],
            "body": "string"
          },
          "response": {
            "created": "2015-07-23T14:19:37.006Z",
            "headers": [
              {
                "name": "string",
                "value": "string"
              }
            ],
            "statusCode": 0,
            "body": "string"
          }
        }
      ]
    }
  ]
}
```
```ruby
webhook_subscription_url = 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
hooks = app_token.get "#{webhook_subscription_url}/webhooks"
hooks.total # => 5

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
hooks = DwollaSwagger::WebhooksApi.hooks_by_id webhook_subscription_url
hooks.total # => 5
```
```javascript
var webhookSubscriptionUrl = 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216';

applicationToken
  .get(`${webhookSubscriptionUrl}/webhooks`)
  .then(res => res.body.total); // => 5
```
```python
webhook_subscription_url = 'https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216'

# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
hooks = app_token.get('%s/hooks' % webhook_subscription_url)
hooks.body['total'] # => 5

# Using dwollaswagger - https://github.com/Dwolla/dwolla-swagger-python
webhook_api = dwollaswagger.WebhooksApi(client)
hooks = webhook_api.hooks_by_id(webhook_subscription_url)
hooks.total # => 5
```
```php
<?php
$webhookApi = new DwollaSwagger\WebhooksApi($apiClient);

$hooks = $webhookApi->hooksById('https://api-sandbox.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216');
$hooks->total; # => 5
?>
```
* * *
