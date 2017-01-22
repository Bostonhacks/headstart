// Set the width initially
var newLeftBorderWidth = "0 " + $(window).width() + "px 100px 0";
var newRightBorderWidth = "0 0 100px " + $(window).width() + "px";

$('.faqTransitionLeft').css('border-width', newLeftBorderWidth);
$('.faqTransitionRight').css('border-width', newRightBorderWidth);


// Adjust width based off of window width
// There is probably a smarter way to do this, can explore later
var width = $(window).width();
$(window).resize(function(){
    if($(this).width() != width){
        var newLeftBorderWidth = "0 " + $(this).width() + "px 100px 0";
        var newRightBorderWidth = "0 0 100px " + $(this).width() + "px";

        $('.faqTransitionLeft').css('border-width', newLeftBorderWidth);
        $('.faqTransitionRight').css('border-width', newRightBorderWidth);
   }
});