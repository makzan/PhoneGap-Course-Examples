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

    app.drawings = [];

}).call(this, jQuery);

// View
// Anything that belongs to interface.
;(function($){
  var app = this.app || (this.app={});

  app.view = {}

  app.view.drawingsList = $('#drawings-list');
  app.view.renderDrawings = function(drawings) {
    this.drawingsList.empty();
    for (var i = drawings.length-1; i>=0; i--) {
      var drawing = drawings[i];
      var img = $("<img />");
      img.attr('src', drawing);
      this.drawingsList.append(img);
    };
  }

}).call(this, jQuery);


// Canvas Drawing Pad
;(function($){
  var app = this.app || (this.app={});

  var canvas = $('canvas');

  var drawingPad = app.drawingPad = {
    context: canvas[0].getContext('2d'),
    drawLine: function(x1, y1, x2, y2, thickness, strokeStyle) {
      this.context.beginPath();
      this.context.moveTo(x1,y1);
      this.context.lineTo(x2,y2);
      this.context.lineWidth = thickness || 1;
      this.context.strokeStyle = strokeStyle || "#222";
      this.context.stroke();
    },
    clear: function() {
      canvas[0].width = canvas[0].width;
    },
    data: function() {
      return canvas[0].toDataURL();
    }
  };

  // interaction
  (function(){
    var isDrawing = false;
    var startX = startY = 0;

    // Pen Down
    canvas.bind('touchstart mousedown', function(e){
      isDrawing = true;
      if (e.originalEvent.touches) { // touch device
        var mouseX = e.originalEvent.touches[0].pageX - canvas.offset().left;
        var mouseY = e.originalEvent.touches[0].pageY - canvas.offset().top;
      } else { // mouse device
        var mouseX = e.pageX - canvas.offset().left;
        var mouseY = e.pageY - canvas.offset().top;
      }
      startX = mouseX;
      startY = mouseY;
    });

    // Pen Move
    canvas.bind('touchmove mousemove', function(e){
      if (isDrawing)
      {
        if (e.originalEvent.touches) { // touch device
          var mouseX = e.originalEvent.touches[0].pageX - canvas.offset().left;
          var mouseY = e.originalEvent.touches[0].pageY - canvas.offset().top;
        } else { // mouse device
          var mouseX = e.pageX - canvas.offset().left;
          var mouseY = e.pageY - canvas.offset().top;
        }
        drawingPad.drawLine(startX, startY, mouseX, mouseY, 3);
        drawingPad.drawLine(320-startX, startY, 320-mouseX, mouseY, 3);
        drawingPad.drawLine(startX, 320-startY, mouseX, 320-mouseY, 3);
        drawingPad.drawLine(320-startX, 320-startY, 320-mouseX, 320-mouseY, 3);
        startX = mouseX;
        startY = mouseY;
      }
    });

    // Pen Up
    canvas.bind('touchend mouseup', function(e) {
      isDrawing = false;
    });
  })();

}).call(this, jQuery);

// Controller Logic
// Glue the model and view together
;(function($){

  // Entry point
  $(function(){
    console.log("Hello New jQuery Mobile App.");

    $('#save-drawing').click(function(){
      app.drawings.push(app.drawingPad.data());
      app.drawingPad.clear();
      app.view.renderDrawings(app.drawings);
    });
  });

}).call(this, jQuery);

