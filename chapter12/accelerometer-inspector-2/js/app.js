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

// Graph
;(function(){
  var app = this.app || (this.app={});

  // A bar chart for - Max Value to + Max Value.
  app.Graph = (function(){
    function Graph(canvasId, maxValue){
      this.canvas = document.getElementById(canvasId);
      if (this.canvas) {
        this.context = this.canvas.getContext('2d');
      }

      // set the Y unit scale.
      this.unit = this.canvas.height / 2 / maxValue; // divide by 2 because half for + and half for -.
    }
    Graph.prototype.drawBar = function(x, value) {
      var c = this.context;
      c.beginPath();
      c.moveTo(x, this.canvas.height/2); // middle
      c.lineTo(x, this.canvas.height/2 - value * this.unit);
      c.lineWidth = 3;
      c.strokeStyle = "#222";
      c.stroke();
      c.closePath();
    };
    Graph.prototype.render = function(dataArray) {
      this.canvas.width = this.canvas.width;
      for (var i=0, len=dataArray.length; i<len; i++) {
        this.drawBar(i*5, dataArray[i]);
      }
    }
    return Graph;
  })();
}).call(this);

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
      $(element).append("<li>" + Math.floor(data[i]*100)/100 + "</li>");
    };
  }

}).call(this, jQuery);

// Controller Logic
// Glue the model and view together
;(function($){

  // Entry point
  $(function(){

    var graphX = new app.Graph('x-canvas', 2.5);
    var graphY = new app.Graph('y-canvas', 2.5);
    var graphZ = new app.Graph('z-canvas', 2.5);

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
      graphX.render(app.xValues);
      graphY.render(app.yValues);
      graphZ.render(app.zValues);
    });

  });

}).call(this, jQuery);

