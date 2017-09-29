$('input,textarea').focus(function(){
   $(this).data('placeholder',$(this).attr('placeholder'))
      .attr('placeholder','');
}).blur(function(){
    $(this).attr('placeholder',$(this).data('placeholder'));
});

function post(path, params, method) {
    method = method || 'post'; // Set method to post by default if not specified.

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    var form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', path);

    for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement('input');
            hiddenField.setAttribute('type', 'hidden');
            hiddenField.setAttribute('name', key);
            hiddenField.setAttribute('value', params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();
}

function login() {
    email = document.getElementById('emailInput').value;
    password = document.getElementById('passwordInput').value;
    post('/login', {email: email.toLowerCase(), password: password});
}

function signup() {
  email = document.getElementById('emailInput').value;
  password = document.getElementById('passwordInput').value;

  post('/signup', {email: email.toLowerCase(), password: password});
}

function reset() {
  email = document.getElementById('emailInput').value;

  post('/forgot-password', {email: email});
}

function change() {
  password = document.getElementById('passwordInput').value;

  post(window.location.pathname, {password: password});
}

function configureSettings(view, callback) {
    var settings = {
        pageTitle: '',
        submitFunction: '',
        pathname: '',
        buttonLabel: ''
    }

    // Only display server messages & password field relevant to the view you're on
    if (['login', 'signup'].includes(view)) {
        $('.loginSignupMessage').css('display', 'block');
        $('#passwordField').css('display', 'block');

        $('.forgotMessage').css('display', 'none');
    } else {
        $('.loginSignupMessage').css('display', 'none');
        $('#passwordField').css('display', 'none');

        $('.forgotMessage').css('display', 'block');
    }

    // April 10th: Adding this to make sure the message is only visible
    if (['login', 'forgot'].includes(view)) {
        $('#buRegistrationMessage').css('display', 'none');
    } else {
        $('#buRegistrationMessage').css('display', 'block');
    }

    switch (view) {
        case 'login':
            settings.pathname = '/login';
            settings.buttonLabel = 'Login';
            settings.submitFunction = 'login';
            settings.pageTitle = 'Login';
            $('#additionalOptions').html('<a id="signupRedirect"><h3 class="authLinkText clickableText">Need to make an Account?</h3></a><a id="forgotRedirect"><h3 class="authLinkText clickableText">Forgot Password?</h3></a>');
            break;
        case 'signup':
            settings.buRegistrationMessage = 'Note: Registration is now only open to BU students';

            settings.pathname = '/signup';
            settings.buttonLabel = 'Register';
            settings.submitFunction = 'signup';
            settings.pageTitle = 'Registration';
            $('#additionalOptions').html('<a id="loginRedirect"><h3 class="authLinkText clickableText">Have an Account?</h3></a>');
            break;
        case 'forgot':
            settings.pathname = '/forgot-password';
            settings.buttonLabel = 'Reset';
            settings.submitFunction = 'reset';
            settings.pageTitle = 'Forgot Password';
            $('#additionalOptions').html('<a id="loginRedirect"><h3 class="authLinkText clickableText">Back to Login</h3></a>');
    }

    callback(settings);
}

function configurePage(view) {
    // Aesthetics
    configureSettings(view, function(settings) {
        // Set URL pathname
        window.history.pushState('', '', settings.pathname);


        //Set bu registration message
        $('#buRegistrationMessage').text(settings.buRegistrationMessage);



        // Set title
        $('#loginThemeTitle').text(settings.pageTitle);

        // Set submit button label
        $('#submit').text(settings.buttonLabel);

        // Configure click functions
        $('#submit').click(function() {
            window[settings.submitFunction]();
        });

        $('#loginRedirect').click(function() {
            configurePage('login');
        });
        $('#signupRedirect').click(function() {
            configurePage('signup');
        });
        $('#forgotRedirect').click(function() {
            configurePage('forgot');
        });
    });
}

$(document).ready(function() {
    configurePage(initialView);
});







