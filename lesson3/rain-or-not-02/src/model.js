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