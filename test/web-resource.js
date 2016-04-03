var chai = require('chai')
chai.use(require('chai-as-promised'))
var expect = chai.expect

var Resource = require('../index.js')

describe('Resource', function () {
  it('should return a promise when get is called', function () {
    expect(Resource('https://www.example.com/').get()).to.be.a('promise')
  })

  //it('should return json when fetched', function (done) {
  //  expect(Resource('https://peerj.com/articles/1').get()).to.eventually.deep.equal({}).notify(done)
  //})
})
