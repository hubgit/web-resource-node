import Resource from '../lib/resource.js'
import hostQueues from '../lib/queues.js'

// build a list of urls
const urls = Array.from(Array(5), function (item, index) {
  return 'https://peerj.com/articles/' + index
})

// fetch each resource
urls.forEach(function (url) {
  Resource(url).get('json').then(function (data) {
    console.log(data)
    updateQueueDescriptions()
  }, onError)
})

function onError (e) {
  console.error(e)
}

// logging

const queue = hostQueues.queues['peerj.com']

queue.drain = function () {
  console.log('The queue has been drained!')
}

function updateQueueDescriptions () {
  Object.keys(hostQueues.queues).forEach(function (key) {
    const queue = hostQueues.queues[key]
    console.log(key + ': ' + queue.length() + ' items in the queue')
  })
}
