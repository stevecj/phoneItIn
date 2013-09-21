/****
 * Copyright (c) 2013 Steve Jorgensen
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.  
 ****/

/****
 * See https://github.com/stevecj/phoneItIn for information and updates.
 ****/

var phoneItIn = (function ( my ) {
  var ui;

  function getUi() {
    ui = ui || my.UI.getNewInstance();
    return ui;
  }

  my.        setupForTelInputs =
    function setupForTelInputs()
  {
    getUi().bindToTelInputs();
  }

  return my;
})( phoneItIn || {} );

phoneItIn.UI = (function ( phoneItIn, formatter ) {
  var proto;

  function UI( domAdapter ) {
    function getDomAdapter() {
      return domAdapter;
    }
    this.getDomAdapter = getDomAdapter;
  }
  proto = UI.prototype;

  UI.        getNewInstance =
    function getNewInstance()
  {
    return new UI( phoneItIn.domAdapters.basicAdapter );
  };

  function getFormatter() {
    return phoneItIn.formatters.nanp;
  }

  function addHelpToInput( my, input ) {
    var help = my.getDomAdapter().createDiv(),
        inputOffsetBox = input.getOffsetBox(),
        helpTopLeft = inputOffsetBox.below();

    help.setId( 'phin-help' );
    help.setStyle( "position:absolute; " + helpTopLeft.getTopLeftStyle() );
    help.setInnerHtml( "<div id='phin-help-inner'></div>" );
    input.insertNext( help );
    updateHelpForInput( my, input );
  }

  function updateHelpForInput( my, input ) {
    var VALIDITY_CLASS_MAP = {
          partial  : ''              ,
          invalid  : 'phin-invalid'  ,
          complete : 'phin-complete'
        },
        formattedValue = getFormatter().format( input.getValue() ),
        validity = getFormatter().validityOf( input.getValue() ),
        help = my.getDomAdapter().getElementById( 'phin-help' ),
        helpInner = my.getDomAdapter().getElementById( 'phin-help-inner' );

    helpInner.setInnerHtml( formattedValue );
    help.setClassName( VALIDITY_CLASS_MAP[ validity ] );
  }

  function removeHelp( my ) {
    var help = my.getDomAdapter().getElementById('phin-help');
    if( help ){ help.remove(); }
  }

  function formatValueOfInput( input ) {
    var value = input.getValue();

    if ( getFormatter().validityOf( value ) === 'complete' ) {
      input.setValue( getFormatter().format( value ) );
    }
  }

  function bindToInputAdapter( my, input ) {
    input.addFocusListener( function(){ addHelpToInput( my, input ); } );
    input.addBlurListener( function(){ formatValueOfInput( input ); } );
    input.addBlurListener( function(){ removeHelp( my ); } );
    input.addInputListener( function(){ updateHelpForInput( my, input ); } );
  }

  proto.     bindToInput =
    function bindToInput( inputDomElement )
  {
    var input = this.getDomAdapter().newElementAdapterFor( inputDomElement );
    bindToInputAdapter( this, input );
  }

  proto.     bindToTelInputs =
    function bindToTelInputs()
  {
    var i,
        inputs = this.getDomAdapter().inputsOfType( 'tel' ),
        length = inputs.length;

    for( i = 0; i < length; i++ ) {
      bindToInputAdapter( this, inputs[i] );
    }
  }

  return UI;
})( phoneItIn );

phoneItIn.pixelGeometry = phoneItIn.pixelGeometry || {};

phoneItIn.pixelGeometry.Vector2d = (function () {
  var proto;

  function Vector2d( h, v ) {
    this.h = h;
    this.v = v;
  }
  proto = Vector2d.prototype;

  proto.     getTopLeftStyle =
    function getTopLeftStyle()
  {
    return "top: "  + this.v + "px; " +
           "left: " + this.h + "px;"
  }

  return Vector2d;
})();

