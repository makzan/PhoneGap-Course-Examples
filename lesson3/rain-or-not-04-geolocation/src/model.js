;(function($){
  var app = this.app = this.app || {};

  app.model = {
    fetch: function(query, callback) {
      navigator.geolocation.getCurrentPosition(function(location) {
        var url = 'http://api.openweathermap.org/data/2.5/weather?lat=' + location.coords.latitude + '&lon=' + location.coords.longitude + '&callback=?';
        $.getJSON(url, function(data){
          var code = data.weather[0].id + ""; // force to string
          if (code[0] == 5) { // rainy code all start at 5
            callback('rain', data.name);
          } else {
            callback('sunny', data.name);
          }
        });
      });
    }
  }

}).call(this, jQuery);