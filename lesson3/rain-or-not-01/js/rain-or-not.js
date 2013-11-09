/*! rain-or-not - v0.1.0 - 2013-11-08
* Copyright (c) 2013 ; Licensed  */
;(function($){
  $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=Macao,MO&callback=?', function(data){
    console.log(data);
    var code = data.weather[0].id + ""; // force to string
    if (code[0] == 5) { // rainy code all start at 5
      $('#rain-content').removeClass().addClass('rain');
    } else {
      $('#rain-content').removeClass().addClass('sunny');
    }
  });
}).call(this, jQuery);