// the ticker module
(function() {

  // declare a global variable 'tf' (short form of twenty five)
  var tf = this.tf = {}

  // a ticker is used to create global timeInterval tickers.
  tf.ticker = {};

  // prepare a list for listeners which are interested to the global timer
  tf.ticker.tickListeners = [];

  // a method to add the listener to the list
  tf.ticker.addListener = function (listener) {
    tf.ticker.tickListeners.push(listener);
  }

  // a method to remove listener from the list
  tf.ticker.removeListener = function (target) {    
    // loop to find the target in the array    
    for (var i=0, len= tf.ticker.tickListeners.length; i < len; i++)
    {
      if (tf.ticker.tickListeners[i] == target) {
        tf.ticker.tickListeners.splice(i, 1); // remove that found target from the array
      }
    }
  }

  tf.ticker.tick = function() {
    for (var i=0, len= tf.ticker.tickListeners.length; i < len; i++)
    {
      if (tf.ticker.tickListeners[i].tick != undefined)
      {
        tf.ticker.tickListeners[i].tick(); // call the tick function on each listener.
      } else {
        console.log("TickListener instance should expose a method named 'tick'");
      }
    }
  }

  tf.globalInterval = setInterval(tf.ticker.tick, 1000); // finally start the ticker, every second.

}).call(this); // end of ticker module


// The TwentyFive countdown module
(function() {

  var TwentyFiveTimer = (function() {
    function TwentyFiveTimer(element) {
      this.counter = 0; // the counting variable

      this.element = element; // the element to show timer result

      this.reset();
    }

    TwentyFiveTimer.prototype.reset = function() {
      tf.ticker.removeListener(this); // remove self instance from the ticker list.

      this.counter = 60 * 25; // 25 minutes;

      $(this.element).html("25:00");
    }

    // the tick function, core logic of the app
    TwentyFiveTimer.prototype.tick = function() {
      this.counter--; // the real counting down.

      if (this.counter < 0) 
      {
        this.counter = 0; // dont forget to set the boundary.
      
        // call the dialog when the counter reaches 0
        $.mobile.changePage("#finish");
        
        this.stop();
      }

      // the minute
      var minute = Math.floor( this.counter / 60 );
      if (minute < 10) minute = '0' + minute;

      // the second
      var second = this.counter % 60;
      if (second < 10) second = '0' + second;

      // display it, finally.
      $(this.element).html(minute + ":" + second);
    }
    
    TwentyFiveTimer.prototype.start = function() {
      tf.ticker.addListener(this); // add self instance to the ticker list, so we will get tick invoked.      
    }
    
    TwentyFiveTimer.prototype.stop = function() {
      tf.ticker.removeListener(this);
    }

    TwentyFiveTimer.prototype.restart = function () {
      this.reset();
      this.start();
    }

    // finish the class implementation, at last we return it to the outter scope.
    return TwentyFiveTimer;

  })();

  // and set it to our global scope to let other module to use it.
  tf.TwentyFiveTimer = TwentyFiveTimer;

}).call(this);


// The app module
(function() {

  
  // jQuery ready callback
  $(function() {
    // disable the default mobile safari long tap behavior on elements
    document.documentElement.style.webkitTouchCallout = 'none'

    // default page transition
    $.mobile.defaultPageTransition = 'slide'

    // make the button reacts faster
    $.mobile.buttonMarkup.hoverDelay = 0

    $('#timer').html('25:00');

    var timer = new tf.TwentyFiveTimer($('#timer'));    
    timer.start();

    // handle the reset button
    $('#reset').click( function(e){
      timer.restart();
    });

  });

}).call(this); // end of the app module


