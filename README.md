# web-resource

A simple interface for fetching web resources.

## Install

```javascript
npm install web-resource
```

## Usage

```javascript
const Resource = require('web-resource')

Resource('http://example.com/items/1').get('json').then(function (data) {
 // do something with the data
})
```

Requests to the same domain are fetched serially, using an asynchronous queue, resolving a Promise when the request succeeds.

## Usage: query parameters

The first argument to `Resource` is the URL, the second argument is the query parameters

```javascript
Resource('http://example.com/items/', {
 sort: 'name',
 rows: 10
})
```

## Usage: collections

The first argument to `get` is the format, the second argument is the options.

If `options.next` is set, the response data is passed to `options.next`; the next Resource to fetch should be returned.
If `options.next` and `options.process` are set, the response data is passed to `options.process` instead of being returned when the Promise is resolved.


```javascript
Resource('http://example.com/items/').get('json', {
  process: function (data) {
    data.resultList.result.forEach(function (item) {
      console.log(item)
    })
  },
  next: function (data) {
   return Resource(data._links.next.href)
  }
})
```
