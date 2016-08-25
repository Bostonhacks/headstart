var newBorderWidth = "0 " + $(window).width() + "px 100px 0";
$('#faqTransition').css('border-width', newBorderWidth);

var width = $(window).width();
$(window).resize(function(){
   if($(this).width() != width){
      var newBorderWidth = "0 " + $(this).width() + "px 100px 0";
      $('#faqTransition').css('border-width', newBorderWidth);
   }
});