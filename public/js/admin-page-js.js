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
        // var data = [["name1", "city1", "some other info"], ["name2", "city2", "more info"]];
        var csvContent = "data:text/csv;charset=utf-8," + "\n"
        csvContent += Object.keys(app.users[10]).join(",")
        app.users.forEach(function(user, index){
          dataString = Object.keys(user).map(function(k){return user[k]}).join(",")
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