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


// DB Module
(function(){
  var DB = (function(){
    function DB() {
      this.db = openDatabase("diary", "1.0", "Diary DB", 1024*1024*10);
      // create the table
      this.db.transaction(function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS entries (id unique, lat, lng, note text, video_url, audio_url, photo_url)');
      }); 

      // manage the entry ID ourselves
      if (localStorage["entries_id"] == undefined)
        localStorage["entries_id"] = 1;
    }

    DB.prototype.insert = function(entry)
    {
      this.db.transaction(function(tx){
        tx.executeSql('INSERT INTO entries(id, lat,lng,note,video_url,audio_url,photo_url) VALUES(?, ?, ?, ?, ?, ?, ?)',
          [localStorage["entries_id"], entry.lat, entry.lng, entry.note, entry.video_url, entry.audio_url, entry.photo_url]);
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
        console.log ('phonegap is ready');        
        // alert("Device Ready");
        
        this.prepareDatabase();

        this.watchAcceleration();

        this.locateMyself();

        // list the entries once the database ready.
        (new Diary()).listEntries($('#entries-list'));
        
      }).bind(this));
    }

    PhoneGapManager.prototype.watchAcceleration = function() {
      this.watchID = navigator.accelerometer.watchAcceleration(
      //success callback: 
      function(acceleration){
        this.acceleration = acceleration;
        console.log("acceleration: x:" + acceleration.x + " y: " + acceleration.y + " z :" + acceleration.z);
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



// Diary Module
(function(){
  var Diary = (function(){
    function Diary() {
      
    }

    Diary.prototype.listEntries = function(element)
    {
      window.diaryapp.db.query(function(results){
        $(element).empty();        
        for (var i = results.rows.length - 1; i >= 0; i--) {
          var entry = results.rows.item(i);
          $(element).append("<li>" + entry.id + ' ' + entry.note + "</li>");
        }; 
        $(element).listview('refresh');
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
      Diary           = window.diaryapp.Diary;

  var diary = new Diary();
  

  $("#capture-photo").click(function(){
    (new Camera()).getPicture(function(imageSrc){
      $("#photo").css('background-image', "url("+ imageSrc +")");
    })
  })

  $("#create-button").click(function(){
    alert("creating dummy diary entry.");
    window.diaryapp.db.insert({
      'lat': '23.123123',
      'lng': '44.556677',
      'note': 'Long Text Here',      
    })
    diary.listEntries($('#entries-list'));
  });
})


