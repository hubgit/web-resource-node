'use strict'

const querystring = require('querystring')
const queues = require('./queues')

module.exports = Resource

function Resource (url, params) {
  if (!(this instanceof Resource)) {
    return new Resource(url, params)
  }

  this.url = url
  this.params = params
}

Resource.prototype.get = function (format, options) {
  if (options && options.next) {
    return new Promise(function (resolve, reject) {
      this.chunk(this.url, this.params, format, options).then(resolve)
    }.bind(this))
  }

  return this.request(this.url, this.params, format, options)
}

Resource.prototype.chunk = function (url, params, format, options) {
  return this.request(url, params, format, options).then(function (data) {
    if (options.process) {
      options.process(data)
    }

    // TODO: options.next could be a string (jmespath, CSS selector, XPath, etc)
    // TODO: iterate over a generator?
    var next = options.next(data, url, params)

    if (next) {
      return this.chunk(next.url, next.params, format, options)
    }
  }.bind(this))
}

Resource.prototype.request = function (url, params, format, options) {
  format = format || 'json'

  options = options || {}
  options.headers = options.headers || {}
  options.headers.accept = options.headers.accept || this.accept(format)

  if (params) {
    url += '?' + querystring.stringify(params)
  }

  return new Promise(function (resolve, reject) {
    var task = {
      url: url,
      options: options
    }

    queues.enqueue(task, function (response) {
      if (response.ok) {
        var parse = options.raw ? response.text() : this.parse(response, format)

        parse.then(function (data) {
          // TODO: options.select could be a string, array or object (jmespath, CSS selector, etc)
          // resolve(options.select ? options.select(data) : data)
          resolve(data)
        })
      } else {
        // TODO: pause queue, retry if limited/server error
        reject(response.statusText)
      }
    }.bind(this))
  }.bind(this))
}

Resource.prototype.accept = function (format) {
  switch (format) {
    case 'json':
      return 'application/json'
    case 'html':
      return 'text/html'
    case 'xml':
      return 'application/xml'
    case 'csv':
      return 'text/csv'
    case 'text':
      return 'text/plain'
    default:
      return '*'
  }
}

Resource.prototype.parse = function (response, format) {
  switch (format) {
    case 'text':
    case 'csv':
      return response.text()
    case 'blob':
      return response.blob()
    case 'arraybuffer':
      return response.arrayBuffer()
    case 'json':
    default:
      return response.json()
  }
}
