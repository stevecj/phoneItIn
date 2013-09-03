var phoneItIn = phoneItIn || {};

phoneItIn.formatters = phoneItIn.formatters || {};

phoneItIn.formatters.nanp = (function () {
  var my = {};

  function digitizeAlpha( value ) {
    return value
      .replace( /[a-c]/ig , '2' )
      .replace( /[d-f]/ig , '3' )
      .replace( /[g-i]/ig , '4' )
      .replace( /[j-l]/ig , '5' )
      .replace( /[m-o]/ig , '6' )
      .replace( /[p-s]/ig , '7' )
      .replace( /[t-v]/ig , '8' )
      .replace( /[w-z]/ig , '9' );
  }
  my.digitizeAlpha = digitizeAlpha;

  function format( value ) {
    var FORMAT_PATTERN = /^[(]?(\d\d\d)[)]?(\d\d\d)-?(\d\d\d\d)$/,
        formatted = value.replace( /\s/g, '' );

    if ( formatted.length === 0 ) {
      return formatted;
    }

    formatted = digitizeAlpha( formatted );
    if ( ! formatted.match( FORMAT_PATTERN ) ) {
      return value;
    }

    return formatted.replace( FORMAT_PATTERN, '($1) $2-$3' );
  }
  my.format = format;

  function active( value ) {
    var FORMAT_PATTERN = /^[(]?(...)[)]?(...)-?(....)(.*)$/,
        digits = (value + '__________').replace( /\s/g, '' ).replace( FORMAT_PATTERN, '$1$2$3$4' );

    digits = digits.substring( 0, digits.length );
    digits = digitizeAlpha( digits );
    if( digits.length > 20 ) {
      digits = digits.substr( 0, digits.length - 10 );
    } else {
      digits = digits.substr( 0, 10 );
    }
    return digits.replace( FORMAT_PATTERN, '($1) $2-$3 $4' ).replace( / $/, '' );
  }
  my.active = active;

  function validityOf( value ) {
    var activeFormatted, digits;

    if( value.match(/[^-\dA-Za-z()\s]/) ) { return 'invalid'; }

    activeFormatted = active( value );
    if( activeFormatted.length > '(___) ___-____'.length ) { return 'invalid' }

    digits = activeFormatted.replace( /^[(](...)[)] (...)-(....)$/, "$1$2$3" );
    if( digits.match(/[^\d_]/) ) { return 'invalid'; }
    if( activeFormatted.match(/_/) ) { return 'partial'; }

    return 'complete';
  }
  my.validityOf = validityOf;

  return my;
})();

phoneItIn.UI = (function () {
  var formatter = phoneItIn.formatters.nanp;

  function UI() { }
  UI.prototype = {};

  function addHelpToInput( input ) {
    var helpEl = document.createElement('DIV');
    helpEl.setAttribute( 'id', 'phin-help' );
    helpEl.setAttribute('style',
      "position:absolute; " +
      "top:" + (input.offsetTop + input.offsetHeight) + "px; " +
      "left:" + input.offsetLeft + "px;");
    helpEl.innerHTML = "<div id='phin-help-inner'></div>";
    input.parentNode.insertBefore( helpEl, input.nextSibling );
    updateHelpForInput( input );
  }

  function updateHelpForInput( input ) {
    var validity,
        helpEl      = document.getElementById( 'phin-help'       ),
        helpInnerEl = document.getElementById( 'phin-help-inner' );

    helpInnerEl.innerHTML = formatter.active( input.value );
    validity = formatter.validityOf( input.value );
    switch( validity ) {
      case 'partial'  : helpEl.className = ''              ; break;
      case 'invalid'  : helpEl.className = 'phin-invalid'  ; break;
      case 'complete' : helpEl.className = 'phin-complete' ; break;
    }
  }

  function removeHelp() {
    var helpEl = document.getElementById('phin-help');
    if( helpEl ){ helpEl.parentNode.removeChild( helpEl ); }
  }

  function formatValueOfInput( input ) {
    input.value = formatter.format( input.value );
  }

  function bindToInput( input ){
    input.addEventListener( 'focus' , function(){ addHelpToInput( input );     } );
    input.addEventListener( 'blur'  , function(){ formatValueOfInput( input ); } );
    input.addEventListener( 'blur'  , function(){ removeHelp();                } );
    input.addEventListener( 'input' , function(){ updateHelpForInput( input ); } );
  }
  UI.prototype.bindToInput = bindToInput;

  return UI;
})();
