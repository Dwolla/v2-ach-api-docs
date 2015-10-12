# Webhooks

## What is a webhook?
A webhook is a means of notifying a third-party application of the occurence of an event with some relevant information. In the Dwolla V2 API, webhooks are triggered by the following resources: 

- Customers
- Funding Sources
- Transfers

Each webhook sent by the Dwolla API contains an `eventId`, `accountId`, and `topic` which can be used to retrieve more information about the resources that triggered the event, or the resources themselves. Also included is an array of `attempts` that document the delivery of the message to your callback URL. The API will continue to make [multiple attempts](http://docsv2.dwolla.com/#webhook-subscriptions) until your callback URL responds with an HTTP 2xx success message, or until the 8th attempt -- whichever comes first. 

### Webhook schema

```json
{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/webhooks/76ce47b9-5b3c-4ac8-a743-ce318afbaecd"
    }
  },
  "id": "76ce47b9-5b3c-4ac8-a743-ce318afbaecd",
  "topic": "string",
  "accountId": "string",
  "eventId": "string",
  "subscriptionId": "string",
  "attempts": [
    {
      "id": "string",
      "request": {
        "created": "2015-07-23T14:19:36.981Z",
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
        "created": "2015-07-23T14:19:36.981Z",
        "headers": [
          {
            "name": "string",
            "value": "string"
          }
        ],
        "statusCode": 0,
        "body": "string"
      }
    },
    ...
  ]
}
```

## Subscribing to webhooks

### Obtain authorization
To subscribe to webhooks, you must first obtain client authorization via OAuth. You will be requesting these credentials on the behalf of your own applcation, so there will be no OAuth permissions dialog; you are only required to provide your `client_id` and `client_secret`. 

**NOTE**: Currently, the Dwolla/Swagger SDKs do not contain the capability to do this, so you must use an external REST client. We are working on resolving this. 

##### Request
```json
{
  "client_id": "foo",
  "client_secret": "bar",
  "grant_type": "client_credentials"
}
```
##### Response
```json
{
  "access_token": "(...)",
  "token_type": "bearer",
  "expires_in": 3600,
  "scope": "AccountInfoFull|ManageAccount|Contacts|Transactions|Balance|Send|Request|Funding"
}
```

### Create Subscription
Each application can have multiple subscriptions associated to it. While one subscription is sufficient, you can create as many as you want for redundancy. 

To make the following request, we will need to use the `access_token` we just previously obtained. 

```ruby
require 'dwolla_swagger'

subscription = DwollaSwagger::WebhooksubscriptionsApi.create({:body => {
  :url => "http://myawesomeapplication.com/destination",
  :secret => "your client_secret"
}})

p subscription # => https://api-uat.dwolla.com/webhook-subscriptions/5af4c10a-f6de-4ac8-840d-42cb65454216
```

You can retrieve your newly created subscription by its ID

```ruby
require 'dwolla_swagger'

retrieved = DwollaSwagger::WebhooksubscriptionApi.id(subscription.split('/')[-1])
retrieved = retrieved.to_hash()
```

### View all subscriptions
As your infrastructure grows and branches out, it would be wise to occassionally index and manage the webhook subscriptions that you have created to the Dwolla API. We can take a look at our application's subscriptions by doing the following...

```ruby
require 'dwolla_swagger'

subs = DwollaSwagger::WebhooksubscriptionApi.list().to_hash()
```

## Using webhooks to your advantage
Assume that your integration is an online marketplace, and that a customer just placed an order on your site. A few hours after the customer initiated their payment, your application receives this webhook.

```json
{
  "_links": {
    "self": {
      "href": "https://api.dwolla.com/webhooks/76ce47b9-5b3c-4ac8-a743-ce318afbaecd"
    }
  },
  "id": "76ce47b9-5b3c-4ac8-a743-ce318afbaecd",
  "topic": "transfer_completed",
  "accountId": "f2faf682-e63d-4259-a815-6f2884c95fc9",
  "eventId": "fd63c3e0-2563-4c72-9d7d-1e799ce5a829",
  "subscriptionId": "6c08acf6-5ff4-4167-92db-49df4088d554",
  "attempts": [...]
}
```

#### Step 1: Retrieve event
The `topic` field of a webhook holds [a description](http://docsv2.dwolla.com/#events) of the event (think of it as you would the subject of an e-mail message). The `webhook` contains an `eventId` that can be used to retrieve more information about the webhook you have received. 

**NOTE**: The `event` must be retrieved with a `client_credentials` granted access_token.

```ruby
require 'dwolla_swagger'

## Assuming Rails-style POST parameter
if params[:webhook] == 'transfer_completed'
	event = DwollaSwagger::EventsApi.id(params[:webhook][:eventId])
elsif params[:webhook] == 'another_event'
	"..."
end
```

### Step 2: Retrieve resource

##### Retrieved event
```json
{
  "_links": {
    "self": {
      "href": "https:\/\/api-uat.dwolla.com\/events\/fd63c3e0-2563-4c72-9d7d-1e799ce5a829"
    },
    "resource": {
      "href": "https:\/\/api-uat.dwolla.com\/transfers\/FD8971AB-FE6D-E511-80DB-0AA34A9B2388"
    }
  },
  "id": "fd63c3e0-2563-4c72-9d7d-1e799ce5a829",
  "created": "2015-10-08T20:53:49.000Z",
  "accountId": "f2faf682-e63d-4259-a815-6f2884c95fc9",
  "topic": "transfer_completed",
  "resourceId": "FD8971AB-FE6D-E511-80DB-0AA34A9B2388"
}
```

Now that the `event` has been retrieved, we have some more information. The `_links` object contains the location of the resource that fired this event, namely, the `Transfer` that has completed. Since we wish to send an e-mail to those customers, we will need to retrieve their IDs so that we know where to send those messages.

```ruby
require 'dwolla_swagger'

## Assuming Rails-style POST parameter
if params[:webhook] == 'transfer_completed'
	event = DwollaSwagger::EventsApi.id(params[:webhook][:eventId])
	transfer = DwollaSwagger::TransfersApi.by_id(event[:resourceId])
elsif params[:webhook] == 'another_event'
	"..."
end
```

### Step 3: Send e-mails 

##### Retrieved transfer
```json
{
  "_links": {
    "self": {
      "href": "https://api-uat.dwolla.com/transfers/FD8971AB-FE6D-E511-80DB-0AA34A9B2388"
    },
    "source": {
      "href": "https://api-uat.dwolla.com/customers/0270BAED-DDA5-46D0-B074-E7F3D478896F"
    },
    "destination": {
      "href": "https://api-uat.dwolla.com/customers/11DF77EB-07D8-46CC-ADB2-F5EFF24BB7BE"
    }
  },
  "id": "FD8971AB-FE6D-E511-80DB-0AA34A9B2388",
  "status": "processed",
  "amount": {
    "value": "0.01",
    "currency": "USD"
  },
  "created": "2015-10-08T14:47:04.153Z"
}
```

Now that we have the `transfer`, we can take a look at the `_links` object and retrieve the `customers` that need to be notified. From here on, you can either make a call to `customers/{id}` to retrieve their e-mail addresses (or your own database) so that you can send your notification message.
