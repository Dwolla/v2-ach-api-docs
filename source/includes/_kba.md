# Knowledge-based Authentication (KBA)

Knowledge-based authentication, commonly referred to as KBA, is a method of authentication which seeks to prove the identity of an individual. KBA requires the knowledge of private information of the individual to prove that the person providing the identity information is the owner of the identity. Questions are compiled from public and private data such as marketing data, credit reports or transaction history.

> **Note:** KBA as a method of verifying an identity is only available to Personal Verified Customers at this time. 

### KBA Links

| Links  | Description |
|--------|------------|
| answer | Url of the correct KBA answer |

## Initiate KBA Session

This section covers how to generate a new KBA identifier which is used to represent the session for the user created as a personal Verified Customer record.

### HTTP Request

`POST https://api.dwolla.com/customers/{id}/kba`

### Request parameters

| Parameter | Required? | Type      | Description                               |
|-----------|-----------|-----------|-------------------------------------------|
| id        | yes       | string    | The ID of the Customer to verify via KBA. |

### Example resquest and response

```raw
POST https://api.dwolla.com/customers/33aa88b1-97df-424a-9043-d5f85809858b/kba
Authorization: Bearer cRahPzURfaIrTKL18tmslWPqKdzkLeYJm0oB1hGJ1vMPArft1v
Content-Type: application/json
Accept: application/vnd.dwolla.v1.hal+json

...

HTTP/1.1 201 Created\
Location: https://api.dwolla.com/kba/33aa88b1-97df-424a-9043-d5f85809858b
```

```ruby
customer_url = 'https://api-sandbox.dwolla.com/customers/ca22d192-48f1-4b72-b29d-681e9e20795d'

kba = app_token.post "#{customer_url}/kba"
kba.response_headers[:location] # => "https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31"
```
```php
/**
 * No example for this language yet. Coming soon to the dwolla-swagger-php SDK.
 **/
```
```python
customer_url = 'https://api-sandbox.dwolla.com/customers/61a74e62-e27d-46f1-9fa6-a8e57226bb3e'

kba = app_token.post('%s/kba' % customer_url)
kba.headers['location'] # => "https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31"
```
```javascript
var customerUrl = 'https://api-sandbox.dwolla.com/customers/61a74e62-e27d-46f1-9fa6-a8e57226bb3e';

appToken
  .post(`${customerUrl}/kba`)
  .then(res => res.headers.get('location')); // => 'https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31'
```

### HTTP Status and Error Codes

| HTTP Status | Code                 | Description                                |
|-------------|----------------------|--------------------------------------------|
| 201         | Created              | A KBA question for a Customer was created. |
| 403         | InvalidResourceState | Customer verification status is not valid for kba.                                                     |
| 403         | Forbidden            | The supplied credentials are not authorized for this resource. Not authorized to create KBA questions. |
| 404         | NotFound             | Customer not found. Check CustomerId.      |

## Retrieve KBA Questions

On KBA question creation, Dwolla will return a 201 HTTP statusCode and a link to the KBA session from which to retrieve questions.
This section covers how to retrieve KBA questions after you have created the KBA session. 

### HTTP Request

`GET https://api.dwolla.com/kba/{id}`

### Request parameters

| Parameter | Required? | Type      | Description                                          |
|-----------|-----------|-----------|------------------------------------------------------|
| id        | yes       | string    | The id of the KBA session to retrieve questions for. |

### Example resquest and response

```raw
GET https://api.dwolla.com/kba/33aa88b1-97df-424a-9043-d5f85809858b
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer cRahPzURfaIrTewKL18tmslWPqKdzkLeYJm0oB1hGJ1vMPArft1v

...

{
    "_links": {
        "answer": {
            "href": "https://api-sandbox.dwolla.com/kba/33aa88b1-97df-424a-9043-d5f85809858b",
            "type": "application/vnd.dwolla.v1.hal+json",
            "resource-type": "kba"
        }
    },
    "id": "33aa88b1-97df-424a-9043-d5f85809858b",
    "questions": [
        {
            "id": "2355953375",
            "text": "In what county do you currently live?",
            "answers": [
                {
                    "id": "2687969295",
                    "text": "Pulaski"
                },
                {
                    "id": "2687969305",
                    "text": "St. Joseph"
                },
                {
                    "id": "2687969315",
                    "text": "Daviess"
                },
                {
                    "id": "2687969325",
                    "text": "Jackson"
                },
                {
                    "id": "2687969335",
                    "text": "None of the above"
                }
            ]
        },
        {
            "id": "2355953385",
            "text": "Which team nickname is associated with a college you attended?",
            "answers": [
                {
                    "id": "2687969345",
                    "text": "Colts"
                },
                {
                    "id": "2687969355",
                    "text": "Eagles"
                },
                {
                    "id": "2687969365",
                    "text": "Gator"
                },
                {
                    "id": "2687969375",
                    "text": "Sentinels"
                },
                {
                    "id": "2687969385",
                    "text": "None of the above"
                }
            ]
        },
        {
            "id": "2355953395",
            "text": "What kind of IA license plate has been on your 1996 Acura TL?",
            "answers": [
                {
                    "id": "2687969395",
                    "text": "Antique"
                },
                {
                    "id": "2687969405",
                    "text": "Disabled Veteran"
                },
                {
                    "id": "2687969415",
                    "text": "Educational Affiliation"
                },
                {
                    "id": "2687969425",
                    "text": "Military Honor"
                },
                {
                    "id": "2687969435",
                    "text": "I have never been associated with this vehicle"
                }
            ]
        }
    ]
}
```

