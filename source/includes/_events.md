# Events

When the state of a resource changes, Dwolla creates a new event resource to record the change. When an Event is created, a [Webhook](#webhooks) will be created to deliver the Event to any URLs specified by your active [Webhook Subscriptions](#webhook-subscriptions).

### Events resource

| Parameter | Description |
|-----------|------------|
|_links | Contains links to the event, associated resource, and the Account associated with the event. |
|id | Event id |
|created | ISO-8601 timestamp when event was created |
|topic | Type of event |
|resourceId | id of the resource associated with the event. |

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

### Dwolla Master Account Event topics

##### Accounts

| Topic          | Description           |
|--------------|-------------------------|
| account_suspended | A Dwolla Master Account was suspended. |
| account_activated | A Dwolla Master Account moves from deactivated or suspended to active state of verification. |

##### Funding Sources

| Topic          | Description           |
|--------------|-------------------------|
| funding_source_added | A funding source was added to a Dwolla account. |
| funding_source_removed |  A funding source was removed from a Dwolla account. |
| funding_source_verified | A funding source was marked as `verified`. |
| funding_source_unverified | A funding source has been systematically `unverified`. This is generally a result of a transfer failure. [View our developer resource article](https://developers.dwolla.com/resources/bank-transfer-workflow/transfer-failures.html) to learn more. |
| funding_source_negative | A Dwolla Master Account `balance` has gone negative. You are responsible for ensuring a zero or positive Dwolla balance for your account. If your balance funding source has gone negative, you are responsible for making the Dwolla account whole. Dwolla will notify you via a webhook and separate email of the negative balance. If no action is taken, Dwolla will debit your attached billing source. |
| funding_source_updated | A funding source has been updated. This can also be fired as a result of a correction after a bank transfer processes. For example, a financial institution can issue a correction to change the bank account `type` from `checking` to `savings`. |
| microdeposits_added | Two <=10¢ transfers to a Dwolla Master Account’s linked bank account were initiated. |
| microdeposits_failed | The two <=10¢ transfers to a Dwolla Master Account’s linked bank account failed to clear successfully. |
| microdeposits_completed | The two <=10¢ transfers to a Dwolla Master Account’s linked bank account have cleared successfully. |
| microdeposits_maxattempts | The funding source has reached its max verification attempts limit of three. The funding source can no longer be verified with the completed micro-deposit amounts. |

##### Transfers

| Topic          | Description           |
|--------------|-------------------------|
| bank_transfer_created | A bank transfer was created. Represents funds moving either from a Dwolla Master Account’s bank to the Dwolla network or from the Dwolla network to a Dwolla Master Account’s bank. |
| bank_transfer_cancelled | A pending bank transfer has been cancelled, and will not process further. Represents a cancellation of funds either transferring from a Dwolla Master Account’s bank to the Dwolla network or from the Dwolla network to a Dwolla Master Account’s  bank. |
| bank_transfer_failed | A transfer failed to clear successfully. Usually, this is a result of an ACH failure (insufficient funds, etc.). Represents funds failing to clear either from a Dwolla Master Account’s  bank to the Dwolla network or from the Dwolla network to a Dwolla Master Account’s  bank. |
| bank_transfer_completed | A bank transfer has cleared successfully. Represents funds clearing either from a Dwolla Master Account’s  bank to the Dwolla network or from the Dwolla network to a Dwolla Master Account’s  bank. |
| transfer_created | A transfer was created. Represents funds moving either to or from a Dwolla Master Account's `balance` or `bank`. |
| transfer_cancelled | A pending transfer has been cancelled, and will not process further. Represents a cancellation of funds transferring either to or from a Dwolla Master Account’s `balance` or `bank`. |
| transfer_failed | A transfer failed to clear successfully. Represents funds failing to clear either to or from a Dwolla Master Account’s `balance` or `bank`. |
| transfer_completed | A transfer has cleared successfully. Represents funds clearing either to or from a Dwolla Master Account’s `balance` or `bank`. |

##### Mass Payments

| Topic          | Description           |
|--------------|-------------------------|
| mass_payment_created | A mass payment was created. |
| mass_payment_completed | A mass payment completed. |
| mass_payment_cancelled | A created and deferred mass payment was cancelled. |

##### Statements

| Topic                  | Description                    |
|------------------------|--------------------------------------------------------------------|
| statement_created      | A monthly balance summary and a detailed transaction record for the previous month was created for a Dwolla Master Account. |

### Customer Account Event topics

##### Customers

| Topic          | Description                    |
|------------------|-------------------------------------------------------------------|
| customer_created | A Customer was created. |
| customer_kba_verification_needed | The retry identity verification attempt failed due insufficient scores on the submitted data. The end-user will have a single kba attempt to answer a set of “out of wallet” questions about themselves for identity verification. |
| customer_kba_verification_failed | The end-user failed KBA verification and were unable to correctly answer at least three KBA questions. |
| customer_kba_verification_passed | The end-user was able to correctly answer at least three KBA questions. |
| customer_verification_document_needed | Additional documentation is needed to verify a Customer. |
| customer_verification_document_uploaded | A verification document was uploaded for a Customer. |
| customer_verification_document_failed | A verification document has been rejected for a Customer. |
| customer_verification_document_approved | A verification document was approved for a Customer. |
| customer_reverification_needed | Incomplete information was received for a Customer; updated information is needed to verify the Customer. |
| customer_verified | A Customer was verified. |
| customer_suspended | A Customer was suspended. |
| customer_activated | A Customer moves from deactivated or suspended to an active status. |
| customer_deactivated | A Customer was deactivated.

##### Beneficial Owners

| Topic          | Description                    |
|------------------|-------------------------------------------------------------------|
| customer_beneficial_owner_created | Beneficial owner successfully created. |
| customer_beneficial_owner_removed | An individual beneficial owner has been successfully removed from the Customer |
| customer_beneficial_owner_verification_document_needed | Additional documentation is needed to verify an individual beneficial owner. |
| customer_beneficial_owner_verification_document_uploaded | A verification document was uploaded for beneficial owner. |
| customer_beneficial_owner_verification_document_failed | A verification document has been rejected for a beneficial owner. |
| customer_beneficial_owner_verification_document_approved | A verification document was approved for a beneficial owner. |
| customer_beneficial_owner_reverification_needed | A previously `verified` beneficial owner status has changed due to either a change in the beneficial owner’s information or at request for more information from Dwolla. The individual will need to verify their identity within 30 days. |
| customer_beneficial_owner_verified | A beneficial owner has been verified. |

##### Funding Sources

| Topic          | Description                    |
|------------------|-------------------------------------------------------------------|
| customer_funding_source_added | A funding source was added to a Customer. |
| customer_funding_source_removed | A funding source was removed from a Customer. |
| customer_funding_source_verified | A Customer’s funding source was marked as verified. |
| customer_funding_source_unverified | A funding source has been systematically `unverified`. This is generally a result of a transfer failure. [View our developer resource article](https://developers.dwolla.com/resources/bank-transfer-workflow/transfer-failures.html) to learn more. |
| customer_funding_source_negative | A Customer's `balance` has gone negative. You are responsible for ensuring a zero or positive Dwolla balance for Customer accounts created by your application. If a Customer balance funding source has gone negative, you are responsible for making the Dwolla Customer account whole. Dwolla will notify you via a webhook and separate email of the negative balance. If no action is taken, Dwolla will debit your attached billing source. |
| customer_funding_source_updated | A Customer's funding source has been updated. This can also be fired as a result of a correction after a bank transfer processes. For example, a financial institution can issue a correction to change the bank account `type` from `checking` to `savings`. |
| customer_microdeposits_added | Two <=10¢ transfers to a Customer’s linked bank account were initiated. |
| customer_microdeposits_failed | The two <=10¢ transfers to a Customer’s linked bank account failed to clear successfully. |
| customer_microdeposits_completed | The two <=10¢ transfers to a Customer’s linked bank account have cleared successfully. |
| customer_microdeposits_maxattempts | The Customer has reached their max verification attempts limit of three. The Customer can no longer verify their funding source with the completed micro-deposit amounts. |

##### Transfers

| Topic          | Description                    |
|------------------|-------------------------------------------------------------------|
| customer_bank_transfer_created | A bank transfer was created for a Customer. Represents funds moving either from a verified Customer's bank to the Dwolla network or from the Dwolla network to a verified Customer's bank. |
| customer_bank_transfer_creation_failed | An attempt to initiate a transfer to a verified Customer's bank was made, but failed. Transfers initiated to a verified Customer's bank must pass through the verified Customer's balance before being sent to a receiving bank. Dwolla will fail to create a transaction intended for a verified Customer's bank if the funds available in the balance are less than the transfer amount. |
| customer_bank_transfer_cancelled | A pending Customer bank transfer has been cancelled, and will not process further. Represents a cancellation of funds either transferring from a verified Customer's bank to the Dwolla network or from the Dwolla network to a verified Customer's bank. |
| customer_bank_transfer_failed | A Customer bank transfer failed to clear successfully. Usually, this is a result of an ACH failure (insufficient funds, etc.). Represents funds failing to clear either from a verified Customer's bank to the Dwolla network or from the Dwolla network to a verified Customer's bank. |
| customer_bank_transfer_completed | A bank transfer that was created for a Customer has cleared successfully. Represents funds clearing either from a verified Customer's bank to the Dwolla network or from the Dwolla network to a verified Customer's bank. |
| customer_transfer_created | A transfer was created for a Customer. Represents funds transferring from a verified Customer's balance or unverified Customer's bank  |
| customer_transfer_cancelled | A pending transfer has been cancelled, and will not process further. Represents a cancellation of funds transferring either to an unverified Customer's bank or to a verified Customer's balance. |
| customer_transfer_failed | A Customer transfer failed to clear successfully. Represents funds failing to clear either to an unverified Customer's bank or to a verified Customer's balance. |
| customer_transfer_completed | A Customer transfer has cleared successfully. Represents funds clearing either to an unverified Customer's bank or to a verified Customer's balance. |

##### Mass Payments

| Topic          | Description                    |
|------------------|-------------------------------------------------------------------|
| customer_mass_payment_created | A Verified Customer's mass payment was created. |
| customer_mass_payment_completed | A Verified Customer's mass payment completed. |
| customer_mass_payment_cancelled | A Verified Customer's created and deferred mass payment was cancelled. |
| customer_balance_inquiry_completed | Upon checking a Customer's bank balance, Dwolla will immediately return an HTTP 202 with response body that includes a status of `processing`. This event will be triggered when the bank balance check has completed processing. |

##### Labels

| Topic                  | Description                    |
|------------------------|-------------------------------------------------------------------|
| customer_label_created | A Verified Customer’s label was created. |
| customer_label_ledger_entry_created | A ledger entry was for a Verified Customer’s label was created. |
| customer_label_removed | A Verified Customer’s label was removed. |

## List events

Retrieve a list of events for the application. **Note:** Dwolla will only guarantee access to events through the API over a rolling 30-day period.

### HTTP request

`GET https://api.dwolla.com/events`

### Request parameters

| Parameter | Required | Type | Description |
|-----------|----------|----------------|-----------|-------------|
| limit | no | integer | How many results to return |
| offset | no | integer | How many results to skip |

### HTTP status and error codes

| HTTP Status | Message |
|--------------|-------------|
| 404 | Resource not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/events
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/events"
    },
    "first": {
      "href": "https://api-sandbox.dwolla.com/events?limit=25&offset=0"
    },
    "last": {
      "href": "https://api-sandbox.dwolla.com/events?limit=25&offset=150"
    },
    "next": {
      "href": "https://api-sandbox.dwolla.com/events?limit=25&offset=25"
    }
  },
  "_embedded": {
    "events": [
      {
        "_links": {
          "self": {
            "href": "https://api-sandbox.dwolla.com/events/78e57644-56e4-4da2-b743-059479f2e80f"
          },
          "resource": {
            "href": "https://api-sandbox.dwolla.com/transfers/47CFDDB4-1E74-E511-80DB-0AA34A9B2388"
          },
          "account": {
            "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
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
            "href": "https://api-sandbox.dwolla.com/events/f8e70f48-b7ff-47d0-9d3d-62a099363a76"
          },
          "resource": {
            "href": "https://api-sandbox.dwolla.com/transfers/48CFDDB4-1E74-E511-80DB-0AA34A9B2388"
          },
          "account": {
            "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
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
            "href": "https://api-sandbox.dwolla.com/events/9f0167e0-dce6-4a1a-ad26-30015d6f1cc1"
          },
          "resource": {
            "href": "https://api-sandbox.dwolla.com/transfers/08A166BC-1B74-E511-80DB-0AA34A9B2388"
          },
          "account": {
            "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
          }
        },
        "id": "9f0167e0-dce6-4a1a-ad26-30015d6f1cc1",
        "created": "2015-10-16T15:37:03.000Z",
        "topic": "bank_transfer_created",
        "resourceId": "08A166BC-1B74-E511-80DB-0AA34A9B2388"
      }
    ]
  },
  "total": 3
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
events = app_token.get "events"
events.total # => 3
```
```php
<?php
$eventsApi = new DwollaSwagger\EventsApi($apiClient);

$events = $eventsApi->events();
$events->total; # => 3
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
events = app_token.get('events')
events.body['total'] # => 3
```
```javascript
appToken
  .get('events')
  .then(res => res.body.total); // => 3
```

## Retrieve an event

This section covers how to retrieve an event by id.

### HTTP Request
`GET https://api.dwolla.com/events/{id}`

### Request parameters
| Parameter | Required | Type | Description |
|-----------|----------|----------------|-------------|
| id | yes | string | ID of application event to get. |

### HTTP status and error codes
| HTTP Status | Message |
|--------------|-------------|
| 404 | Application event not found. |

### Request and response

```raw
GET https://api-sandbox.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer pBA9fVDBEyYZCEsLf/wKehyh1RTpzjUj5KzIRfDi0wKTii7DqY

...

{
  "_links": {
    "self": {
      "href": "https://api-sandbox.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095"
    },
    "resource": {
      "href": "https://api-sandbox.dwolla.com/transfers/09A166BC-1B74-E511-80DB-0AA34A9B2388"
    },
    "account": {
      "href": "https://api-sandbox.dwolla.com/accounts/ca32853c-48fa-40be-ae75-77b37504581b"
    },
    "customer": {
      "href": "https://api-sandbox.dwolla.com/customers/07d59716-ef22-4fe6-98e8-f3190233dfb8"
    }
  },
  "id": "81f6e13c-557c-4449-9331-da5c65e61095",
  "created": "2015-10-16T15:37:02.000Z",
  "topic": "customer_transfer_created",
  "resourceId": "09A166BC-1B74-E511-80DB-0AA34A9B2388"
}
```
```ruby
# Using DwollaV2 - https://github.com/Dwolla/dwolla-v2-ruby
event_url = 'https://api-sandbox.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095'

event = app_token.get event_url
event.topic # => "customer_transfer_created"
```
```php
<?php
$eventUrl = 'https://api-sandbox.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095';

$eventsApi = new DwollaSwagger\EventsApi($apiClient);

$event = $eventsApi->id($eventUrl);
$event->topic; # => "customer_transfer_created"
?>
```
```python
# Using dwollav2 - https://github.com/Dwolla/dwolla-v2-python
event_url = 'https://api-sandbox.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095'

event = app_token.get(event_url)
event.body['topic'] # => 'customer_transfer_created'
```
```javascript
var eventUrl = 'https://api-sandbox.dwolla.com/events/81f6e13c-557c-4449-9331-da5c65e61095';

appToken
  .get(eventUrl)
  .then(res => res.body.topic); // => 'customer_transfer_created'
```
* * *
