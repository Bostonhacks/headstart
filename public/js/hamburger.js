$("#nav--burger").click(function(){
    if ($('#nav--burger').hasClass('is-active')) {
        $("#nav--burger").removeClass('is-active');
        $('.navLink').css("display", "none");
    } else {
        $("#nav--burger").addClass(" is-active");
        $('.navLink').css("display", "block");
    }
});