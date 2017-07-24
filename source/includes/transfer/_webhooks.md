# Webhooks

When a new [event](#events) is created and there is an active [webhook subscription](#webhook-subscriptions), a new webhook is created in order to deliver that event.  Attempted deliveries are recorded under the webhook's `attempts` property.  Each attempt includes the recorded request and response of the delivery attempt. Webhooks are sent asynchronously and are not guaranteed to be delivered in order. We recommend that applications protect against duplicated events by making event processing idempotent.

**Note:** Webhooks containing an [event](#events) are only fired if an application has a valid refresh_token for the Dwolla user Account that an event is created on.

### Webhook resource

| Parameter      | Description                                       |
|----------------|---------------------------------------------------|
| id             | Webhook unique identifier                         |
| topic          | Type of webhook subscription                      |
| accountId      | Account associated with the webhook notification  |
| eventId        | Event id for this webhook                         |
| subscriptionId | Webhook subscription id for this event            |
| attempts       | Array of attempt JSON object                      |

### Attempts JSON object

| Parameter      | Description                             |
|----------------|-----------------------------------------|
| id             | Unique id of webhook delivery attempt.  |
| request        | Request JSON object                     |
| response       | Response JSON object                    |

### Request/response JSON object

| Parameter      | Description                                                                   |
|----------------|-------------------------------------------------------------------------------|
| created        | ISO-8601 timestamp                                                            |
| url            | URL where data was sent to/received from                                      |
| headers        | Array of objects with keys `name` and `value` representative of HTTP headers  |
| body           | An Event for the webhook                                                     |

## Retrieve a webhook

This section covers how to retrieve a single webhook.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint requires an OAuth [application access token](#application-access-token).</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/webhooks/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Id of webhook to retrieve. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Webhook not found. |

### Request and response

```raw
GET https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8"
    },
    "subscription": {
      "href": "https://api.dwolla.com/webhook-subscriptions/a0943041-7a5c-4e8f-92de-b55711ef3a83"
    },
    "retry": {
      "href": "https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8/retries"
    },
    "event": {
      "href": "https://api.dwolla.com/events/03c7e14c-7f15-44a2-bcf7-83f2f7e95d50"
    }
  },
  "id": "9ece9660-aa34-41eb-80d7-0125d53b45e8",
  "topic": "transfer_created",
  "accountId": "ca32853c-48fa-40be-ae75-77b37504581b",
  "eventId": "03c7e14c-7f15-44a2-bcf7-83f2f7e95d50",
  "subscriptionId": "a0943041-7a5c-4e8f-92de-b55711ef3a83",
  "attempts": [
    {
      "id": "d4d16621-c6b0-40cb-8dc3-0469fa9dc4e8",
      "request": {
        "timestamp": "2015-10-27T17:07:34.304Z",
        "url": "https://myapp.runscope.net",
        "headers": [
          {
            "name": "X-Dwolla-Topic",
            "value": "transfer_created"
          },
          {
            "name": "X-Request-Signature",
            "value": "bd93780bd7e1ad77ab821094aaa0f9e3dece5ee3"
          }
        ],
        "body": "{\"id\":\"03c7e14c-7f15-44a2-bcf7-83f2f7e95d50\",\"resourceId\":\"81BA6F36-CD7C-E511-80DB-0AA34A9B2388\",\"topic\":\"transfer_created\",\"timestamp\":\"2015-10-27T17:07:34.207Z\",\"_links\":{\"self\":{\"href\":\"https://api.dwolla.com/events/03c7e14c-7f15-44a2-bcf7-83f2f7e95d50\"},\"account\":{\"href\":\"https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b\"},\"resource\":{\"href\":\"https://api.dwolla.com/transfers/81BA6F36-CD7C-E511-80DB-0AA34A9B2388\"}}}"
      },
      "response": {
        "timestamp": "2015-10-27T17:07:34.308Z",
        "headers": [
          {
            "name": "Date",
            "value": "Tue, 27 Oct 2015 17:07:34 GMT"
          },
          {
            "name": "Content-Type",
            "value": "application/json; charset=UTF-8"
          },
          {
            "name": "Content-Length",
            "value": "1093"
          },
          {
            "name": "Connection",
            "value": "keep-alive"
          },
          {
            "name": "Access-Control-Allow-Credentials",
            "value": "true"
          },
          {
            "name": "Access-Control-Allow-Methods",
            "value": "GET, PUT, POST, PATCH, DELETE, OPTIONS, HEAD"
          },
          {
            "name": "Server",
            "value": "Runscope-Gateway/1.0"
          },
          {
            "name": "Runscope-Message-Id",
            "value": "97aa5bbd-784f-4007-80cc-8f56919000a0"
          },
          {
            "name": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ],
        "statusCode": 200,
        "body": "{\"body\":\"{\"id\":\"03c7e14c-7f15-44a2-bcf7-83f2f7e95d50\",\"resourceId\":\"81BA6F36-CD7C-E511-80DB-0AA34A9B2388\",\"topic\":\"transfer_created\",\"timestamp\":\"2015-10-27T17:07:34.207Z\",\"_links\":{\"self\":{\"href\":\"https://api.dwolla.com/events/03c7e14c-7f15-44a2-bcf7-83f2f7e95d50\"},\"account\":{\"href\":\"https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b\"},\"resource\":{\"href\":\"https://api.dwolla.com/transfers/81BA6F36-CD7C-E511-80DB-0AA34A9B2388\"}}}\",\"files\":[],\"form\":{},\"fragment\":\"\",\"headers\":{\"Connection\":[\"close\"],\"Content-Length\":[\"453\"],\"Content-Type\":[\"application/json; charset=UTF-8\"],\"Host\":[\"myapp.runscope.net\"],\"User-Agent\":[\"dwolla-webhooks/1.0\"],\"X-Dwolla-Topic\":[\"transfer_created\"],\"X-Request-Signature\":[\"bd93780bd7e1ad77ab821094aaa0f9e3dece5ee3\"]},\"host\":\"myapp.runscope.net\",\"method\":\"POST\",\"params\":{},\"path\":\"/\",\"region\":\"us5\",\"runscope_host\":\"prod078.runscope.in\",\"scheme\":\"https\",\"source\":\"capture\",\"source_ip\":\"52.24.10.184\",\"timestamp\":1.4459656543078682e+09,\"url\":\"https://myapp.runscope.net/\"}"
      }
    }
  ]
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
webhook_url = 'https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8'

webhook = app_token.get webhook_url
webhook.topic # => "transfer_created"
```
```php
<?php
$webhookUrl = 'https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8';

$webhooksApi = new DwollaSwagger\WebhooksApi($apiClient);

$webhook = $webhooksApi->id($webhookUrl);
$webhook->topic; # => "transfer_created"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
webhook_url = 'https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8'

webhook = app_token.get(transfer_url)
webhook.body['topic'] # => 'transfer_created'
```
```javascript
var webhookUrl = 'https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8';

applicationToken
  .get(webhookUrl)
  .then(res => res.body.topic); // => 'transfer_created'
```

## Retry a webhook

This section details how to retry a webhook by id.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint requires an OAuth [application access token](#application-access-token).</li>
</ol>

### HTTP Request
`POST https://api.dwolla.com/webhooks/{id}/retries`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Id of webhook to retry. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Webhook not found. |

### Request and response

```raw
POST /webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8/retries
Accept: application/vnd.dwolla.v1.hal+json
Content-Type: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

HTTP/1.1 201 Created
Location: https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8/retries/5aa27a0f-cf99-418d-a3ee-67c0ff99a494
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
webhook_url = 'https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8'

app_token.post "#{webhook_url}/retries"
```
```php
<?php
$webhookUrl = 'https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8';

$webhooksApi = new DwollaSwagger\WebhooksApi($apiClient);

$webhooksApi->retryWebhook($webhookUrl);
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
webhook_url = 'https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8'

app_token.post('%s/retries' % webhook_url)
```
```javascript
var webhookUrl = 'https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8';

applicationToken.post(`${webhookUrl}/retries`);
```

## List retries for a webhook

This section covers how to retrieve webhook retries by id.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint requires an OAuth [application access token](#application-access-token).</li>
</ol>

### HTTP Request
`GET https://api.dwolla.com/webhooks/{id}/retries`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | Id of webhook to get retries for. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Webhook not found. |

### Request and response

```raw
GET /webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8/retries
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8/retries"
    }
  },
  "_embedded": {
    "retries": [
      {
        "_links": {
          "self": {
            "href": "https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8/retries/5aa27a0f-cf99-418d-a3ee-67c0ff99a494"
          },
          "webhook": {
            "href": "https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8"
          }
        },
        "id": "5aa27a0f-cf99-418d-a3ee-67c0ff99a494",
        "timestamp": "2015-11-02T17:43:26.000Z"
      }
    ]
  },
  "total": 1
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
webhook_url = 'https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8'

retries = app_token.get "#{webhook_url}/retries"
retries.total # => 1
```
```php
<?php
$webhookUrl = 'https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8';

$webhooksApi = new DwollaSwagger\WebhooksApi($apiClient);

$retries = $webhooksApi->retriesById($webhookUrl);
$retries->total; # => 1
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
webhook_url = 'https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8'

retries = app_token.get('%s/retries' % webhook_url)
retries.body['total'] # => 1
```
```javascript
var webhookUrl = 'https://api.dwolla.com/webhooks/9ece9660-aa34-41eb-80d7-0125d53b45e8';

applicationToken
  .get(`${webhookUrl}/retries`)
  .then(res => res.body.total); // => 1
```
