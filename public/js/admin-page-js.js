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
      users: JSON.parse(result),
      acceptedNum: JSON.parse(result).filter(function(u){ return u.status=="Accepted" }).length
    },
    methods: {
      changeStatus: function(userid, stat) {
        console.log("Set user " + userid + " to " + stat)
        httpGetAsync("/changeStatus/" + userid + "/" + stat, function(responseText) {
          for (i = 0; i < app.users.length; i++){
            if (app.users[i]._id == userid) app.users[i].status = stat
          }
      })
      },
      sortUsers: function(param) {
        if (param == "school") {
          app.users.sort(function(a,b) {
            if (a.school != undefined && b.school != undefined){
              return (a.school.name > b.school.name) ? 1 : ((b.school.name > a.school.name) ? -1 : 0);
            } else {
              return 1
            }
          }) 
        } else {
          app.users.sort(function(a,b) {
            return (a[param] > b[param]) ? 1 : ((b[param] > a[param]) ? -1 : 0);
          }) 
        }
      },
      notify: function() {
        alert("Notifications don't work yet!")
      },
      getCSV: function() {
        var csvContent = "data:text/csv;charset=utf-8," + "\n"
        var keys = ["_id", "__v", "email", "first_name", "last_name", "major", "shirt_size", 
          "dietary_restrictions", "special_needs", "date_of_birth", "gender", 
          "phone_number", "level_of_study", "firstHackathon", "reimbursementSeeking", 
          "reimbursementLocation", "reimbursementAmount", "dataSharingAgreed", 
          "status", "dateRegistered", "school", "local"]
        var header = keys.join(",").
          replace("school","school.id,school.name").
          replace("local","local.email,local.password,local.registered")
        csvContent += header + "\n"
        // used for escaping commas in user input
        var esc = (str) => '"' + str + '"'
        app.users.forEach(function(user){
          var dataString = ""
          for (var i = 0; i < keys.length; i++) {
            var k = keys[i]
            if (k == 'local') {
              if (user[k])
                dataString += user[k].email + "," + user[k].password + "," + user[k].registered + ","
              else 
                dataString += "None,None,None,"
            } 
            else if (k == 'school') {
              if (user[k])
                dataString += user[k].id + "," + esc(user[k].name) + ","
              else
                dataString += "None,None,"
            } 
            else {
              if (user[k])
                dataString += esc(user[k]) + ","
              else
                dataString += "None,"
            }
          }
          csvContent += dataString + "\n"
        })
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "bostonhacks_userdata.csv");
            document.body.appendChild(link); // Required for FF
            link.click(); // This will download the data file named "my_data.csv".  
          }
        }
      })
})
