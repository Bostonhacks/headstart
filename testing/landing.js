// require('dotenv').load()
const request = require('supertest')
const app = require('../app')

describe('Landing page', function () {
  it('should succeed', function (done) {
    request(app)
      .get('/')
      .expect(200, done)
  })
})
