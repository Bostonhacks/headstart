function travelReimbursementCheck() {
    if (document.getElementById('reimbursementYes').checked) {
        document.getElementById('reimbursement-followup-questions').style.display = 'block';
    } else {
        document.getElementById('reimbursement-followup-questions').style.display = 'none';
    }
}

$('.team-radio').click(function() {
	// get value of team
	var hasTeam = $('.team-radio:checked').val();

	if(hasTeam == 'true') {
		$('.teammates').slideDown('slow');
	} else {
		
		$('.hasNoTeam').slideDown('slow');
	}
})

$('.teammates-radio').click(function() {
	var lookingForTeammates = $('..teammates-radio:checked').val();
	if(lookingForTeammates) {
		$("#registrationButton").html("Next");
		$("#registrationButton").attr("href", "/registrationFormPartTwo");	
	}	
})



