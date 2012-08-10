(function(){  

  // jQuery Ready
  $(function(){

    // default transition: slide
    $.mobile.defaultPageTransition = 'slide';

    // append footer to each page
    $("[data-role='page']").each(function() {    
      var footer = $(".footer-template").html();
      $(this).append(footer);  


      // footer active state
      var target = 'footer .first-page a';
      if ($(this).attr('id') === 'twitter') {
        target = 'footer .second-page a';
      } else if ($(this).attr('id') === 'about' || $(this).attr('id') === 'map-page') {
        target = 'footer .third-page a';
      }

      $(this).find(target).addClass('ui-state-persist').addClass('ui-btn-active');      

    });

    // listen to the pageBeforeShow event
    $(document).bind('pagebeforeshow', function(event, ui) {  
      switch ($(event.target).attr('id')) {
        case 'main':
          (new greatLtd.News()).fetch($('#news-list'));
          break;
        case 'twitter':
          var twitter = new greatLtd.TwitterQuery("Great Limited");
          twitter.fetch($("#tweet-list"));
          break;
        case 'map-page':
          $('#map').gmap('addMarker', {
            'position': '22.192362,113.54206',
            'bounds': true
          });
          break;
      }
      
    });

    // let the jQuery Mobile initialize the page.
    $.mobile.initializePage();  

  })
  

}).call(this);

// Internal News Module
(function(){ 
  var News = (function(){
    
    function News() {
      this.news = [];

    }

    // params: element: the DOM element that the news is going to append
    News.prototype.fetch = function(element) {
      $.ajax({
        url: "http://makzan-temp.s3.amazonaws.com/news.json",
        // url: "http://localhost:8888/news.json",
        type: "GET",
        crossDomain: true,
        dataType: "jsonp",   
        jsonpCallback: 'callback',
        success: (function (data) {
          this.news = data.news;

          $(element).empty();
          for (var i=0, len=data.news.length; i<len; i++)
          {
            var news = data.news[i];
            var listItem = ["<li><a href='#news-detail'>", news.title, "</a></li>"].join('');            
            $(element).append(listItem);
          }           
          $(element).listview('refresh');
        }).bind(this),          
      });
    
    }
    
    return News;
  })();

  // define it in global scope.
  if (!this.greatLtd) this.greatLtd = {}
  this.greatLtd.News = News;

}).call(this);

// Twitter Search Module
(function() {

  var TwitterQuery = (function(){
    function TwitterQuery(query) {
      this.query = query;
      this.twitterURL = "http://search.twitter.com/search.json?q=" + this.query + "&rpp=10&callback=?";      
    }

    TwitterQuery.prototype.fetch = function(element) {
      $.getJSON(this.twitterURL, function(data) {        
        $(element).empty();
        for (var i=0, len=data.results.length; i < len; i++) {
          var tweet = data.results[i];
          $(element).append("<li><img src='images/empty.png' style='background-image:url(" + tweet.profile_image_url + ")'><h1>" + tweet.from_user + "</h1> <p>" + tweet.text + "</p> </li>");
        }
        $(element).listview('refresh');
      });
    }

    return TwitterQuery;
  })();

  // export the TwitterQuery to global scope
  if (!this.greatLtd) this.greatLtd = {}
  this.greatLtd.TwitterQuery = TwitterQuery;


}).call(this);