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

var phoneItIn = phoneItIn || {};

phoneItIn.formatters = phoneItIn.formatters || {};

phoneItIn.formatters.nanp = (function (my) {
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
  my.format = format;

  function validityOf( value ) {
    var formatted, digits;

    if( value.match(/[^-\dA-Za-z()\s]/) ) { return 'invalid'; }

    formatted = format( value );
    if( formatted.length > '(___) ___-____'.length ) { return 'invalid' }

    digits = formatted.replace( /^[(](...)[)] (...)-(....)$/, "$1$2$3" );
    if( digits.match(/[^\d_]/) ) { return 'invalid'; }
    if( formatted.match(/_/) ) { return 'partial'; }

    return 'complete';
  }
  my.validityOf = validityOf;

  return my;
})( phoneItIn.formatters.nanp || {} );

phoneItIn.pixelGeometry = phoneItIn.pixelGeometry || {};

phoneItIn.pixelGeometry.Vector2d = (function () {
  function Vector2d( h, v ) {
    this.h = h;
    this.v = v;
  }
  Vector2d.prototype = {};

  function getTopLeftStyle() {
    return "top: "  + this.v + "px; " +
           "left: " + this.h + "px;"
  }
  Vector2d.prototype.getTopLeftStyle = getTopLeftStyle;

  return Vector2d;
})();

phoneItIn.pixelGeometry.Box2d = (function ( Vector2d ) {
  function Box2d( l, t, w, h ) {
    this.topLeft = new Vector2d( l, t );
    this.size    = new Vector2d( w, h );
  }
  Box2d.prototype = {};

  function below() {
    var topLeft= this.topLeft;
    return new Vector2d( topLeft.h, topLeft.v + this.size.v );
  }
  Box2d.prototype.below = below;

  return Box2d;
})( phoneItIn.pixelGeometry.Vector2d );

phoneItIn.domAdapters = phoneItIn.domAdapters || {};

phoneItIn.domAdapters.basicAdapter = (function ( my, document ) {
  function getElementById( id ) {
    var el = document.getElementById( id );
    return el ? new my.Element( el ) : null;
  }
  my.getElementById = getElementById;

  function createDiv() {
    var divEl = document.createElement('DIV')
    return new my.Element( divEl );
  }
  my.createDiv = createDiv;

  function inputsOfType( desiredType ) {
    var i, input, type,
        inputs = document.getElementsByTagName('INPUT'),
        length = inputs.length,
        telInputs = [];

    for( i = 0; i < length; i++ ) {
      input = inputs[ i ];
      type = input.getAttribute('type');
      if ( type === desiredType ) {
        telInputs.push( input );
      }
    }

    return telInputs;
  }
  my.inputsOfType = inputsOfType;

  return my;
})( phoneItIn.domAdapters.basicAdapter || {}, document );

phoneItIn.domAdapters.basicAdapter.Element = (function () {
  function Element(domElement) {
    this.domElement = domElement;
  }
  Element.prototype = {};

  function setInnerHtml( html ) {
    this.domElement.innerHTML = html;
  }
  Element.prototype.setInnerHtml = setInnerHtml;

  function setClassName( className ) {
    this.domElement.className = className;
  }
  Element.prototype.setClassName = setClassName;

  function setId( value ) {
    this.domElement.id = value;
  }
  Element.prototype.setId = setId;

  function setStyle( value ) {
    this.domElement.setAttribute( 'style', value );
  }
  Element.prototype.setStyle = setStyle;

  function addEventListener( eventName, listener ) {
    this.domElement.addEventListener( eventName, listener );
  }
  Element.prototype.addEventListener = addEventListener;

  function getValue() {
    return this.domElement.value;
  }
  Element.prototype.getValue = getValue;

  function setValue( newValue ) {
    this.domElement.value = newValue;
  }
  Element.prototype.setValue = setValue;

  function insertNext( elementToInsert ) {
    var domElementToInsert = elementToInsert.domElement,
        parentEl = this.domElement.parentNode,
        priorNextSiblingEl = this.domElement.nextSibling;

    parentEl.insertBefore( domElementToInsert, priorNextSiblingEl );
  }
  Element.prototype.insertNext = insertNext;

  function remove() {
    var domElement = this.domElement,
        parentEl = domElement.parentNode;

    parentEl.removeChild( domElement );
  }
  Element.prototype.remove = remove;

  function getOffsetBox() {
    return new phoneItIn.pixelGeometry.Box2d(
      this.domElement.offsetLeft  , this.domElement.offsetTop    ,
      this.domElement.offsetWidth , this.domElement.offsetHeight
    );
  }
  Element.prototype.getOffsetBox = getOffsetBox;

  return Element;
})();

phoneItIn.UI = (function ( domAdapter, formatter ) {
  function UI() { }
  UI.prototype = {};

  function addHelpToInput( input ) {
    var help = domAdapter.createDiv(),
        inputOffsetBox = input.getOffsetBox(),
        helpTopLeft = inputOffsetBox.below();

    help.setId( 'phin-help' );
    help.setStyle( "position:absolute; " + helpTopLeft.getTopLeftStyle() );
    help.setInnerHtml( "<div id='phin-help-inner'></div>" );
    input.insertNext( help );
    updateHelpForInput( input );
  }

  function updateHelpForInput( input ) {
    var VALIDITY_CLASS_MAP = {
          partial  : ''              ,
          invalid  : 'phin-invalid'  ,
          complete : 'phin-complete'
        },
        formattedValue = formatter.format( input.getValue() ),
        validity = formatter.validityOf( input.getValue() ),
        help = domAdapter.getElementById( 'phin-help' ),
        helpInner = domAdapter.getElementById( 'phin-help-inner' );

    helpInner.setInnerHtml( formattedValue );
    help.setClassName( VALIDITY_CLASS_MAP[ validity ] );
  }

  function removeHelp() {
    var help = domAdapter.getElementById('phin-help');
    if( help ){ help.remove(); }
  }

  function formatValueOfInput( input ) {
    var value = input.getValue();

    if ( formatter.validityOf( value ) === 'complete' ) {
      input.setValue( formatter.format( value ) );
    }
  }

  function bindToInput( inputDomElement ) {
    var input = new domAdapter.Element( inputDomElement );

    input.addEventListener( 'focus' , function(){ addHelpToInput( input );     } );
    input.addEventListener( 'blur'  , function(){ formatValueOfInput( input ); } );
    input.addEventListener( 'blur'  , function(){ removeHelp();                } );
    input.addEventListener( 'input' , function(){ updateHelpForInput( input ); } );
  }
  UI.prototype.bindToInput = bindToInput;

  function bindToTelInputs() {
    var i, input, type,
        inputs = domAdapter.inputsOfType( 'tel' ),
        length = inputs.length;

    for( i = 0; i < length; i++ ) {
      this.bindToInput( inputs[i] );
    }
  }
  UI.prototype.bindToTelInputs = bindToTelInputs;

  return UI;
})( phoneItIn.domAdapters.basicAdapter, phoneItIn.formatters.nanp );

phoneItIn = (function ( my ) {
  var ui;

  function getUi() {
    ui = ui || new my.UI();
    return ui;
  }

  function setupForTelInputs() {
    getUi().bindToTelInputs();
  }
  my.setupForTelInputs = setupForTelInputs;

  return my;
})( phoneItIn );
