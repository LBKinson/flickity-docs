var cheerio = require('cheerio');
var through2 = require('through2');

module.exports = function pageNav() {
  return through2.obj( function( file, enc, callback ) {
    var $ = cheerio.load( file.contents.toString(), {
      decodeEntities: false
    });
    var pageNavHtml = '\n';
    // query each h2, h3, h4
    $('.main h2, .main h3, .main h4').each( function( i, header ) {
      var $header = $( header );
      var title = $header.text();
      // remove HTML entities
      var slug = title.replace( /&[\w\d]+;/gi, '' )
        // replace non alphanumeric to hyphens
        .replace( /[^\w\d]+/gi, '-' )
        // trim trailing hyphens
        .replace( /^\-+/, '' ).replace( /\-+$/, '' ).toLowerCase();
      // set id slug
      $header.attr( 'id', slug );
      // add item to pageNav
      pageNavHtml += '<li class="page-nav__item--' + header.name + '">' +
        '<a href="#' + slug + '">' + title + '</a></li>\n';
    });
    // add pageNavHtml to page
    $('.page-nav').html( pageNavHtml );

    var html = $.html();
    // replace double quote for single quote for JSON attributes
    html = html.replace( /="\{/g, "='{" ).replace( /\}"/g, "}'" );
    file.contents = new Buffer( html );
    this.push( file );
    callback();
  });
};