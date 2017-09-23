$(function() {
	var sliderId = ".slider-test" 
  $(sliderId).labeledslider({ max: 6, tickInterval: 1 });

  $('#min').val(0).spinner({
    min: 0,
    max: 5,
    spin: function(e, ui) {
      $(sliderId).labeledslider('option', 'min', ui.value);
    }
  });

  $('#max').val(6).spinner({
    min: 6,
    max: 20,
    spin: function(e, ui) {
      $(sliderId).labeledslider('option', 'max', ui.value);
    }
  });

  $('#step').val(1).spinner({
    min: 1,
    max: 3,
    spin: function(e, ui) {
      $(sliderId).labeledslider('option', 'step', ui.value);
    }
  });

  $('#ticks').val(1).spinner({
    min: 1,
    max: 3,
    spin: function(e, ui) {
      $(sliderId).labeledslider('option', 'tickInterval', ui.value);
    }
  });

  $('#labels').attr('checked', false).on('click', function() {
    var t = $(this).is(':checked'),
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    labels = labels.concat(labels).concat(labels);

    if (t) {
      $(sliderId).labeledslider('option', 'tickLabels', labels);
    } else {
      $(sliderId).labeledslider('option', 'tickLabels', null);
    }
  });
});