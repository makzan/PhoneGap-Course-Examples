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

    // init the timer value
    $('#timer').html('25:00');


  });

}).call(this); // end of the app module


