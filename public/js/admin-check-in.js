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
  app = new Vue({
    el: '#app',
    data: {
      users: JSON.parse(result).map(u => {
        if (u.checkedIn == undefined) u.checkedIn = false
        else if (typeof u.checkedIn == "string") u.checkedIn = (new Date(u.checkedIn)).toString()
        return u
      }),
      acceptedNum: JSON.parse(result).filter(function(u){ return u.checkedIn }).length
    },
    methods: {
      checkIn: function(userid) {
        console.log("Check in user " + userid)
        httpGetAsync("/checkUserIn/" + userid, function(responseText) { })
        app.users.forEach(u => {
          if (u._id == userid) u.checkedIn = (new Date()).toString()
        })
      },
      unCheckIn: function(userid) {
        var doCheckout = confirm("Do you want to check out that user?")
        if (doCheckout){
          console.log("Check out user " + userid)
          httpGetAsync("/unCheckUserIn/" + userid, function(responseText) {
            app.users.forEach(u => {
              if (u._id == userid) u.checkedIn = false
            })
          })
        }
      }
    }
  })
})
