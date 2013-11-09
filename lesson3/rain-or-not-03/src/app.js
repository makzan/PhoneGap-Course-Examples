;(function(){
  var app = this.app = this.app || {};

  app.model.fetch('Macao,MO', function(weather){
    console.log(weather);
    app.view.update(weather);
  });

}).call(this);