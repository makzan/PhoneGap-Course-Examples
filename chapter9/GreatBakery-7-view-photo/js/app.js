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
            var listItem = "<li><a data-news-id='" + i + "' href='#news-content'>" + news.title + "</a></li>";
            $(element).append(listItem);
          }
          $(element).listview().listview('refresh');
        },
      });
    };
    return News;
  }).call(this); // End News

  // Facebook Page Photo Module
  app.FacebookPhotos = (function(){
    function FacebookPhotos(){
      this.photos = [];
    }
    FacebookPhotos.prototype.fetch = function(element){
      var that = this;
      var url = 'http://graph.facebook.com/663338843678077/photos' + '?callback=?';
      $.getJSON(url, function(data) {
        that.photos = data;
        console.log('from fb: ', data);
        $(element).empty();
        for(var i=0, len=data.data.length; i<len; i++)
        {
          var image = data.data[i];
          $(element).append("<a href='#photo-view' data-photo-id='" + i + "'><div class='photo' style='background-image:url( " + image.picture + ")'></div></a>");
        }
      });
    };
    return FacebookPhotos;
  }).call(this); // End Facebook

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
  var fbPhotos = new app.FacebookPhotos();

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
      else if ( $(event.target).attr('id') === 'gallery' ) {
        fbPhotos.fetch($('#photos'));
      }
    });


    // News view
    $('#news-list').delegate('a[href="#news-content"]', 'click', function(event){
      var newsId = $(this).data('newsId');

      console.log ("news id:", newsId);
      // load the news.
      // cache the content element.
      var contentElement = $('#news-content').find('[data-role="content"]');
      var newsData = news.data[newsId];
      if (newsData === undefined)
      {
        contentElement.html('Error loading news content.');
      }
      else {
          var newsText = "<h2>" + newsData.title + "</h2>";
          newsText    += "<strong>" + newsData.date + "</strong>";
          newsText    += "<small> (" + moment(newsData.date, 'YYYY-MM-DD hh:mm:ss').fromNow() + ") </small>";
          if (newsData.image != undefined) {
            newsText  += "<p><img src='" + newsData.image + "'></p>";
          }
          newsText    += "<p>" + newsData.content + "</p>";
          contentElement.html(newsText);
      }
    }); // End News view

    // Photo view
    $('#photos').delegate('a[href="#photo-view"]', 'click', function(event){
      var photoId = $(this).data('photoId');

      console.log ("id:", photoId);
      var contentElement = $('#photo');
      var photoData = fbPhotos.photos.data[photoId];
      if (photoData === undefined)
      {
        contentElement.html('Error loading photo.');
      }
      else {
          var text = "<img src='" + photoData.images[2].source + "' alt='photo' class='big-photo'>";

          contentElement.html(text);
      }
    }); // End Photo view




  });

}).call(this, jQuery);

