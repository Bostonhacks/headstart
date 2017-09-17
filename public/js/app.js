$(document).foundation()

$( document ).ready(function() {
  
  $('#mailchimp-signup').hide();
  
});

whatIsTrigger = false;

function clickWhatIsHackathon() {
  if (whatIsTrigger) {
    //turn off
    $('#about').css("background-color","#EADFD8");
    $('#aboutHeader').fadeOut(200);
    $('#aboutText').fadeOut(200);
    $('#what-is-question').fadeOut(200);
    
    setTimeout(function(){
      $('#aboutHeader').html("Welcome to Boston");
      $('#aboutText').html("BostonHacks is Boston University's annual hackathon. 400 students will come from all around North America to form teams around creating an awesome project in 24 hours. Along the way they'll learn about how to use new technologies and will build their experience as developers.<br><br>Come join us for a weekend full of workshops and learning, paired with halloween themed side events and fun.");
      $('#what-is-question').html('What is a Hackathon? &nbsp;<i class="fa fa-caret-right" aria-hidden="true"></i>');
      $('#aboutHeader').css("color","#4A4B4E");
      $('#aboutText').css("color","#4A4B4E");
    },200);
    
    $('#aboutHeader').fadeIn(200);
    $('#aboutText').fadeIn(200);
    $('#what-is-question').fadeIn(200);
    
    whatIsTrigger = false;
  }else{
    //turn on
    $('#about').css("background-color","#F58549");
    $('#aboutHeader').fadeOut(200);
    $('#aboutText').fadeOut(200);
    $('#what-is-question').fadeOut(200);
    
    setTimeout(function(){
      $('#aboutHeader').html("What is a Hackathon?");
      $('#aboutText').html("Hackathons are invention competitions that foster an environment for innovation and learning. College students from all levels of experience attend hackathons around the world that generally span a weekend. Students forms teams with others they've often never met before, and in 24 hours create a project that addresses a real-world problem they've identified.");
      $('#what-is-question').html('<i class="fa fa-times fa-2x" style="font-size: 1.7em !important;" aria-hidden="true"></i>');
      $('#aboutHeader').css("color","#F9F5EF");
      $('#aboutText').css("color","#F9F5EF");
    },200);
    
    $('#aboutHeader').fadeIn(200);
    $('#aboutText').fadeIn(200);
    $('#what-is-question').fadeIn(200);
    
    whatIsTrigger = true;
  }
}

var showSignup = function() {
  $('#mailchimp-signup').show();
  $('html, body').animate({
    scrollTop: $("#mailchimp-signup").offset().top - 400
  }, 500);
} 