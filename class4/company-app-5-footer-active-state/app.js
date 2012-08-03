(function(){

  // jQuery Ready
  $(function(){

    // append footer to each page
    $("[data-role='page']").each(function() {    
      var footer = $(".footer-template").html();
      $(this).append(footer);  


      // footer active state
      var target = 'footer .first-page a';
      if ($(this).attr('id') === 'twitter') {
        target = 'footer .second-page a';
      } else if ($(this).attr('id') === 'about') {
        target = 'footer .third-page a';
      }

      $(this).find(target).addClass('ui-state-persist').addClass('ui-btn-active');      

    });


    $.mobile.initializePage();  
  })
  

}).call(this);