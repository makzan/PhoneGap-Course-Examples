// Camera Module
(function(){
  var Camera = (function(){
    function Camera() {
      
    }

    Camera.prototype.getPicture = function(callback)
    {
      var fixPhotoOrientation = function(imageSrc, successCallback)
      {

        var accelerationX = window.diaryapp.phonegapManager.acceleration.x;
        var accelerationY = window.diaryapp.phonegapManager.acceleration.y;

        var orientation = (acceleration.x > acceleration.y) ? "landscape" : "portrait";
        

        var imgElm = $('<img/>');
        
        // hide this temp img element.
        imgElm.css({position: 'absolute', left: '0px', top: '-999999em', maxWidth: 'none', width: 'auto', height: 'auto'});


        // bind the error in case errors occur.
        imgElm.bind('error', function() {
          alert('Failed on loading image.');
        });

        // the image is not ready at once, need to handle it after 'load' event
        imgElm.bind('load', function() {
          var canvas = document.createElement("canvas");
          var context = canvas.getContext('2d');
          var imageWidth = imgElm.width();
          var imageHeight = imgElm.height();
          

          var canvasWidth = imageWidth;
          var canvasHeight = imageHeight;
          var canvasX = 0;
          var canvasY = 0;
          var degree = 0;

          if (orientation=='portrait') {
            // swap the canvas width and height;
            canvasWidth = imageHeight;
            canvasHeight = imageWidth;
            canvasY = imageHeight * (-1);  

            // set to rotate 90 degrees.
            degree = 90;
            
          }
          $(canvas).attr('width', canvasWidth);
          $(canvas).attr('height', canvasHeight);

          // rotate after setting canvas width and height
          context.rotate(degree * Math.PI / 180);   

          // draw after set dimension and rotation.
          context.drawImage(imgElm[0], canvasX, canvasY);          

          var dataUrl = canvas.toDataURL();

          // call back the result
          if (successCallback) successCallback(dataUrl);
        }); // end of 'load' binding

        // src and append must appear later than 'load' listener.
        imgElm.attr('src', imageSrc);
        $('body').append(imgElm);        
      }

      var onPhotoSuccess = function(imageData)
      {        
        var imageSrc = "data:image/jpeg;base64," + imageData         
        fixPhotoOrientation(imageSrc, function(newImageSrc) {          
          if (callback) callback(newImageSrc);
        });
        
      }

      var onPhotoFail = function(message)
      {
        alert('Camera Failed: ' + message);  
      }  

      navigator.camera.getPicture(onPhotoSuccess, onPhotoFail, {
        quality: 60,
        destinationType: navigator.camera.DestinationType.DATA_URL,
        saveToPhotoAlbum: true,
        targetWidth: 1024,
        targetHeight: 1024   
      });
          
    }

    return Camera;
  })();

  // export it in global scope.
  if (!this.diaryapp) this.diaryapp = {}
  this.diaryapp.Camera = Camera;

}).call(this);


// Video
(function(){
  var VideoCapture = (function(){
    function VideoCapture() {}

    VideoCapture.prototype.captureVideo = function(callback)
    {
      var onCaptureSuccess = function(video)
      {        
        if (callback) callback(video);        
      }

      var onCaptureFail = function(message)
      {
        alert('Video Capture Failed: ' + message);  
      }  

      navigator.device.capture.captureVideo(onCaptureSuccess, onCaptureFail,{});
          
    }
    return VideoCapture;
  })();

  // export it in global scope.
  if (!this.diaryapp) this.diaryapp = {}
  this.diaryapp.VideoCapture = VideoCapture;

}).call(this);

// Audio
(function(){
  var AudioCapture = (function(){
    function AudioCapture() {}

    AudioCapture.prototype.captureAudio = function(callback)
    {
      var onCaptureSuccess = function(audio)
      {        
        if (callback) callback(audio);        
      }

      var onCaptureFail = function(message)
      {
        alert('Audio Capture Failed: ' + message);  
      }  

      navigator.device.capture.captureAudio(onCaptureSuccess, onCaptureFail,{});
          
    }
    return AudioCapture;
  })();

  // export it in global scope.
  if (!this.diaryapp) this.diaryapp = {}
  this.diaryapp.AudioCapture = AudioCapture;

}).call(this);

