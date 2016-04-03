# web-resource

A simple interface for fetching web resources.

## Install

```
npm install web-resource
```

## Usage

```
const Resource = require('web-resource')

Resource('http://example.com/items/1').get('json').then(function (data) {
 // do something with the data
})
```

Requests to the same domain are fetched serially, using an asynchronous queue, resolving a Promise when the request succeeds.

