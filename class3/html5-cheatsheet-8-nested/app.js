(function() {


  $(function(){
    //disable the default mobile safari long tap behavior on elements
    document.documentElement.style.webkitTouchCallout = 'none';

    //default page transition
    $.mobile.defaultPageTransition = 'slide';

    //make the button reacts faster
    $.mobile.buttonMarkup.hoverDelay = 0;


    // before adding dividers, make sure we have sort the tags
    tags.sort(function(a, b) {
      return a.name > b.name;
    });

    var currentDivider = '';
    
    // construct three ul sub-list, all, new tag, obsolete
    $('#tags').append("<li>All Tags <ul id='all-tags'></ul></li>");
    $('#tags').append("<li>New Tags <ul id='new-tags'></ul></li>");
    $('#tags').append("<li>Obsolete Tags <ul id='obsolete-tags'></ul></li>");

    //append li to the ul#tags
    for (var i=0, len=tags.length; i<len; i++) {
      tag = tags[i];

      // check if we need to add divider
      var firstCharacter = tag.name.substr(0, 1);

      if (firstCharacter != currentDivider)
      {
        $('#all-tags').append("<li data-role='list-divider'>" + firstCharacter.toUpperCase() + "</li>");
        currentDivider = firstCharacter;
      }

      // obsolete
      var obsolete = '';
      var obsoleteClass='';
      if (!tag.html5) 
      {
        obsolete = "<p class='ui-li-count'>obsolete</p>";
        obsoleteClass = 'obsolete';

        $('#obsolete-tags').append("<li><a href='http://developer.mozilla.org/en/HTML/Element/" + tag.name + "'>" + tag.name + obsolete + "</a></li>");
      }
        
      var newTag = '';
      var iconFile = 'empty.png';
      if (!tag.html4 && tag.html5)
      {
        newTag = "<p class='ui-li-count'>html5</p>";
        iconFile = 'html5.png';

        $('#new-tags').append("<li><a href='http://developer.mozilla.org/en/HTML/Element/" + tag.name + "'><h1>" + tag + "</h1><p> " + tag.explain + "</p>" + newTag + "</a></li>");
      }
        

      $('#all-tags').append("<li class='" + obsoleteClass + "'><a href='http://developer.mozilla.org/en/HTML/Element/" + tag.name + "'><img src='images/" + iconFile + "' class='ui-li-icon'><h1>" + tag + "</h1><p> " + tag.explain + "</p>" + obsolete + newTag +"</a></li>");
    }

    // refresh the tags listview programatically.
    $('#tags').listview('refresh');

  })


  // Tag class
  var Tag = (function() {
    /*
    name - string, tag name
    explain - string, one sentence description
    html4 - bool, available in html4
    html5 - bool, not obsoleted in html5
    */
    function Tag(name, explain, html4, html5) {
      this.name = name;
      this.explain = explain != null ? explain : '';
      this.html4 = html4 != null ? html4 : 'true';
      this.html5 = html5 != null ? html5 : 'true';
    }

    Tag.prototype.toString = function() {
      return "&lt;" + this.name + "&gt;";
    }

    return Tag;
  })(); // end of Tag class

  // the Tag data

  var tags = [];

  tags.push(new Tag('br', 'inserts a single line break'));
  tags.push(new Tag('a', 'defines a hyperlink'));
  tags.push(new Tag('abbr', 'defines an abbreviation'));
  tags.push(new Tag('article', 'defines an article', false, true));
  tags.push(new Tag('aside', 'defines content that is aside from the page', false, true));
  tags.push(new Tag('audio', 'defines audio content', false, true));
  tags.push(new Tag('b', 'defines bold text'));
  tags.push(new Tag('base', 'defines a base URL for all the links in the page'));
  tags.push(new Tag('bdo', 'defines direction of the text'));
  tags.push(new Tag('blockquote', 'defines a long quotation'));
  tags.push(new Tag('body', 'defines body element'));
  tags.push(new Tag('button', 'defines a button'));
  tags.push(new Tag('canvas', 'defines a graphics drawing area', false, true));
  tags.push(new Tag('caption', 'defines a table caption'));
  tags.push(new Tag('center', 'center algin the content', true, false));
  tags.push(new Tag('cite', 'defines a citation'));
  tags.push(new Tag('code', 'defines computer code text'));
  tags.push(new Tag('col', 'defines attributes for table columns'));
  tags.push(new Tag('colgroup', 'defines groups of table columns'));
  tags.push(new Tag('command', 'defines a command button', false, true));
  tags.push(new Tag('datalist', 'defines a dropdown list', false, true));
  tags.push(new Tag('dd', 'defines a definition description'));
  tags.push(new Tag('del', 'defines deleted text'));
  tags.push(new Tag('details', 'defines details of an element'));
  tags.push(new Tag('dfn', 'defines a definition term'));
  tags.push(new Tag('dir', 'defines a directory list', true, false));
  tags.push(new Tag('div', 'defines a general section of document'));
  tags.push(new Tag('dl', 'defines a definition list'));
  tags.push(new Tag('dt', 'defines a definition term'));
  tags.push(new Tag('em', 'defines an emphasized text'));
  tags.push(new Tag('embed', 'defines an external interactive content or plugin', false, true));
  tags.push(new Tag('fieldset', 'defines a fieldset in form'));
  tags.push(new Tag('figure', 'defines a media content with caption', false, true));
  tags.push(new Tag('font', 'defines font face, font size and text color', true, false));
  tags.push(new Tag('footer', 'defines a footer for the section or the page', false, true));
  tags.push(new Tag('form', 'defines a form'));
  tags.push(new Tag('frame', 'defines a particale window frame inside frameset', true, false));
  tags.push(new Tag('frameset', 'defines a frameset that contains multiple frames', true, false));
  tags.push(new Tag('h1', 'defines header 1'));
  tags.push(new Tag('h2', 'defines header 2'));
  tags.push(new Tag('h3', 'defines header 3'));
  tags.push(new Tag('h4', 'defines header 4'));
  tags.push(new Tag('h5', 'defines header 5'));
  tags.push(new Tag('h6', 'defines header 6'));
  tags.push(new Tag('head', 'defines the information of the document'));
  tags.push(new Tag('header', 'defines a header of the section or the page', false, true));
  tags.push(new Tag('hgroup', 'defines information about a section in a document', false, true));
  tags.push(new Tag('hr', 'defines a horizontal rule'));
  tags.push(new Tag('html', 'defines an html document'));
  tags.push(new Tag('i', 'defines an italic text'));
  tags.push(new Tag('iframe', 'defines an inline window frame'));
  tags.push(new Tag('img', 'defines an image'));
  tags.push(new Tag('input', 'defines an input field'));
  tags.push(new Tag('ins', 'defines an inserted text'));
  tags.push(new Tag('keygen', 'defines a generated key in a form', false, true));
  tags.push(new Tag('kbd', 'defines a keyboard text'));
  tags.push(new Tag('label', 'defines a caption for an item'));
  tags.push(new Tag('legend', 'defines a title of fieldset'));
  tags.push(new Tag('li', 'defines a list item'));
  tags.push(new Tag('link', 'defines a resources reference'));
  tags.push(new Tag('map', 'defines an image map'));
  tags.push(new Tag('mark', 'defines marked text', false, true));
  tags.push(new Tag('menu', 'defines a menu list'));
  tags.push(new Tag('meta', 'defines meta information of the document'));
  tags.push(new Tag('meter', 'defines measurement'));
  tags.push(new Tag('nav', 'defines a navigation of the section or page'));
  tags.push(new Tag('noframes', 'display text for browsers that do not handle frames', true, false));
  tags.push(new Tag('noscript', 'display text for browsers that do not handle script'));
  tags.push(new Tag('object', 'defines an embedded object'));
  tags.push(new Tag('ol', 'defines an ordered list'));
  tags.push(new Tag('optgroup', 'defines an option group'));
  tags.push(new Tag('option', 'defines an option in select list'));
  tags.push(new Tag('output', 'defines some types of output'));
  tags.push(new Tag('p', 'defines a paragraph'));
  tags.push(new Tag('param', 'defines a parameter for an object'));
  tags.push(new Tag('pre', 'defines preformatted text'));
  tags.push(new Tag('progress', 'defines progress of a task'));
  tags.push(new Tag('q', 'defines a short quotation'));
  tags.push(new Tag('strike', 'defines strikethrough text', true, false));
  tags.push(new Tag('samp', 'defines sample computer code'));
  tags.push(new Tag('script', 'defines a block script'));
  tags.push(new Tag('section', 'defines a section of content', false, true));
  tags.push(new Tag('select', 'defines a selectable list'));
  tags.push(new Tag('small', 'defines small text'));
  tags.push(new Tag('source', 'defines the source of media resources', false, true));
  tags.push(new Tag('span', 'defines an inline section of content'));
  tags.push(new Tag('strong', 'defines a strong text'));
  tags.push(new Tag('style', 'defines a style definition'));
  tags.push(new Tag('sub', 'defines sub-scripted text'));
  tags.push(new Tag('sup', 'defines super-scripted text'));
  tags.push(new Tag('table', 'defines a table'));
  tags.push(new Tag('tbody', 'defines a table body'));
  tags.push(new Tag('td', 'defines a table data cell'));
  tags.push(new Tag('textarea', 'defines a text area input'));
  tags.push(new Tag('tfoot', 'defines a table footer'));
  tags.push(new Tag('thead', 'defines a table header'));
  tags.push(new Tag('th', 'defines a table header'));
  tags.push(new Tag('time', 'defines a date and time'));
  tags.push(new Tag('title', 'defines the document title'));
  tags.push(new Tag('tr', 'defines a table row'));
  tags.push(new Tag('tt', 'defines a teletype text', true, false));
  tags.push(new Tag('u', 'defines underlined text', true, false));
  tags.push(new Tag('ul', 'defines an unordered list'));
  tags.push(new Tag('var', 'defines a variable'));
  tags.push(new Tag('video', 'defines a video', false, true));  
}).call(this);