// DB Module
(function(){
  var DB = (function(){
    function DB() {
      this.db = openDatabase("diary", "1.0", "Diary DB", 1024*1024*10);
      // create the table
      this.db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS entries (id integer unique, lat, lng, note text, video_url, audio_url, photo_url, photo text, drawing text)');
      }); 

      // manage the entry ID ourselves
      if (localStorage["entries_id"] == undefined)
        localStorage["entries_id"] = 1;
    }

    DB.prototype.insert = function(entry)
    {
      this.db.transaction(function(tx){
        tx.executeSql('INSERT INTO entries(id, lat,lng,note,video_url,audio_url,photo_url, photo, drawing) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [localStorage["entries_id"], entry.lat, entry.lng, entry.note, entry.video_url, entry.audio_url, entry.photo_url, entry.photo, entry.drawing]);
          localStorage["entries_id"]++;
      });
      
    }

    DB.prototype.query = function(callback)
    {
      this.db.transaction(function(tx){
        tx.executeSql('SELECT * FROM entries', [], function(tx, results){
          if (callback) callback(results);
        });
      });
    }

    DB.prototype.selectByID = function(id, callback)
    {
      this.db.transaction(function(tx){
        tx.executeSql("SELECT * FROM entries WHERE id=?", [id], function(tx, results){          
          if (callback) callback(results);
        })
      })
    }


    return DB;
  })();

  // export it in global scope.
  if (!this.diaryapp) this.diaryapp = {}
  this.diaryapp.DB = DB;

}).call(this);

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

      this.acceleration = {
        x: 0,
        y: 0,
        z: 0
      }

      // Note that we need to loop the PhoneGap.available property if we need support on BlackBerry <5.0
      $(document).bind("deviceready", (function(){      
        this.isReady = true;
        console.log ('phonegap is ready. version 0.8e.');        
        // alert("ready.");
        
        this.prepareDatabase();

        this.watchAcceleration();

        this.locateMyself();

        // list the entries once the database ready.
        (new Diary()).listEntries($('#entries-list'));
        
      }).bind(this));
    }

    PhoneGapManager.prototype.captureAudio = function(callback) {
      navigator.device.capture.captureAudio()
    }

    PhoneGapManager.prototype.watchAcceleration = function() {
      this.watchID = navigator.accelerometer.watchAcceleration(
      //success callback: 
      function(acceleration){
        this.acceleration = acceleration;
        // console.log("acceleration: x:" + acceleration.x + " y: " + acceleration.y + " z :" + acceleration.z);
      }, 
      // error callback: 
      function(){
        // error on getting acceleration.
      }, 
      // options: 
      { frequency: 1000 }); 
    }

    PhoneGapManager.prototype.prepareDatabase = function() {
      if (!window.diaryapp) window.diaryapp = {}
      window.diaryapp.db = new window.diaryapp.DB();
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
  if (!this.diaryapp) this.diaryapp = {}
  this.diaryapp.PhoneGapManager = PhoneGapManager;

  // init it directlly
  this.diaryapp.phonegapManager = new PhoneGapManager();

}).call(this);

// DrawingPad Module
(function(){
  var DrawingPad = (function(){
    function DrawingPad() {

      this.isDrawing = false;      

      var canvas = $('#drawing-pad');
      var ctx = canvas[0].getContext('2d');


      // when done drawing, save the canvas to PNG
      $("#done-drawing").click(function(e){
        var drawing = canvas[0].toDataURL();
        console.log (drawing);
        // save to diaryapp.
        window.diaryapp.newEntry.drawing = drawing;        
      })
      

      var startX = 0;
      var startY = 0;

      canvas.bind('touchstart mousedown', (function(e){
        console.log ('touchstart');
        this.isDrawing = true;

        var mouseX = e.originalEvent.touches[0].pageX - canvas.offset().left;
        var mouseY = e.originalEvent.touches[0].pageY - canvas.offset().top;  

        startX = mouseX;
        startY = mouseY;
        console.log (startX+ ' ' + startY);
      }).bind(this));

      canvas.bind('touchmove mousemove', (function(e){
        if (this.isDrawing)
        {          
          // e.pageX for desktop browser.
          // e.originalEvent.touches[0].pageX for mobile browser with jQuery Mobile.

          var mouseX = e.originalEvent.touches[0].pageX - canvas.offset().left;
          var mouseY = e.originalEvent.touches[0].pageY - canvas.offset().top;  
          drawLine(ctx, startX, startY, mouseX, mouseY, 3);
          startX = mouseX;
          startY = mouseY;
          console.log (startX + ' ' +startY);
        }
      }).bind(this));

      canvas.bind('touchend mouseup', (function(e) {
        this.isDrawing = false;
      }).bind(this));

      var drawLine = function(ctx, x1, y1, x2, y2, thickness) {   
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.lineWidth = thickness;
        ctx.strokeStyle = "#222";
        ctx.stroke();
      }
    }


    
    return DrawingPad;
  })();

  // export it in global scope.
  if (!this.diaryapp) this.diaryapp = {}
  this.diaryapp.DrawingPad = DrawingPad;

}).call(this);



