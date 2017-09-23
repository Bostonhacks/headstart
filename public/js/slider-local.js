$(function() {
	var sliderId = ".slider-test" 
  $(sliderId).labeledslider({ max: 4, tickInterval: 1 });
   $(sliderId).labeledslider({
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
});