import async from 'async'
import fetch from 'node-fetch'
import { URL } from 'node:url'

export default {
  queues: {},
  enqueue: function (task, callback) {
    return this.queue(task.url).push(task, callback)
  },
  queue: function (url) {
    const host = new URL(url).host

    if (!this.queues[host]) {
      this.queues[host] = async.queue(function (task, callback) {
        console.log('Fetching ' + task.url)
        fetch(task.url, task.options).then(callback)
      })
    }

    return this.queues[host]
  }
}
