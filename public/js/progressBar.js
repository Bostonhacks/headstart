function resizeProgressLinks() {
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    $('.progressLink').remove();
  } else {
    if($('#progressBar').width() < 1000) {
      $('.progressLink').width($('#progressBar').width()/20);
      //$('#progressBar').width()/10);
    } else {
      $('.progressLink').width(100);
    }
  }
}

// do this initially
resizeProgressLinks();

var width = $(window).width();
$(window).resize(function(){
  resizeProgressLinks();
});

// To dectect scrolling!

var sections = [["home", 0], ["schedule", 500], ["faq", 1200], ["apply", 2000], ["sponsors", 3000], ["contact", 3000]];

$(window).scroll(function() {
    var height = $(window).scrollTop();

    for (i = 0; i < sections.length; i++) {
      if(height  >= sections[i][1]) {
        $('#' + sections[i][0] + 'ProgressCircle').css('background', "#EF6262");
        $('#' + sections[i][0] + 'ProgressLink').css('background-position', "left");
      } else {
        $('#' + sections[i][0] + 'ProgressCircle').css('background', "transparent"); 
        $('#' + sections[i][0] + 'ProgressLink').css('background-position', "right");
      }
    }

});


    // This is the maximum amount of page scroll
    // $(document).height() - $(window).height()
