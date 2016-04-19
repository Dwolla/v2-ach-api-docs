# SDK Support

The Dwolla API V2 has officially maintained software packages to make it easier for developers to get started with making requests against the API. This section is here to provide basic instructions on how to install these packages and get up and running with them. We recommend you use a POSIX-standardized shell on your development machine, and assume that you are already familiar and set-up with any tools required for your specific technical ecosystem.

Each SDK is automatically versioned with the [Dwolla API Schema](https://api-uat.dwolla.com/swagger.json); all libraries (with the exception of JavaScript) are organized in a similar manner. Each endpoint grouping is assigned a class and then an operation which you can use to make a request. You can choose which environment to target (e.g production vs sandbox) by providing the SDK a different API host value.

#### API Hosts

|Production|Sandbox|
|----|----|
|api.dwolla.com|api-uat.dwolla.com|


## DwollaSwagger Ruby

`dwolla-swagger-ruby` is available on [RubyGems](https://rubygems.org/gems/dwolla_swagger) with [source code](https://github.com/Dwolla/dwolla-swagger-ruby) available on our GitHub page. More information is available on the project's README.

### Installation

```bashnoselect
gem install dwolla_swagger
```

### Quickstart

Let's list some `Customer` objects:

```rubynoselect
require 'dwolla_swagger'

DwollaSwagger::Swagger.configure do |config|
    config.access_token = 'a token'
    config.host = 'api-uat.dwolla.com'
    config.base_path = '/'
end

my_custies = DwollaSwagger::CustomersApi.list(:limit => 10)
```

## DwollaV2 Ruby

`dwolla_v2` is available on [RubyGems](https://rubygems.org/gems/dwolla_v2) with [source code](https://github.com/Dwolla/dwolla-v2-ruby) available on our GitHub page. More information is available on the project's README.

### Installation

```bashnoselect
gem install dwolla_v2
```

### Quickstart

Let's fetch a page of customers:

```rubynoselect
require 'dwolla_v2'

# see dwolla.com/applications for your client id and secret
$dwolla = DwollaV2::Client.new(id: "...", secret: "...")

# generate a token on dwolla.com/applications
account_token = $dwolla.tokens.new access_token: "..."

customers = account_token.get "customers", limit: 10
```

## Python

`dwolla-swagger-python` is available on [PyPi](https://pypi.python.org/pypi/dwollaswagger) with [source code](https://github.com/Dwolla/dwolla-swagger-python) available on our GitHub page. More information is available on the project's README.

### Installation

```bashnoselect
pip install dwollaswagger
```

### Quickstart

Let's list some `Customer` objects:

```pythonnoselect
dwollaswagger.configuration.access_token = 'token'
client = dwollaswagger.ApiClient('https://api-uat.dwolla.com')

customers_api = dwollaswagger.CustomersApi(client)
my_custies =  customers_api.list(limit=10)
```

## PHP

`dwolla-swagger-php` is available on [Packagist](https://packagist.org/packages/dwolla/dwollaswagger) with [source code](https://github.com/Dwolla/dwolla-swagger-php) available on our GitHub page. More information is available on the project's README.

### Installation

```bashnoselect
composer require dwolla/dwollaswagger
composer install
```

### Quickstart

Let's list some `Customer` objects:

```phpnoselect
<?php
require('../path/to/vendor/autoload.php');

DwollaSwagger\Configuration::$access_token = 'a token';
$apiClient = new DwollaSwagger\ApiClient("https://api-uat.dwolla.com/");

$customersApi = new DwollaSwagger\CustomersApi($apiClient);
$myCusties = $customersApi->_list(10);

?>
```

## Java

`dwolla-swagger-java` will soon be available on Maven Central with [source code](https://github.com/Dwolla/dwolla-swagger-java) available on our GitHub page. More information is available on the project's README.

### Installation

You will be required to install from source, please have `Git` and `mvn` installed and in your path, then:

```bashnoselect
git clone https://github.com/Dwolla/dwolla-swagger-java
cd dwolla-swagger-java
mvn install package
```

### Quickstart

Let's list some `Customer` objects:

```javanoselect
import io.swagger.client.ApiClient;
import io.swagger.client.api.*;
import io.swagger.client.model.*;

ApiClient a = new ApiClient();
a.setBasePath("https://api-uat.dwolla.com");
a.setAccessToken("a token");

CustomersApi c = new CustomersApi(a);
CustomerListResponse custies = c.list(10);
```

## JavaScript

Dwolla does not maintain a JavaScript package -- developers are encouraged to use the `swagger-js` project, available on [npm](https://www.npmjs.com/package/swagger-client) with [source code](https://github.com/swagger-api/swagger-js) on the swagger-api project GitHub page.

### Installation

```bashnoselect
npm install swagger-client
```

### Quickstart

Let's list some `Customer` objects:

```javascriptnoselect
var client = require('swagger-client');

var dwolla = new client({
    url: 'https://api-uat.dwolla.com/swagger.json',
    authorizations: {
        dwollaHeaderAuth: new client.ApiKeyAuthorization('Authorization', 'Bearer your_token', 'header')
    },
    usePromise: true
});


dwolla.then(function(dwolla) {
    dwolla.customers.list({limit:10}).then(function(data) {
        console.log(data);
    })
})
```

Since this library sets up all operations on demand (i.e this isn't a Dwolla-specific package), you can query `.help()` to help you retrieve more information as such:

```javascriptnoselect
dwolla.then(function(dwolla) {
    dwolla.events.help();
});
// operations for the 'events' tag
//   * events: List events.
//   * id: Get an event by id.

dwolla.then(function(dwolla) {
    dwolla.events.id.help();
});
// id: Get an event by id.
//   * id (string): ID of application event to get.
```
