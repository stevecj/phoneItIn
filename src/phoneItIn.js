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
        digits = value.replace( /\s/g, '' ).replace( FORMAT_PATTERN, '$1$2$3$4' );

    digits = digitizeAlpha(digits);
    if( digits.length < 10 ) {
      digits = (digits + '__________').substr( 0, 10 );
    }
    return digits.replace( FORMAT_PATTERN, '($1) $2-$3 $4' ).replace( / $/, '' );
  }
  my.active = active;

  return my;
})();

phoneItIn.UI = (function () {
  var formatter = phoneItIn.formatters.nanp;

  function UI() { }
  UI.prototype = {};

  function addHelpToInput( input ) {
    var helpEl = document.createElement('DIV');
    helpEl.setAttribute( 'id', 'phin-help' );
    input.parentNode.insertBefore( helpEl, input.nextChild );
    updateHelpForInput( input );
  }

  function updateHelpForInput( input ) {
    var helpEl = document.getElementById('phin-help');
    helpEl.innerHTML = formatter.active( input.value );
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
