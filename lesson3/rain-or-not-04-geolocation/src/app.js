;(function(){
  var app = this.app = this.app || {};

  app.model.fetch('Macao,MO', function(weather, place){
    app.view.update(weather, place);
  });

}).call(this);