
// To detect width change

// var width = $(window).width();
// $(window).resize(function(){
//    // if($(this).width() != width){
//    //    width = $(this).width();
//    //     // console.log(width);
//    // }
// });

// To dectect scrolling!

var sections = [["home", 0], ["schedule", 500], ["faq", 1200], ["apply", 2000], ["sponsors", 3000], ["contact", 3000]];

$(window).scroll(function() {
    var height = $(window).scrollTop();

    for (i = 0; i < sections.length; i++) {
      if(height  >= sections[i][1]) {
        $('.' + sections[i][0] + 'ProgressCircle').css('background', "#EF6262");
        $('.' + sections[i][0] + 'ProgressLink').css('background-position', "left");
      } else {
        $('.' + sections[i][0] + 'ProgressCircle').css('background', "transparent"); 
        $('.' + sections[i][0] + 'ProgressLink').css('background-position', "right");
      }
    }

});


    // This is the maximum amount of page scroll
    // $(document).height() - $(window).height()
