# Events

When the state of a resource changes, we create a new event resource to record the change.  For instance, if a Customer's status changes to `verified`, a `customer_verified` event will be created.  When an Event is created, a [Webhook](#webhooks) will be created to deliver the Event to any URLs specified by your active [Webhook Subscriptions](#webhook-subscriptions).

### Events resource

| Parameter | Description
|-----------|------------|
|_links | Contains links to the event, associated resource, the Account associated with the event, and the Customer associated with the event (if any).
|id | Event id
|created | ISO-8601 timestamp when event was created
|topic | Type of event
|resourceId | id of the resource associated with the event.

```noselect
{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/events/f8e70f48-b7ff-47d0-9d3d-62a099363a76"
    },
    "resource": {
      "href": "https://api.dwolla.com/transfers/48CFDDB4-1E74-E511-80DB-0AA34A9B2388"
    },
    "account": {
      "href": "https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
    }
  },
  "id": "f8e70f48-b7ff-47d0-9d3d-62a099363a76",
  "created": "2015-10-16T15:58:15.000Z",
  "topic": "transfer_created",
  "resourceId": "48CFDDB4-1E74-E511-80DB-0AA34A9B2388"
}
```

### Event topics - ([Accounts](#accounts))
| Topic          | Description                                                                                                       |
|------------------|---------------------------------------------------------------------------------------------------------------|
| funding_source_added | A funding source was added to a Dwolla account. |
| funding_source_removed |  A funding source was removed from a Dwolla account. |
| funding_source_verified | A funding source was marked as `verified`. |
| microdeposits_added | Two <=10¢ transfers to a Dwolla account’s linked bank account were initiated. |
| microdeposits_failed | The two <=10¢ transfers to a Dwolla account’s linked bank account failed to clear successfully. |
| microdeposits_completed | The two <=10¢ transfers to a Dwolla account’s linked bank account have cleared successfully. |
| microdeposits_maxattempts | The account has reached their max verification attempts limit of three. The account can no longer verify their funding source with the completed micro-deposit amounts. |
| bank_transfer_created | A bank transfer was created. |
| bank_transfer_cancelled | A pending bank transfer has been cancelled, and will not process further. |
| bank_transfer_failed | A transfer failed to clear successfully. Usually, this is a result of an ACH failure (insufficient funds, etc.). |
| bank_transfer_completed | A bank transfer has cleared successfully. |
| transfer_created | A transfer was created. |
| transfer_cancelled | A pending transfer has been cancelled, and will not process further. |
| transfer_failed | A transfer failed to clear successfully. |
| transfer_reclaimed | The transfer was returned to the sender after remaining unclaimed by the intended recipient for a period of time. |
| transfer_completed | A transfer has cleared successfully. |
| mass_payment_created | A mass payment was created. |
| mass_payment_completed | A mass payment completed. |
| mass_payment_cancelled | A created and deferred mass payment was cancelled. |
| account_suspended | An account was suspended. |
| account_activated | A Dwolla account moves from deactive or suspended to active state of verification. |

## List events

