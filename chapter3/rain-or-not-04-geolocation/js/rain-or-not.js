/*! rain-or-not - v0.1.0 - 2013-11-09
* Copyright (c) 2013 ; Licensed  */
;(function($){
  var app = this.app = this.app || {};

  app.model = {
    fetch: function(query, callback) {
      navigator.geolocation.getCurrentPosition(function(location) {
        var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + location.coords.latitude + '&lon=' + location.coords.longitude + '&callback=?';
        $.getJSON(url, function(data){
          var code = data.weather[0].id + ""; // force to string
          if (code[0] === '5') { // rainy code all start at 5
            callback('rain', data.name);
          } else {
            callback('sunny', data.name);
          }
        });
      });
    }
  }

}).call(this, jQuery);
;(function($){
  var app = this.app = this.app || {};

  app.view = {
    update: function(weather, place) {
      $('#place').html(place);
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

  app.model.fetch('Macao,MO', function(weather, place){
    app.view.update(weather, place);
  });

}).call(this);