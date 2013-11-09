/*! rain-or-not - v0.1.0 - 2013-11-08
* Copyright (c) 2013 ; Licensed  */
;(function($){
  var app = this.app = this.app || {};

  app.model = {
    fetch: function(query, callback) {
      $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + query + '&callback=?', function(data){
        callback(data);
      });
    }
  }

}).call(this, jQuery);
;(function($){
  var app = this.app = this.app || {};

  app.view = {
    update: function(weather) {
      if (weather == 'rain') {
        $('#rain-content').removeClass().addClass('rain');
      } else {
        $('#rain-content').removeClass().addClass('sunny');
      }
    }
  }

}).call(this, jQuery);
;(function(){
  var app = this.app = this.app || {};

  app.model.fetch('Macao,MO', function(data){
    console.log(data);
    var code = data.weather[0].id + ""; // force to string
    if (code[0] == 5) { // rainy code all start at 5
      app.view.update('rain');
    } else {
      app.view.update('sunny');
    }
  });

}).call(this);