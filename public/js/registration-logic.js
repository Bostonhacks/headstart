$().ready(function() {

  $('.team-radio').click(function() {
    // get value of team
    var hasTeam = $('.team-radio:checked').val();
    $("#registrationButton").html("Finish");
    $("#registrationButton").attr("href", "/finishRegistration");
    if (hasTeam == 'true') {
      $('.teammates').slideDown("slow");
      $('.existing-team').slideUp("slow");
      $('.create-team').slideUp("slow");
    } else {
      $('.existing-team').slideDown("slow");
      $('.teammates').slideUp("slow");
    }
  });

  $('.teammates-radio').click(function() {
    var lookingForTeammates = $('.teammates-radio:checked').val();
    if (lookingForTeammates == 'true') {
      $("#registrationButton").html("Find New Teammates");
      $("#registrationButton").attr("href", "/findNewTeammates");
    } else {
      var hasTeam = $('.team-radio:checked').val();
      if (hasTeam == 'true') {
        $('.create-team').slideUp("slow");
        $("#registrationButton").html("Finish");
        $("#registrationButton").attr("href", "/finishRegistration");
      } else {
        $('.create-team').slideDown("slow");
      }
    }
  });

  $('.existing-team-radio').click(function() {
    var joinExistingTeam = $('.existing-team-radio:checked').val();
    if (joinExistingTeam == 'true') {
      $("#registrationButton").html("Join Existing Team");
      $("#registrationButton").attr("href", "/joinExistingTeam");
      $('.create-team').slideUp("slow");
    } else {
      $("#registrationButton").html("Finish");
      $("#registrationButton").attr("href", "/finishRegistration");
      $('.create-team').slideDown("slow");
    }
  });

  $('.create-team-radio').click(function() {
    var wantToCreateMyOwnTeam = $('.create-team-radio:checked').val();
    if (wantToCreateMyOwnTeam == 'true') {
      $("#registrationButton").html("Create New Team");
      $("#registrationButton").attr("href", "/createNewTeam");
    } else {
      $("#registrationButton").html("Finish");
      $("#registrationButton").attr("href", "/finishRegistration");
    }
  });
});