Retrieve a list of events for the application.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint requires an OAuth [application access token](#application-access-token).</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/events`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|-------------|
| limit | no | integer | How many results to return |
| offset | no | integer | How many results to skip |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Resource not found. |

### Request and response

```raw
GET https://api.dwolla.com/events
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/events"
    },
    "first": {
      "href": "https://api.dwolla.com/events?limit=25&offset=0"
    },
    "last": {
      "href": "https://api.dwolla.com/events?limit=25&offset=150"
    },
    "next": {
      "href": "https://api.dwolla.com/events?limit=25&offset=25"
    }
  },
  "_embedded": {
    "events": [
      {
        "_links": {
          "self": {
            "href": "https://api.dwolla.com/events/78e57644-56e4-4da2-b743-059479f2e80f"
          },
          "resource": {
            "href": "https://api.dwolla.com/transfers/47CFDDB4-1E74-E511-80DB-0AA34A9B2388"
          },
          "account": {
            "href": "https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
          }
        },
        "id": "78e57644-56e4-4da2-b743-059479f2e80f",
        "created": "2015-10-16T15:58:18.000Z",
        "topic": "bank_transfer_created",
        "resourceId": "47CFDDB4-1E74-E511-80DB-0AA34A9B2388"
      },
      {
        "_links": {
          "self": {
            "href": "https://api.dwolla.com/events/f8e70f48-b7ff-47d0-9d3d-62a099363a76"
          },
          "resource": {
            "href": "https://api.dwolla.com/transfers/48CFDDB4-1E74-E511-80DB-0AA34A9B2388"
          },
          "account": {
            "href": "https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
          }
        },
        "id": "f8e70f48-b7ff-47d0-9d3d-62a099363a76",
        "created": "2015-10-16T15:58:15.000Z",
        "topic": "transfer_created",
        "resourceId": "48CFDDB4-1E74-E511-80DB-0AA34A9B2388"
      },
      {
        "_links": {
          "self": {
            "href": "https://api.dwolla.com/events/9f0167e0-dce6-4a1a-ad26-30015d6f1cc1"
          },
          "resource": {
            "href": "https://api.dwolla.com/transfers/08A166BC-1B74-E511-80DB-0AA34A9B2388"
          },
          "account": {
            "href": "https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
          }
        },
        "id": "9f0167e0-dce6-4a1a-ad26-30015d6f1cc1",
        "created": "2015-10-16T15:37:03.000Z",
        "topic": "bank_transfer_created",
        "resourceId": "08A166BC-1B74-E511-80DB-0AA34A9B2388"
      },
      {
        "_links": {
          "self": {
            "href": "https://api.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095"
          },
          "resource": {
            "href": "https://api.dwolla.com/transfers/09A166BC-1B74-E511-80DB-0AA34A9B2388"
          },
          "account": {
            "href": "https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
          },
          "customer": {
            "href": "https://api.dwolla.com/customers/07d59716-ef22-4fe6-98e8-f3190233dfb8"
          }
        },
        "id": "81f6e13c-557c-4449-9331-da5c65e61095",
        "created": "2015-10-16T15:37:02.000Z",
        "topic": "customer_transfer_created",
        "resourceId": "09A166BC-1B74-E511-80DB-0AA34A9B2388"
      }
    ]
  },
  "total": 4
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
events = app_token.get "events"
events.total # => 4
```
```php
<?php
$eventsApi = new DwollaSwagger\EventsApi($apiClient);

$events = $eventsApi->events();
$events->total; # => 4
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
events = app_token.get('events')
events.body['total'] # => 4
```
```javascript
applicationToken
  .get('events')
  .then(res => res.body.total); // => 4
```

## Retrieve an event

This section covers how to retrieve an event by id.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint requires an OAuth [application access token](#application-access-token).</li>
</ol>

### HTTP Request
`GET https://api.dwolla.com/events/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | ID of application event to get. |

### Errors
| HTTP Status | Message |
|--------------|-------------|
| 404 | Application event not found. |

### Request and response

```raw
GET /events/81f6e13c-557c-4449-9331-da5c65e61095
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095"
    },
    "resource": {
      "href": "https://api.dwolla.com/transfers/09A166BC-1B74-E511-80DB-0AA34A9B2388"
    },
    "account": {
      "href": "https://api.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
    },
    "customer": {
      "href": "https://api.dwolla.com/customers/07d59716-ef22-4fe6-98e8-f3190233dfb8"
    }
  },
  "id": "81f6e13c-557c-4449-9331-da5c65e61095",
  "created": "2015-10-16T15:37:02.000Z",
  "topic": "customer_transfer_created",
  "resourceId": "09A166BC-1B74-E511-80DB-0AA34A9B2388"
}
```
```ruby
event_url = 'https://api.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095'

# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby (Recommended)
event = app_token.get event_url
event.topic # => "customer_transfer_created"
```
```php
<?php
$eventUrl = 'https://api.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095';

$eventsApi = new DwollaSwagger\EventsApi($apiClient);

$event = $eventsApi->id($eventUrl);
$event->topic; # => "customer_transfer_created"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python (Recommended)
event_url = 'https://api.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095'

event = app_token.get(event_url)
event.body['topic'] # => 'customer_transfer_created'
```
```javascript
var eventUrl = 'https://api.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095';

applicationToken
  .get(eventUrl)
  .then(res => res.body.topic); // => 'customer_transfer_created'
```
* * *
