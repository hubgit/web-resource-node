'use strict'

const cheerio = require('cheerio')
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
  var url = this.url

  if (this.params) {
    url += '?' + querystring.stringify(this.params)
  }

  format = format || 'json'

  options = options || {}
  options.headers = options.headers || {}
  options.headers.accept = options.headers.accept || this.accept(format)

  return new Promise(function (resolve, reject) {
    var task = {
      url: url,
      options: options
    }

    queues.enqueue(task, function (response) {
      if (response.ok) {
        var data = this.parse(response, format)
        // TODO: alter/select from HTML document
        resolve(data)
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
    case 'html':
      return cheerio.load(response.text())
    case 'xml':
      return cheerio.load(response.text(), { xmlMode: true })
    case 'json':
    default:
      return response.json()
  }
}