// Diary Module
(function(){
  var Diary = (function(){
    function Diary() {
      
    }

    Diary.prototype.listEntries = function(element)
    {
      var listOf = function(entry) {
        var list = $("<li />");
        var a = ($("<a />"));
        a.addClass('view-entry-button');
        a.attr('data-entry-id', entry.id);
        a.attr('href', '#view');
        a.html(entry.id + ' ' + entry.note);
        list.html(a);
        return list;
      }

      window.diaryapp.db.query(function(results){
        $(element).empty();        
        for (var i = results.rows.length - 1; i >= 0; i--) {
          var entry = results.rows.item(i);
          $(element).append(listOf(entry));
        }; 
        $(element).listview('refresh');
      });
    }

    Diary.prototype.handleUI = function()
    {
      // creating
      this.handleNewEntryButton();
      this.handlePhotoButton();      
      this.handleAudioButton();
      this.handleVideoButton();      
      this.handleCreateButton();

      // viewing
      this.handleListAllButton();
      this.handleViewEntryButton();  
      this.handleMediaPlayButton();    
    }

    Diary.prototype.handleMediaPlayButton = function()
    {
      $(".media-play").live ('click', function(){
        console.log ('Should Play media.');
        var src = $(this).data('src');
        console.log (src);
        window.plugins.videoPlayer.play(src);
      })
    }

    Diary.prototype.handleNewEntryButton = function()
    {
      $("#new-entry-button").click(function(){
        window.diaryapp.newEntry = {};
        console.log ("created a new diary entry.");
      })
    }

    Diary.prototype.handleCreateButton = function()
    {
      var diaryapp = window.diaryapp;

      $("#form-submit").click(function(){
        diaryapp.newEntry.note = $('#form-diary').val();        
        diaryapp.newEntry.lat = diaryapp.phonegap.location.coords.latitude,
        diaryapp.newEntry.lng = diaryapp.phonegap.location.coords.longitude,

        console.log ("Creating entry: ", diaryapp.newEntry);
        
        diaryapp.db.insert(diaryapp.newEntry);          


        // go back after save
        $.mobile.changePage("#main");
      })
    }

    Diary.prototype.handlePhotoButton = function()
    {
      $("#add-photo").click(function(){
        (new Camera()).getPicture(function(imageSrc){
          window.diaryapp.newEntry.photo = imageSrc;          
        })
      })
    }

    Diary.prototype.handleAudioButton = function()
    {
      $("#add-audio").click(function(){
        (new AudioCapture()).captureAudio(function(audioFile){
          window.diaryapp.newEntry.audio_url = audioFile[0].fullPath;
          console.log ('new audio file: '+ audioFile[0].name + ' ' + audioFile[0].fullPath);
        });
      })
    }

    Diary.prototype.handleVideoButton = function()
    {
      $("#add-video").click(function(){
        (new VideoCapture()).captureVideo(function(videoFile){
          window.diaryapp.newEntry.video_url = videoFile[0].fullPath;
          console.log ('new video file: '+ videoFile[0].name + ' ' + videoFile[0].fullPath);
        });
      })
    }

    Diary.prototype.handleListAllButton = function()
    {
      $("#list-all-button").click((function(){
        console.log (this);
        this.listEntries($('#entries-list'));
      }).bind(this));
    }    

    Diary.prototype.handleViewEntryButton = function()
    {
      $(".view-entry-button").live('click', function(e){
        entryID = $(this).data('entryId');
        console.log (entryID);
        window.diaryapp.db.selectByID(entryID, function(diaryEntry){          
          var entry = diaryEntry.rows.item(0); // select by ID always results in one item.
          console.log (entry);
          if (entry.drawing != undefined)
          {            
            var drawing = $("<img />");
            drawing.addClass('view-drawing');
            drawing.attr('src', entry.drawing);
            $("#content").html(drawing);
          }

          $("#photo").hide();
          if (entry.photo != undefined)
          {
            $("#photo").show();
            $("#photo").css('background-image', "url("+ entry.photo +")");
            console.log ('what is the photo? '+ entry.photo);
          }   

          if (entry.video_url != undefined) 
          {
            var video = "<a href='#' class='media-play' data-role='button' data-src='" + entry.video_url + "'>Play Video</a>";
            $("#content").append(video);
          }  

          if (entry.audio_url != undefined) 
          {
            var audio = "<a href='#' class='media-play' data-role='button' data-src='" + entry.audio_url + "'>Play Audio</a>";
            $("#content").append(audio);
          }          

          // create jQuery Mobile button programtically.
          $("#content").find("a[data-role='button']").button();  
          

          $("#content").append(entry.note);

        });
                
      });
    }
    
    return Diary;
  })();

  // export it in global scope.
  if (!this.diaryapp) this.diaryapp = {}
  this.diaryapp.Diary = Diary;

}).call(this);

$(function(){
  var PhoneGapManager = window.diaryapp.PhoneGapManager 
      Camera          = window.diaryapp.Camera;
      VideoCapture    = window.diaryapp.VideoCapture;
      AudioCapture    = window.diaryapp.AudioCapture;
      Diary           = window.diaryapp.Diary;
      DrawingPad      = window.diaryapp.DrawingPad;

  var diary = new Diary();
  var phonegap = new PhoneGapManager();

  // expose the phonegap to global scope.
  window.diaryapp.phonegap = phonegap;
  
  diary.handleUI();

  $(document).bind('pagebeforeshow', function(event, ui) {      
    switch ($(event.target).attr('id')) {
      case 'create':                
        phonegap.locateMyself();
    }
  });

  (new DrawingPad());


  // jQuery Mobie settings
  document.documentElement.style.webkitTouchCallout = 'none';
  $.mobile.defaultPageTransition = 'slide';
  $.mobile.buttonMarkup.hoverDelay = 0;


  // fake deviceready event on desktop browser.
  // should be disabled the following line in mobile device.
  // $(document).trigger('deviceready');
  

})






