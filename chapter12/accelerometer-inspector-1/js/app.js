// patching the touch and click event.
if (window.Touch) {
  $('a').bind('touchstart', function(e) {
    e.preventDefault();
  });
  $('a').bind('touchend', function(e) {
    e.preventDefault();
    return $(this).trigger('click');
  });
}

// Model
// Anything related to data querying and manipulation
;(function($){
  var app = this.app || (this.app={});

  app.xValues = [];
  app.yValues = [];
  app.zValues = [];

}).call(this, jQuery);

// View
// Anything that belongs to interface.
;(function($){
  var app = this.app || (this.app={});

  app.view = {}
  app.view.update = function(){
    this.renderHistory($('#x'), app.xValues);
    this.renderHistory($('#y'), app.yValues);
    this.renderHistory($('#z'), app.zValues);
  }

  app.view.renderHistory = function(element, data) {
    $(element).empty();
    for (var i = app.xValues.length - 1; i >= 0; i--) {
      $(element).append("<li>" + Math.floor(data[i]*1000) + "</li>");
    };
  }

}).call(this, jQuery);

// Controller Logic
// Glue the model and view together
;(function($){

  // Entry point
  $(function(){

    window.addEventListener('devicemotion', function (e) {
      app.xValues.push(e.acceleration.x);
      app.yValues.push(e.acceleration.y);
      app.zValues.push(e.acceleration.z);

      var listLimit = 15;
      if (app.xValues.length > listLimit) {
        app.xValues.splice(0, 1); // remove the old records when list too long.
      }
      if (app.yValues.length > listLimit) {
        app.yValues.splice(0, 1); // remove the old records when list too long.
      }
      if (app.zValues.length > listLimit) {
        app.zValues.splice(0, 1); // remove the old records when list too long.
      }

      app.view.update();
    });

  });

}).call(this, jQuery);