phoneItIn.pixelGeometry.Box2d = (function ( Vector2d ) {
  var proto;

  function Box2d( l, t, w, h ) {
    this.topLeft = new Vector2d( l, t );
    this.size    = new Vector2d( w, h );
  }
  proto = Box2d.prototype;

  proto.     below =
    function below()
  {
    var topLeft= this.topLeft;
    return new Vector2d( topLeft.h, topLeft.v + this.size.v );
  }

  return Box2d;
})( phoneItIn.pixelGeometry.Vector2d );

phoneItIn.formatters = phoneItIn.formatters || {};

phoneItIn.formatters.nanp = (function (my) {
  my.        digitizeAlpha =
    function digitizeAlpha( value )
  {
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

  my.      format =
  function format( value )
  {
    var FORMAT_PATTERN = /^[(]?(...)[)]?(...)-?(....)(.*)$/,
        digits = (value + '__________').replace( /\s/g, '' ).replace( FORMAT_PATTERN, '$1$2$3$4' );

    digits = digits.substring( 0, digits.length );
    digits = my.digitizeAlpha( digits );
    if( digits.length > 20 ) {
      digits = digits.substr( 0, digits.length - 10 );
    } else {
      digits = digits.substr( 0, 10 );
    }
    return digits.replace( FORMAT_PATTERN, '($1) $2-$3 $4' ).replace( / $/, '' );
  };

  my.        validityOf =
    function validityOf( value )
  {
    var formatted, digits;

    if( value.match(/[^-\dA-Za-z()\s]/) ) { return 'invalid'; }

    formatted = my.format( value );
    if( formatted.length > '(___) ___-____'.length ) { return 'invalid' }

    digits = formatted.replace( /^[(](...)[)] (...)-(....)$/, "$1$2$3" );
    if( digits.match(/[^\d_]/) ) { return 'invalid'; }
    if( formatted.match(/_/) ) { return 'partial'; }

    return 'complete';
  }

  return my;
})( phoneItIn.formatters.nanp || {} );

phoneItIn.domAdapters = phoneItIn.domAdapters || {};

phoneItIn.domAdapters.basicAdapter = (function ( my, document ) {
  my.        newElementAdapterFor =
    function newElementAdapterFor( domElement )
  {
    return domElement ? new my.Element( domElement ) : null;
  }

  my.        getElementById =
    function getElementById( id )
  {
    var el = document.getElementById( id );
    return my.newElementAdapterFor( el );
  }

  my.        createDiv =
    function createDiv()
  {
    var divEl = document.createElement('DIV')
    return my.newElementAdapterFor( divEl );
  }

  my.        inputsOfType =
    function inputsOfType( desiredType )
  {
    var i, input, type,
        inputs = document.getElementsByTagName('INPUT'),
        length = inputs.length,
        matchingInputs = [];

    for( i = 0; i < length; i++ ) {
      input = inputs[ i ];
      type = input.getAttribute('type');
      if ( type === desiredType ) {
        matchingInputs.push( my.newElementAdapterFor( input ) );
      }
    }

    return matchingInputs;
  }

  return my;
})( phoneItIn.domAdapters.basicAdapter || {}, document );

phoneItIn.domAdapters.basicAdapter.Element = (function () {
  var proto;

  function Element(domElement) {
    function getDomElement() {
      return domElement;
    }
    this.getDomElement = getDomElement;
  }
  proto = Element.prototype;

  proto.     setInnerHtml =
    function setInnerHtml( html )
  {
    this.getDomElement().innerHTML = html;
  }

  proto.     setClassName =
    function setClassName( className )
  {
    this.getDomElement().className = className;
  }

  proto.     setId =
    function setId( value )
  {
    this.getDomElement().id = value;
  }

  proto.     setStyle =
    function setStyle( value )
  {
    this.getDomElement().setAttribute( 'style', value );
  }

  proto.     addFocusListener =
    function addFocusListener( listener )
  {
    this.getDomElement().addEventListener( 'focus', listener );
  }

  proto.     addBlurListener =
    function addBlurListener( listener )
  {
    this.getDomElement().addEventListener( 'blur', listener );
  }

  proto.     addInputListener =
    function addInputListener( listener )
  {
    this.getDomElement().addEventListener( 'input', listener );
  }

  proto.     getValue =
    function getValue()
  {
    return this.getDomElement().value;
  }

  proto.     setValue =
    function setValue( newValue )
  {
    this.getDomElement().value = newValue;
  }

  proto.     insertNext =
    function insertNext( elementToInsert )
  {
    var domElementToInsert = elementToInsert.getDomElement(),
        parentEl = this.getDomElement().parentNode,
        priorNextSiblingEl = this.getDomElement().nextSibling;

    parentEl.insertBefore( domElementToInsert, priorNextSiblingEl );
  }

  proto.     remove =
    function remove()
  {
    var domElement = this.getDomElement(),
        parentEl = domElement.parentNode;

    parentEl.removeChild( domElement );
  }

  proto.     getOffsetBox =
    function getOffsetBox()
  {
    return new phoneItIn.pixelGeometry.Box2d(
      this.getDomElement().offsetLeft  , this.getDomElement().offsetTop    ,
      this.getDomElement().offsetWidth , this.getDomElement().offsetHeight
    );
  }

  return Element;
})();

phoneItIn.domAdapters.jQueryAdapter = (function ( my, window ) {
  function getJQuery() {
    return window.jQuery;
  }

  my.        newElementAdapterFor =
    function newElementAdapterFor( jQueryArgument )
  {
    var jQueryElement = getJQuery()(jQueryArgument);
    return jQueryArgument ? new my.Element( jQueryElement ) : null;
  }

  my.        getElementById =
    function getElementById( id )
  {
    var jqResult = getJQuery()('#' + id);
    if( jqResult.size() < 1 ) { return null; }
    return my.newElementAdapterFor( jqResult );
  }

  my.        createDiv =
    function createDiv()
  {
    return my.newElementAdapterFor('<div>');
  }

  my.        inputsOfType =
    function inputsOfType( type )
  {
    var jqResult = getJQuery()( 'input[type=' + type + ']' );
    return jqResult.map(
      function () { return my.newElementAdapterFor( this ); }
    ).toArray();
  }

  return my;
})( phoneItIn.domAdapters.jQueryAdapter || {}, window );

phoneItIn.domAdapters.jQueryAdapter.Element = (function ( pixelGeometry ) {
  var proto;

  function Element(jQueryElement) {
    function getJQueryElement() {
      return jQueryElement;
    }
    this.getJQueryElement = getJQueryElement;
  }
  proto = Element.prototype;

  proto.     getDomElement =
    function getDomElement()
  {
    return this.getJQueryElement()[0];
  }

  proto.     setInnerHtml =
    function setInnerHtml( html )
  {
    this.getJQueryElement().html( html );
  }

  proto.     setClassName =
    function setClassName( className )
  {
    this.getJQueryElement().attr( 'class', className );
  }

  proto.     setId =
    function setId( id )
  {
    this.getJQueryElement().attr( 'id', id );
  }

  proto.     setStyle =
    function setStyle( id )
  {
    this.getJQueryElement().attr( 'style', id );
  }

  proto.     addFocusListener =
    function addFocusListener( listener )
  {
    this.getJQueryElement().focus( listener );
  }

  proto.     addBlurListener =
    function addBlurListener( listener )
  {
    this.getJQueryElement().blur( listener );
  }

  proto.     addInputListener =
    function addInputListener( listener )
  {
    this.getJQueryElement().on( 'input', listener );
  }


  proto.     getValue =
    function getValue()
  {
    return this.getJQueryElement().val();
  }

  proto.     setValue =
    function setValue( value )
  {
    this.getJQueryElement().val( value );
  }

  proto.     insertNext =
    function insertNext( elementToInsert )
  {
    this.getJQueryElement().after( elementToInsert.getDomElement() );
  }

  proto.     remove =
    function remove()
  {
    this.getJQueryElement().detach();
  }

  proto.     getOffsetBox =
    function getOffsetBox()
  {
    var jqEl = this.getJQueryElement(),
        position = jqEl.position();

    return new pixelGeometry.Box2d(
      position.left  , position.top ,
      jqEl.outerWidth() , jqEl.outerHeight()
    );
  }

  return Element;
})( phoneItIn.pixelGeometry );
