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
;(function($){
  var app = this.app || (this.app={});

  var key = 'b2c88ae9041247d0b153a3910b31c4d0';
  var url = 'http://openexchangerates.org/api/latest.json?app_id=' + key + '&callback=?';

  $.getJSON(url, function(data){
    // console.log(data); // print the JSON response.
    app.rates = data.rates;

  });
}).call(this, jQuery);

// Exchange module (part of the Model)
;(function(){
  var app = this.app || (this.app={});

  function Exchange(value, srcCurrency) {
    var srcPerUsd = app.rates[srcCurrency.toUpperCase()];
    var usdPerSrc = 1 / srcPerUsd;

    return {
      to: function(targetCurrency) {
        var targetPerUsd = app.rates[targetCurrency.toUpperCase()];
        var srcPerTarget = usdPerSrc * targetPerUsd;
        return value * srcPerTarget;
      }
    };
  }

  app.Exchange = Exchange;
}).call(this);

// View
;(function($){
  var app = this.app || (this.app={});

  var result = $('#result');

  app.view = {}
  app.view.button = $('#submit');
  app.view.input = $('#cny-input');

  app.view.updateResult = function(cny, mop) {
    result.html('CNY $' + cny.toFixed(2) +' = MOP $' + mop.toFixed(2));
  }

}).call(this, jQuery);

// Controller Logic
;(function($){

  app.view.button.on('click', function(){
    var cny = app.view.input.val() * 1;
    var mop = app.Exchange(cny, 'CNY').to('MOP');
    app.view.updateResult(cny, mop);
  });
}).call(this, jQuery);

