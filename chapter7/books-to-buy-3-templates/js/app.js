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

  var data = app.data = {};
  data.books = [];
  data.addBook = function(title, isbn) {
    data.books.push(new Book(title, isbn));
  };

}).call(this, jQuery);

// View
// Anything that belongs to interface.
;(function($){
  var app = this.app || (this.app={});

  var view = app.view = {}

  view.listElement = $('#books');

  view.bookEntryTemplate = $('#templates').find('.book-entry');

  view.renderList = function(){
    view.listElement.empty();

    for(var i=0, len=app.data.books.length; i<len; i++) {
      var clone = view.bookEntryTemplate.clone();

      view.listElement.append(clone);
    }

    view.listElement.listview('refresh');
  }

}).call(this, jQuery);

// Controller Logic
// Glue the model and view together
;(function($){

  // Entry point
  $(function(){

    $('#add-book-btn').click(function(){
      app.data.addBook('Testing book', '1234567890123');
      app.view.renderList();
    });

  });

}).call(this, jQuery);

