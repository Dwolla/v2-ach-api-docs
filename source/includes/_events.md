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

### Event topics
| Topic          | Description                                                                                                       |
|------------------|---------------------------------------------------------------------------------------------------------------|
| funding_source_added | A funding source was added to a Dwolla account. |
| funding_source_removed |  A funding source was removed from a Dwolla account. |
| funding_source_unverified | A funding source was marked as `unverified`. |
| funding_source_verified | A funding source was marked as `verified`. |
| microdeposits_added | Two <=10¢ transfers to a Dwolla account’s linked bank account were initiated. |
| microdeposits_failed | The two <=10¢ transfers to a Dwolla account’s linked bank account failed to clear successfully. |
| microdeposits_completed | The two <=10¢ transfers to a Dwolla account’s linked bank account have cleared successfully. |
| bank_transfer_created | A bank transfer was created. |
| bank_transfer_cancelled | A pending bank transfer has been cancelled, and will not process further. |
| bank_transfer_failed | A transfer failed to clear successfully. Usually, this is a result of an ACH failure (insufficient funds, etc.). |
| bank_transfer_completed | A bank transfer has cleared successfully. |
| transfer_created | A transfer was created. |
| transfer_cancelled | A pending transfer has been cancelled, and will not process further. |
| transfer_failed | A transfer failed to clear successfully. |
| transfer_reclaimed | The transfer was returned to the sender after remaining unclaimed by the intended recipient for a period of time. |
| transfer_completed | A transfer has cleared successfully. |
| masspay_created | A mass payment was created. |
| masspay_completed | A mass payment completed. |
| account_suspended | An account was suspended. |
| account_activated | A Dwolla account moves from deactive or suspended to active state of verification. |
| customer_created | A Customer was created. |
| customer_verification_document_needed | Additional documentation is needed to verify a Customer. |
| customer_verification_document_uploaded | A verification document was uploaded for a Customer. |
| customer_verification_document_failed | A verification document has been rejected for a Customer. |
| customer_verification_document_approved | A verification document was approved for a Customer. |
| customer_reverification_needed | Incomplete information was received for a Customer; updated information is needed to verify the Customer. |
| customer_verified | A Customer was verified. |
| customer_suspended | A Customer was suspended. |
| customer_activated | A Customer moves from deactive or suspended to active state of verification. |
| customer_funding_source_added | A funding source was added to a Customer. |
| customer_funding_source_removed | A funding source was removed from a Customer. |
| customer_funding_source_unverified | A Customer’s funding source was marked as unverified. |
| customer_funding_source_verified | A Customer’s funding source was marked as verified. |
| customer_microdeposits_added | Two <=10¢ transfers to a Customer’s linked bank account were initiated. |
| customer_microdeposits_failed | The two <=10¢ transfers to a Customer’s linked bank account failed to clear successfully. |
| customer_microdeposits_completed | The two <=10¢ transfers to a Customer’s linked bank account have cleared successfully. |
| customer_bank_transfer_created | A bank transfer was created for a Customer. Represents funds moving either from a verified Customer's bank to the Dwolla network or from the Dwolla network to a verified Customer's bank. |
| customer_bank_transfer_cancelled | A pending Customer bank transfer has been cancelled, and will not process further. Represents a cancellation of funds either transferring from a verified Customer's bank to the Dwolla network or from the Dwolla network to a verified Customer's bank. |
| customer_bank_transfer_failed | A Customer bank transfer failed to clear successfully. Usually, this is a result of an ACH failure (insufficient funds, etc.). Represents funds failing to clear either from a verified Customer's bank to the Dwolla network or from the Dwolla network to a verified Customer's bank. |
| customer_bank_transfer_completed | A bank transfer that was created for a Customer has cleared successfully. Represents funds clearing either from a verified Customer's bank to the Dwolla network or from the Dwolla network to a verified Customer's bank. |
| customer_transfer_created | A transfer was created for a Customer. Represents funds transferring from a verified Customer's balance or unverified Customer's bank  |
| customer_transfer_cancelled | A pending transfer has been cancelled, and will not process further. Represents a cancellation of funds transferring either to an unverified Customer's bank or to a verified Customer's balance. |
| customer_transfer_failed | A Customer transfer failed to clear successfully. Represents funds failing to clear either to an unverified Customer's bank or to a verified Customer's balance.|
| customer_transfer_completed | A Customer transfer has cleared successfully. Represents funds clearing either to an unverified Customer's bank or to a verified Customer's balance.|

## List events

Retrieve a list of events for the authorized user.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth *Application* access token.</li>
</ol>

### HTTP request
`GET https://api.dwolla.com/events`

### Request parameters
Parameter | Optional? | Description
----------|------------|-------------
limit | yes | How many results to return.
offset | yes | How many results to skip.

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
events = application_token.get "events"
events.total # => 4

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
events = DwollaSwagger::EventsApi.events
events.total # => 4
```
```php
<?php
$eventsApi = DwollaSwagger\EventsApi($apiClient);

$events = $eventsApi->events();
$events->total; # => 4
?>
```
```python
events_api = dwollaswagger.EventsApi(client)
events = events_api.events()

events.total # => 4
```
```javascript
applicationToken
  .get('events')
  .then(function(res) {
    res.body.total; // => 4
  });
```

## Get event by id

This section covers how to retrieve an event by id.

<ol class="alerts">
    <li class="alert icon-alert-alert">This endpoint <a href="#authentication">requires</a> an OAuth *Application* access token.</li>
</ol>

### HTTP Request
`GET https://api.dwolla.com/events/{id}`

### Request parameters
Parameter | Optional? | Description
----------|------------|-------------
id | no | ID of application event to get.

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
event = application_token.get event_url
event.topic # => "customer_transfer_created"

# Using DwollaSwagger - https://github.com/Dwolla/dwolla-swagger-ruby
event = DwollaSwagger::EventsApi.id(event_url)
event.topic # => "customer_transfer_created"
```
```php
<?php
$eventUrl = 'https://api.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095';

$eventsApi = DwollaSwagger\EventsApi($apiClient);

$event = $eventsApi->id($eventUrl);
$event->topic; # => "customer_transfer_created"
?>
```
```python
event_url = 'https://api.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095'

events_api = dwollaswagger.EventsApi(client)
event = events_api.id(event_url)

event.topic # => 'customer_transfer_created'
```
```javascript
var eventUrl = 'https://api.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095';

applicationToken
  .get(eventUrl)
  .then(function(res) {
    res.body.topic; // => 'customer_transfer_created'
  });
```
