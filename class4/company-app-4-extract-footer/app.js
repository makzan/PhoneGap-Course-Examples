(function(){

  // jQuery Ready
  $(function(){
    $("[data-role='page']").each(function() {    
      var footer = $(".footer-template").html();
      $(this).append(footer);        
    });

    $.mobile.initializePage();  
  })
  

}).call(this);