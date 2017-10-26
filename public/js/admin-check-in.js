function httpGetAsync(theUrl, callback){
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.send(null);
}

var app; 

httpGetAsync('/admin-all-registrants', function(result) {
  // get the JSON for all the users
  var allUsers = JSON.parse(result)
  // set the "checkedIn" to be false for users without that property
  // this is because the field was added to the data model later.
  for(var u = 0; u < allUsers.length; u++) {
    if (allUsers[u].checkedIn == undefined) allUsers[u].checkedIn = false
  }
  app = new Vue({
    el: '#app',
    data: {
      users: allUsers,
      checkInCount: allUsers.filter(u => u.checkedIn).length
    },
    methods: {
      checkIn: function(userid) {
        console.log("Check in user " + userid)
        httpGetAsync("/checkUserIn/" + userid, function(responseText) { 
          app.users.forEach(u => {
            if (u._id == userid) {
              u.checkedIn = true
              u.checkInDate = (new Date()).toString()
              app.checkInCount += 1
            }
          })
        })
      },
      unCheckIn: function(userid) {
        var doCheckout = confirm("Do you want to check out that user?")
        if (doCheckout){
          console.log("Check out user " + userid)
          httpGetAsync("/unCheckUserIn/" + userid, function(responseText) {
            app.users.forEach(u => {
              if (u._id == userid) {
                u.checkedIn = false
                app.checkInCount -= 1
              }
            })
          })
        }
      }
    }
  })
})
