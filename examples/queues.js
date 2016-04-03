const Resource = require('../index.js')
const hostQueues = require('../host-queues')

// build a list of urls

var urls = Array.from([1, 2, 3, 4, 5], i => 'https://peerj.com/articles/' + i)

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

var queue = hostQueues.queues['peerj.com']

queue.drain = function () {
  console.log('The queue has been drained!')
}

function updateQueueDescriptions () {
  Object.keys(hostQueues.queues).forEach(function (key) {
    var queue = hostQueues.queues[key]
    console.log(key + ': ' + queue.length() + ' items in the queue')
  })
}
