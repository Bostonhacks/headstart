$(function() {
  $('.experience-slider').labeledslider({
    min: 0,
    max: 3,
    tickArray: [0, 1, 2, 3],
    tickLabels: {
      0: 'No experience',
      1: 'Some experience',
      2: 'Completed one project/course',
      3: 'Completed multiple projects/courses',
    }
  });


  $('.rate-slider').labeledslider({min: 1, max: 5, tickInterval: 1, tickArray: [1, 2, 3, 4, 5] });
});