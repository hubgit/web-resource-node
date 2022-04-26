/* global describe, it */

import chai from 'chai'
import cap from 'chai-as-promised'

import Resource from '../lib/resource.js'

chai.use(cap)
const expect = chai.expect

describe('Resource', function () {
  it('should return a promise when get is called', function () {
    expect(Resource('https://www.example.com/').get()).to.be.a('promise')
  })

  // it('should return json when fetched', function (done) {
  //   expect(Resource('https://peerj.com/articles/1').get()).to.eventually.deep.equal({}).notify(done)
  // })
})
