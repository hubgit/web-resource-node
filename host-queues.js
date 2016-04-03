'use strict'

const async = require('async')
const urlparser = require('url')
const fetch = require('node-fetch')

module.exports = {
  queues: {},
  enqueue: function (task, callback) {
    return this.queue(task.url).push(task, callback)
  },
  queue: function (url) {
    var host = urlparser.parse(url).host

    if (!this.queues[host]) {
      this.queues[host] = async.queue(function (task, callback) {
        fetch(task.url, task.options).then(callback)
      })
    }

    return this.queues[host]
  }
}
