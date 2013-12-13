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
// Anything related to data querying and manipulation
;(function($){
  var app = this.app || (this.app={});

  var Book = (function(){
    function Book(title, isbn) {
      this.title = title;
      this.isbn = isbn;
    }
    return Book;
  })();

  app.data = {};
  app.data.books = [];
  app.data.addBook = function(title, isbn) {
    app.data.books.push(new Book(title, isbn));
  };

}).call(this, jQuery);

// View
// Anything that belongs to interface.
;(function($){
  var app = this.app || (this.app={});

  app.view = {}

  app.view.listview = $('#books');

}).call(this, jQuery);

// Controller Logic
// Glue the model and view together
;(function($){

  // Entry point
  $(function(){

    $('#add-book-btn').click(function(){
      app.data.addBook('Testing book', '1234567890123');
    });

  });

}).call(this, jQuery);

