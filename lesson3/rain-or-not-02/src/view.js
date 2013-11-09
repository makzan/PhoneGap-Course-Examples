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