```ruby
kba_url = 'https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31'

kba_questions = app_token.get kba_url
kba_questions.id # => "70b0e9cc-020d-4de2-9a82-a2281afa4c31"
```
```php
/**
 * No example for this language yet. Coming soon to the dwolla-swagger-php SDK.
 **/
```
```python
kba_url = 'https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31'

kba_questions = app_token.get(kba_url)
kba_questions.id # => '70b0e9cc-020d-4de2-9a82-a2281afa4c31'
```
```javascript
var kbaUrl = 'https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31';

appToken
  .get(kbaUrl)
  .then(res => res.body.id); // => '70b0e9cc-020d-4de2-9a82-a2281afa4c31'
```

### HTTP Status and Error Codes

| HTTP Status | Code                 | Description                               |
|-------------|----------------------|-------------------------------------------|
| 200         | OK                   | Pending KBA questions exist.              |
| 403         | InvalidResourceState | The kba session is no longer valid.       |
| 403         | Forbidden            | Not authorized to retrieve KBA questions. |
| 404         | NotFound             | KBA questions not found. Check KBA id.    |

## Verify KBA Questions

This section covers how to verify the KBA questions for Customer verification.

### HTTP Request

`POST https://api.dwolla.com/kba/{id}`

### Request parameters

| Parameter | Required? | Type      | Description                                          |
|-----------|-----------|-----------|------------------------------------------------------|
| id        | yes       | string    | The id of the KBA session to verify questions for.   |
| answers   | yes       | object    | An array of four JSON objects that each consist of  two key-value pairs -- `questionId` and  `answerId`. |

#### answers JSON object

| Parameter  | Required? | Type      | Description                                          |
|------------|-----------|-----------|------------------------------------------------------|
| questionId | yes       | string    | The id of a question in a KBA session.               |
| answerId   | yes       | string    | The id of an answer to the corresponding question in a KBA session. |

### Example resquest and response

```raw
POST https://api.dwolla.com/kba/33aa88b1-97df-424a-9043-d5f85809858b
Accept: application/vnd.dwolla.v1.hal+json
Authorization: Bearer cRahPzURfaIrTewKL18tmslWPqKdzkLeYJm0oB1hGJ1vMPArft1v

...

{
    "answers": [
        {
            "questionId": "2355953375",
            "answerId": "2687969335"
        },
        {
            "questionId": "2355953385",
            "answerId": "2687969385"
        },
        {
            "questionId": "2355953395",
            "answerId": "2687969435"
        },
        {
            "questionId": "2355953405",
            "answerId": "2687969485"
        }
    ]
}
```
```ruby
kba_url = 'https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31'

request_body = {
    :answers => [
        {
            :questionId => "2355953375",
            :answerId => "2687969335"
        },
        {
            :questionId => "2355953385",
            :answerId => "2687969385"
        },
        {
            :questionId => "2355953395",
            :answerId => "2687969435"
        },
        {
            :questionId => "2355953405",
            :answerId => "2687969485"
        }
    ]
}

kba_answers = app_token.post kba_url, request_body
```
```php
/**
 * No example for this language yet. Coming soon to the dwolla-swagger-php SDK.
 **/
```
```python
kba_url = 'https://api-sandbox.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31'

request_body = {
    'answers' : [
        {
            'questionId': "2355953375",
            'answerId': "2687969335"
        },
        {
            'questionId': "2355953385",
            'answerId': "2687969385"
        },
        {
            'questionId': "2355953395",
            'answerId':"2687969435"
        },
        {
            'questionId': "2355953405",
            'answerId': "2687969485"
        }
    ]
}

kba_answers = app_token.post (kba_url, request_body)
```
```javascript
var kbaUrl = 'https://api.dwolla.com/kba/70b0e9cc-020d-4de2-9a82-a2281afa4c31';
var requestBody = {
  answers : [
        {
            questionId: '2355953375',
            answerId: '2687969335'
        },
        {
            questionId: '2355953385',
            answerId: '2687969385'
        },
        {
            questionId: '2355953395',
            answerId:'2687969435'
        },
        {
            questionId: '2355953405',
            answerId: '2687969485'
        }
    ]
};

appToken
  .post(kbaUrl, requestBody)
```

### HTTP Status and Error Codes

| HTTP Status | Code                 | Description                               |
|-------------|----------------------|-------------------------------------------|
| 200         | OK                   | KBA scoring is complete. Check verificationStatus to determine if the user passed or failed KBA verification. |
| 403         | InvalidResourceState | The kba session has expired. |
| 403         | InvalidResourceState | The kba session is no longer valid. |
| 404         | NotFound             | KBA session not found. |

* * *
