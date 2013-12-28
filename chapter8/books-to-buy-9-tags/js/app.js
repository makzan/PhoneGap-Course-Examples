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
    function Book(title, isbn, tags) {
      this.title = title;
      this.isbn = isbn || "";
      this.tags = tags || "";
    }
    return Book;
  })();

  var data = app.data = {};
  data.books = JSON.parse(localStorage.getItem("books")) || [];
  data.saveToLocal = function() {
    localStorage.setItem("books", JSON.stringify(this.books));
  }
  data.addBook = function(title, isbn, tags) {
    this.books.push(new Book(title, isbn, tags));
    this.saveToLocal();
  };
  data.removeBook = function(isbn) {
    for(var i=0, len=data.books.length; i<len; i++) {
      var book = data.books[i];
      if (book.isbn === isbn) {
        this.books.splice(i, 1);
        this.saveToLocal();
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
  view.inputs.tags = $('#book-tags');
  view.inputs.clear = function() {
    view.inputs.title.val('');
    view.inputs.isbn.val('');
    view.inputs.tags.val('');
  }

  view.bookEntryTemplate = $('#templates').find('.book-entry');

  view.renderList = function(){
    view.listElement.empty();

    for(var i=0, len=app.data.books.length; i<len; i++) {
      var clone = view.bookEntryTemplate.clone();

      var book = app.data.books[i];

      clone.find('a.amazon-link').attr('href', 'http://www.amazon.com/s/?field-keywords='+book.title);
      clone.find('.book-title').html(book.title);
      clone.find('.isbn').html(book.isbn);
      clone.find('.tags').html(book.tags);
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

    // render the list at initialize
    app.view.renderList();

    $('#add-book-btn').click(function(){
      var title = app.view.inputs.title.val();
      var isbn = app.view.inputs.isbn.val();
      var tags = app.view.inputs.tags.val();
      app.data.addBook(title, isbn, tags);
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

