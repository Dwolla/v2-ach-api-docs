# Transfer Money Between Customers

## Scenario
If you wish to reconcile funds between users that have existing customer records, it is recommended that you initiate a transfer in between those users, or more specifically, `Customers`. An example integration could be an online marketplace. 

### Requirements
- The customer `id` field for the two parties you wish to move funds amongst, or the location of that resource.
- One of the two customers must be verified. Given the marketplace scenario, it would make the most sense to have the vendor own the verified customer record so as not to inconvenience the consumer.
- Valid OAuth authorization with the `Send` scope.

## Creating a verified customer
If you do not already have a verified `Customer`, you can create one, but you must specify additional information in order to pass verification. Currently, only `personal` customers can be created, with support for `business` type customers coming soon. 

```ruby
require 'dwolla_swagger'

new_customer = DwollaSwagger::CustomersApi.create({:body => {
	:firstName => 'Jane',
	:lastName => 'Doe',
	:email => 'jdoe@nomail.net',
	:type => 'personal',
	:address => '36-36 33rd St',
	:city => 'Long Island City',
	:state => 'NY',
	:postalCode => '11101',
	:dateOfBirth => '1970-01-01',

	# For the first attempt, only 
	# the last 4 digits of SSN required

	# If the entire SSN is provided, 
	# it will still be accepted
	:ssn => '1234'
}})

p new_customer # => https://api-uat.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C
```

`new_customer` contains the location of the newly created resource. 

### Retrying verification
If the data submitted failed verification, the `Customer` created will be placed into the `retry` state. This can happen if any information is miskeyed or invalid. Upon retrying verification, it is required to submit the customer's entire SSN. 

```ruby
require 'dwolla_swagger'

retried_customer = DwollaSwagger::CustomersApi.update_customer('AB443D36-3757-44C1-A1B4-29727FB3111C', {:body => {
	:firstName => 'Jane',
	:lastName => 'Doe',
	:email => 'jdoe@nomail.net',
	:type => 'personal',
	:address => '36-36 33rd St',
	:city => 'Long Island City',
	:state => 'NY',
	:postalCode => '11101',
	:dateOfBirth => '1970-01-01',

	# For the retry attempt, the 
	# entire SSN is required
	:ssn => '123-456-7890'
}})

p retried_customer # => https://api-uat.dwolla.com/customers/AB443D36-3757-44C1-A1B4-29727FB3111C
```

`retried_customer` contains the location of the resource. 


## Searching for customers
If you do not have the `id` field of the customers you wish to move funds amongst, you can retrieve it by listing your customers and finding them by some other identifying criterion. We will search by the `e-mail` field and retrieve the location of the resources associated with `david@dwolla.com` and `gordon@dwolla.com`.

```ruby
require 'dwolla_swagger'

my_customers = DwollaSwagger::CustomersApi.list()
look_for = ['david@dwolla.com', 'gordon@dwolla.com']
found = []

my_customers[:_embedded][:customers].each do |customer|
    found.push(customer[:_links][:self]) if look_for.include?(customer)
end
```

## Initiating the transfer
Now that we have all that is required, we can initiate the transfer in between the users.

```ruby
require 'dwolla_swagger'

## Data from earlier
found = ['https://api-uat.dwolla.com/customers/25411E89-EB54-47FC-954B-52AA791A5860', # Gordon
         'https://api-uat.dwolla.com/customers/97E42012-BFBA-4EC1-93EC-BA9414E610CC'] # David

transfer = DwollaSwagger::TransfersApi.create({:body => {
           :_links => {
               :destination => {:href => found[0]},
               :source => {:href => found[1]}
           },
           :amount => {:currency => 'USD', :value => 5.00}
}})

p transfer # => 'https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388'
```

`transfer` now holds a string with the location of the resource which you have just created. If you have a webhook subscription associated with your application, you will be notified with a `transfer_created` event and either a `transfer_cancelled`, `transfer_completed`, `transfer_failed`, or `transfer_reclaimed` event.


## Checking the status of your transfer
Generally, to ensure that the parties being transacted upon do not get upset and send e-mails at 2:00 AM, it would be wise to check upon the status of your transfer. You will have to retrieve the transfer by its ID, which is part of the resource location.

**NOTE**: Attempting to access a `Transfer` immediately after it is created can result in a HTTP 405 error. If you encounter this, everything is OK, just try your request a little bit later. Generally, most transfers are available 10-15s after they have been created.

```ruby
require 'dwolla_swagger'

transfer = 'https://api.dwolla.com/transfers/74c9129b-d14a-e511-80da-0aa34a9b2388'
retrieved = DwollaSwagger::TransfersApi.by_id(transfer.split('/')[-1]

p retrieved[:status] == 'processed' ? "Happy emails" : "Angry emails"
```