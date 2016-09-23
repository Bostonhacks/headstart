$('input,textarea').focus(function(){
   $(this).data('placeholder',$(this).attr('placeholder'))
      .attr('placeholder','');
}).blur(function(){
    $(this).attr('placeholder',$(this).data('placeholder'));
});

function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function login() {
    email = document.getElementById('emailInput').value;
    password = document.getElementById('passwordInput').value;
    post('/login', {email: email, password: password});
}

function signup() {
  email = document.getElementById('emailInput').value;
  password = document.getElementById('passwordInput').value;

  post('/signup', {email: email, password: password});
}

function reset() {
  email = document.getElementById('emailInput').value;

  post('/forgot-password', {email: email});
}