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
      if ($(event.target).attr('id') === 'twitter') {
        twitter = new greatLtd.TwitterQuery("Great Limited");
        twitter.fetch($("#tweet-list"));
      } else if ($(event.target).attr('id') === 'map-page') {
        $('#map').gmap('addMarker', {
          'position': '22.192362,113.54206',
          'bounds': true
        });
      }
    });


    $.mobile.initializePage();  
  })
  

}).call(this);


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