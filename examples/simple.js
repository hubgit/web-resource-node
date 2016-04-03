const Resource = require('../index.js')

Resource('https://peerj.com/articles/1').get('json').then(function (data) {
  console.log(data)
})
