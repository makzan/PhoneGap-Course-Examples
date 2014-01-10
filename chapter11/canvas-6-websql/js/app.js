var byPassPhoneGap = true; // debugging use

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

// DB Module
;(function(){
  var app = this.app || (this.app={});

  var DB = app.DB = (function(){
    function DB() {
      // init the database
      this.db = openDatabase("drawings", "1.0", "Drawing DB", 1024*1024*10);
      // create the table
      this.db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS entries (drawing text)');
      });
    }
    DB.prototype.insert = function(drawing)
    {
      // insert the entry into database
      this.db.transaction(function(tx){
        tx.executeSql('INSERT INTO entries(drawing) VALUES(?)', [drawing]);
      });
    };
    DB.prototype.query = function(callback)
    {
      // query the data from database
      this.db.transaction(function(tx){
        tx.executeSql('SELECT * FROM entries', [], function(tx, results){
          // convert the results SQL collection into normal Array
          var array = [];
          for (var i=0, len = results.rows.length; i < len; i++) {
            var entry = results.rows.item(i);
            array.push(entry.drawing);
          };
          // finally send the result to the callback.
          if (callback) callback(array);
        });
      });
    };
    return DB;
  })();
}).call(this);

// Model
// Anything related to data querying and manipulation
;(function($){
  var app = this.app || (this.app={});

    app.drawings = [];

    app.db = new app.DB();

    app.loadDrawingsFromDB = function(callback) {
      app.db.query(function(results){
        app.drawings = results;
        callback();
      });
    };

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

  var app = this.app;

  // Entry point
  $(function(){
    console.log("Hello New jQuery Mobile App.");

    $('#save-drawing').click(function(){
      var data = app.drawingPad.data();
      app.drawings.push(data);
      app.drawingPad.clear();
      app.view.renderDrawings(app.drawings);

      // save to DB
      app.db.insert(data);
    });

    // deviceready
    $(document).bind("deviceready", function(){
      app.loadDrawingsFromDB(function(){
        app.view.renderDrawings(app.drawings);
      });
    });

    if (byPassPhoneGap) {
      $(document).trigger('deviceready');
    }
  });

}).call(this, jQuery);

