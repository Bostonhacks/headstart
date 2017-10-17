/* README
 * To run tests
 * 1) "npm install" - get the dependencies for unit testing
 * 2) "npm start" - get the app running
 * 2) "npm test" - run tests in another terminal
 */

 /* A few unit test libraries */

 let chai = require('chai')
 let supertest = require("supertest");
 let should = require("should");

 /* some necessary variables */

 require('dotenv').load()
 let port = process.env.PORT || '5000'
 let server = supertest.agent("http://localhost:" + port);

 /* Actual unit test code */

 describe('General', function() {
  describe('Website Pages', function() {
    it('"/random" should return 404', function(done){
      server.get('/random').expect(404).then(function() {
        done()
      })
    })
    it('"/" should redirect to "/signup"', function(done) {
      server.get("/").expect(302).then(function() {
        done()
      })
    })
    it('"/signup" should return 200', function(done) {
      server.get("/signup").expect(200).then(function() {
        done()
      })
    })
  })
  describe('User Management', function() {
    it("placeholder", function(done) {
      done()
    })
  })
  describe('Admin Features', function() {
    it("placeholder", function(done) {
      done()
    })
  })
})

// NOTE: all of these tests need to be authenticated with a user
// and need to return 200, not 302 (a redirect)
// describe('Team Formation', function() {
//   describe('Pages appear', function() {
//     it('team-formation page is up', function(done){
//       server.get('/team-formation').expect(302).then(function() {
//         done()
//       })
//     })
//     it('create new team page is up', function(done) {
//       server.get("/create-new-team").expect(302).then(function() {
//         done()
//       })
//     })
//     it('find teammates page is up', function(done) {
//       server.get("/find-new-teammates").expect(302).then(function() {
//         done()
//       })
//     })
//     it('join existing team page is up', function(done) {
//       server.get("/join-existing-team").expect(302).then(function() {
//         done()
//       })
//     })
//   })
// })
