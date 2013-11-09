;(function(){
  var app = this.app = this.app || {};

  app.model.fetch('Macao,MO', function(data){
    console.log(data);
    var code = data.weather[0].id + ""; // force to string
    if (code[0] == 5) { // rainy code all start at 5
      app.view.update('rain');
    } else {
      app.view.update('sunny');
    }
  });

}).call(this);