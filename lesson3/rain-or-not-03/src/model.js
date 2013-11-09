;(function($){
  var app = this.app = this.app || {};

  app.model = {
    fetch: function(query, callback) {
      $.getJSON('http://api.openweathermap.org/data/2.5/weather?q=' + query + '&callback=?', function(data){
        var code = data.weather[0].id + ""; // force to string
        if (code[0] == 5) { // rainy code all start at 5
          callback('rain');
        } else {
          callback('sunny');
        }
      });
    }
  }

}).call(this, jQuery);