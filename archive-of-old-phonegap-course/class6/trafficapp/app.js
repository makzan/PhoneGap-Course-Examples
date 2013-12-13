// PhoneGap Module
(function(){
  var PhoneGapManager = (function(){
    function PhoneGapManager() {
      this.isReady = false;

      this.location = {
        coords: {
          latitude: 0,
          longitude: 0
        }
      }

      // Note that we need to loop the PhoneGap.available property if we need support on BlackBerry <5.0
      $(document).bind ("deviceready", (function(){      
        this.isReady = true;
        console.log ('phonegap is ready');        
        this.locateMyself();
      }).bind(this));
    }

    PhoneGapManager.prototype.locateMyself = function() {
      var options = {
        maximumAge: 3000, 
        timeout: 5000, 
        enableHighAccuracy: true
      };
      navigator.geolocation.getCurrentPosition((function(position){
        console.log ('position:'+ position);
        console.log ('position:' + position.coords.latitude);
        console.log ('position:' + position.coords.longitude);
        // alert("Location: " + position.coords.latitude + ", " + position.coords.longitude);
        this.location = position;
      }).bind(this),
      function(){
        alert("Location fetching error.")
      }, options);
    }

    return PhoneGapManager;
  })();

  // export it in global scope.
  if (!this.macaoTraffic) this.macaoTraffic = {}
  this.macaoTraffic.PhoneGapManager = PhoneGapManager;

}).call(this);


// Reports Module
(function() {
  var Reports = (function(){
    function Reports(){
      this.url = 'https://api.mongolab.com/api/1/databases/macao-traffic/collections/reports?apiKey=502d0b59e4b07320d21ab85e'
    }
    Reports.prototype.post = function (name, lat, lng, message, callback) {
      $.ajax({
        url: this.url,
        type: "POST",
        contentType: "application/json",
        crossDomain: true,
        dataType: "json",
        data: JSON.stringify({
          name: name,          
          lat: lat,          
          lng: lng,          
          message: message,          
        }),
        success: function (data) {
          console.log('saved to mongo, response:', data);
          // call the callback function
          if (callback != undefined)
          {
            callback(data);
          }
        }
      })
    }
    Reports.prototype.fetch = function(callback) {
      $.ajax({
        url: this.url,
        type: "GET",                      
        success: function (data) {
          callback(data);
        }
      })
    }

    return Reports;

  })();  

  // export the Reports to global scope
  if (!this.macaoTraffic) this.macaoTraffic = {}
  this.macaoTraffic.Reports = Reports;

}).call(this);

// Reports View
(function() {
  var ReportsView = (function(){
    // expected data is array of object with name, email, message as key in each object.
    function ReportsView(){      
    }

    ReportsView.prototype.fillPosition = function() {
      var lat = window.macaoTraffic.phoneGapManager.location.coords.latitude;
      var lng = window.macaoTraffic.phoneGapManager.location.coords.longitude;
      $('#report-lat').val(lat);
      $('#report-lng').val(lng);
    }

    // posting view
    ReportsView.prototype.handlePostButton = function() {
      var Reports = macaoTraffic.Reports;
      $('#report-submit').click(function(){
        var name = $('#report-name').val();
        var message = $('#report-message').val();
        var lat = $('#report-lat').val();
        var lng = $('#report-lng').val();
        (new Reports()).post(name, lat, lng, message, function(){
          $('#report-name').val('');
          $('#report-lat').val('');
          $('#report-lng').val('');
          $('#report-message').val('');
          alert('Feedback sent. Thanks.');
          $.mobile.changePage('#home');
        });
      })
    }

    // listing the data    
    ReportsView.prototype.list = function(data, element) {
      $(element).empty();      
      for (var i=data.length-1; i>=0; i--)
      {
        var reports = data[i];
        var listItem = "<li><h2>" + reports.name + "</h2><p>(" + reports.lat + ", " + reports.lng + ")</p><p>" + reports.message + "</p>";
        $(element).append(listItem);
      }           
      $(element).listview('refresh');
    }

    return ReportsView;
  })();

  // export the ReportsView to global scope
  if (!this.macaoTraffic) this.macaoTraffic = {}
  this.macaoTraffic.ReportsView = ReportsView;
}).call(this);

(function(){  

  // alias the Classes  
  var Reports         = macaoTraffic.Reports,
      ReportsView     = macaoTraffic.ReportsView,    
      PhoneGapManager = macaoTraffic.PhoneGapManager;  

  // jQuery Ready
  $(function(){

    // init the phoneGapManager, and put it into macaoTraffic scope.
    if (!window.macaoTraffic) window.macaoTraffic = {}
    var phoneGapManager = window.macaoTraffic.phoneGapManager = new PhoneGapManager();    

    // default transition: slide
    $.mobile.defaultPageTransition = 'slide';

    // append footer to each page
    $("[data-role='page']").each(function() {    
      var footer = $(".footer-template").html();
      $(this).append(footer);  


      // footer active state
      var target = 'footer .first-page a';
      switch ($(this).attr('id')) {
        case 'home'       : target = 'footer .home-page a';   break;        
        case 'report'     : target = 'footer .report-page a'; break;                               
      }      

      $(this).find(target).addClass('ui-state-persist').addClass('ui-btn-active');      

    });


    // listen to the pageBeforeShow event
    $(document).bind('pagebeforeshow', function(event, ui) {  
      switch ($(event.target).attr('id')) {
        case 'home':
          (new Reports()).fetch(function(data){
            console.log('callback:', data);
            (new ReportsView()).list(data, '#reports-list');
          })
          break; 
        case 'report':
          (new ReportsView()).fillPosition();               
        case 'map-page':
          $('#map').gmap('addMarker', {
            'position': '22.192362,113.54206',
            'bounds': true
          });    
          $('#map').gmap('addMarker', {
            'position': phoneGapManager.location.coords.latitude+','+phoneGapManager.location.coords.longitude,
            'title' : 'Current Position',
            'icon' : 'http://makzan-temp.s3.amazonaws.com/male.png',
            'bounds': true
          });        
          break;
        
      }
      
    });
    

    (new ReportsView()).handlePostButton();


    // let the jQuery Mobile initialize the page.
    $.mobile.initializePage();      

  })
  

}).call(this);

