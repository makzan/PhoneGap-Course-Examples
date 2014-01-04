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

  // News Module
  app.News = (function(){
    function News() {
      this.data = [];
    }
    News.prototype.fetch = function(element) {
      var that = this;
      $.ajax({
        url: "http://makzan-temp.s3.amazonaws.com/news.json",
        type: "GET",
        crossDomain: true,
        dataType: "jsonp",
        jsonpCallback: 'callback',
        success: function (data) {
          console.log("ajax success", data);
          that.data = data.news;
          $(element).empty();
          for (var i=0, len=data.news.length; i<len; i++)
          {
            var news = data.news[i];
            var listItem = "<li><a href='#news-content'>" + news.title + "</a></li>";
            $(element).append(listItem);
          }
          $(element).listview().listview('refresh');
        },
      });
    };
    return News;
  }).call(this); // End News

}).call(this, jQuery);

// View
// Anything that belongs to interface.
;(function($){
  var app = this.app || (this.app={});

  app.view = {}

}).call(this, jQuery);

// Controller Logic
// Glue the model and view together
;(function($){
  var news = new app.News();

  // Entry point
  $(function(){
    $.mobile.defaultPageTransition = 'slide';

    $(document).bind('pageshow', function(event, ui) {
      if ( $(event.target).attr('id') === 'map' ) {
        $('#map-element').gmap('addMarker', {'position': '22.191572,113.541553', 'bounds': true})
      }
    });

    $(document).bind('pagebeforeshow', function(event, ui) {
      if ( $(event.target).attr('id') === 'news' ) {
        news.fetch($('#news-list'));
      }
    });






  });

}).call(this, jQuery);

