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
      this.isbn = isbn || "";
    }
    return Book;
  })();

  var data = app.data = {};
  data.books = [];
  data.addBook = function(title, isbn) {
    data.books.push(new Book(title, isbn));
  };
  data.removeBook = function(isbn) {
    for(var i=0, len=data.books.length; i<len; i++) {
      var book = data.books[i];
      if (book.isbn === isbn) {
        data.books.splice(i, 1);
        return;
      }
    }
  }

}).call(this, jQuery);

// View
// Anything that belongs to interface.
;(function($){
  var app = this.app || (this.app={});

  var view = app.view = {}

  view.listElement = $('#books');

  view.inputs = {};
  view.inputs.title = $('#book-title');
  view.inputs.isbn = $('#book-isbn');
  view.inputs.clear = function() {
    view.inputs.title.val('');
    view.inputs.isbn.val('');
  }

  view.bookEntryTemplate = $('#templates').find('.book-entry');

  view.renderList = function(){
    view.listElement.empty();

    for(var i=0, len=app.data.books.length; i<len; i++) {
      var clone = view.bookEntryTemplate.clone();

      var book = app.data.books[i];

      clone.find('.book-title').html(book.title);
      clone.find('.isbn').html(book.isbn);
      clone.find('.delete-btn').attr('data-isbn', book.isbn);

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
      var title = app.view.inputs.title.val();
      var isbn = app.view.inputs.isbn.val();
      app.data.addBook(title, isbn);
      app.view.renderList();
      app.view.inputs.clear();
    });

    app.view.listElement.delegate('.delete-btn', 'click', function(){
      var isbn = $(this).data('isbn') + ""; // ensure we are dealing with string type.
      app.data.removeBook(isbn);
      app.view.renderList();
    });

  });

}).call(this, jQuery);

