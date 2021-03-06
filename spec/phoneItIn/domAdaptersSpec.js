describe( 'phoneItIn.domAdapters', function () {
  var domAdapters;

  beforeEach(function () {
    domAdapters = phoneItIn.domAdapters;
  });

  describeAdapter( 'basicAdapter'  );
  describeAdapter( 'jQueryAdapter' );

  function describeAdapter( adapterName ) {
    describe( '.' + adapterName, function () {
      var domAdapter, fixtureEl,
          exampleA, exampleB, exampleC,
          textInput, telInput1, telInput2;

      beforeEach(function () {
        domAdapter = domAdapters[adapterName];

        fixtureEl = document.createElement('DIV');
        fixtureEl.innerHTML =
          "<input id='ex-a' type='foo' />" +
          "<input id='ex-b' type='bar' />" +
          "<input id='ex-c' type='foo' />";

        document.body.appendChild( fixtureEl );

        exampleA = fooInput1 = fixtureEl.firstChild;
        exampleB = barInput  = fooInput1.nextSibling;
        exampleC = fooInput2 = fixtureEl.lastChild;
      });

      afterEach(function () {
        if( fixtureEl ) { document.body.removeChild( fixtureEl ); }
        fixtureEl = null;
      });

      describe( '.newElementAdapterFor()', function () {
        describe( "for a falsy value", function () {
          it( "returns null", function () {
            expect( domAdapter.newElementAdapterFor( null ) ).toBeNull();
            expect( domAdapter.newElementAdapterFor( undefined ) ).toBeNull();
          });
        });

        describe( "for a DOM element object", function () {
          it( "returns an adapter for the given DOM element", function () {
            var element = domAdapter.newElementAdapterFor( fixtureEl );
            expect( element.getDomElement() ).toEqual( fixtureEl );
          });
        });
      });

      describe( '.getElementById()', function () {
        describe( "when no matching element is in the document", function () {
          it( "returns null", function () {
            var found = domAdapter.getElementById('no-such-elmenent');
            expect( found ).toBeNull();
          });
        });

        describe( "when a matching element is in the document", function () {
          it( "returns an adapter for the element", function () {
            var found = domAdapter.getElementById('ex-b');
            expect( found.getDomElement() ).toEqual( exampleB );
          });
        });
      });

      describe( '.createDiv', function () {
        it( "creates a new div and returns an element adapter for it", function () {
          var divAdapter = domAdapter.createDiv(),
              domElement = divAdapter.getDomElement();

          expect( domElement.nodeName ).toEqual( 'DIV' );
          expect( domElement.parentNode ).toBeNull();
        });
      });

      describe( '.inputsOfType()', function () {
        it( "finds no elements of 'baz' type", function () {
          expect( domAdapter.inputsOfType( 'baz' ) ).toEqual( [] );
        });

        it( "finds both elements of 'foo' type", function () {
          foundInputsAdapters = domAdapter.inputsOfType( 'foo' );

          expect( foundInputsAdapters.length ).toEqual( 2 );
          expect( foundInputsAdapters[0].getDomElement() ).toEqual( fooInput1 );
          expect( foundInputsAdapters[1].getDomElement() ).toEqual( fooInput2 );
        });

        it( "finds the element of 'bar' type", function () {
          foundInputsAdapters = domAdapter.inputsOfType( 'bar' );

          expect( foundInputsAdapters.length ).toEqual( 1 );
          expect( foundInputsAdapters[0].getDomElement() ).toEqual( barInput );
        });
      });

      describe( '.Element', function() {
        var Element, fixtureEl, underlyingEl, element;

        beforeEach( function () {
          Element = domAdapter.Element;

          fixtureEl = document.createElement('DIV');
          fixtureEl.setAttribute( 'style', "position: relative;" );
          fixtureEl.innerHTML =
            "<input id='example' style='display:block; position:relative; border: solid 2px black; left:21px; top:23px; width:18px; height:14px;'> </input>";
          document.body.appendChild( fixtureEl );
          underlyingEl = fixtureEl.firstChild;

          element = domAdapter.newElementAdapterFor( underlyingEl );
        });

        afterEach(function() {
          if( fixtureEl ) {
            document.body.removeChild( fixtureEl );
          }
        });

        describe( '#getDomElement()', function () {
          it( "returns the underlying DOM object for the element", function() {
            expect( element.getDomElement() ).toEqual( underlyingEl );
          });
        });

        describe( '#setInnerHtml()', function () {
          it( "sets the underlying element's inner HTML", function () {
            element.setInnerHtml("<p>abc</p>");
            expect( underlyingEl.innerHTML ).toEqual("<p>abc</p>");
          });
        });

        describe( '#setClassName()', function () {
          it( "sets the underlying element's class name", function () {
            element.setClassName("exuberant");
            expect( underlyingEl.className ).toEqual("exuberant");
          });
        });

        describe( '#setId()', function () {
          it( "sets the underlying element's id", function () {
            element.setId("garlic");
            expect( underlyingEl.id ).toEqual("garlic");
          });
        });

        describe( '#setStyle()', function () {
          it( "sets the underlying element's style attribute", function () {
            element.setStyle("display: block; width: 10px; height: 11px;");
            expect( underlyingEl.getAttribute('style') ).toEqual("display: block; width: 10px; height: 11px;");
          });
        });

        describe ( "event handler binding", function() {
          var otherInputEl;

          beforeEach( function () {
            otherInputEl = document.createElement('button');
            fixtureEl.appendChild( otherInputEl );
          });

          describe ( '#addFocusListener()', function () {
            it( "adds a listener for a focus event", function () {
              var gotFocus = false;
              otherInputEl.focus();
              element.addFocusListener( function () { gotFocus  = true; } );
              underlyingEl.focus();
              expect( gotFocus ).toEqual( true );
            });
          });

          describe ( '#addBlurListener()', function () {
            it( "adds a listener for a blur event", function () {
              var lostFocus = false;
              underlyingEl.focus();
              element.addBlurListener( function () { lostFocus  = true; } );
              otherInputEl.focus();
              expect( lostFocus ).toEqual( true );
            });
          });

          describe ( '#addInputListener()', function () {
            it( "adds a listener for an input event", function () {
              var gotInput = false;
              underlyingEl.focus();
              element.addInputListener( function () { gotInput  = true; } );

              // The DOM 'input' event should fire only when input is changing
              // due to a user action (not script code), so can't be indirectly
              // triggered using JS. Must explicitly fire the 'input' event
              // instead.
              underlyingEl.dispatchEvent( new Event('input') );

              expect( gotInput ).toEqual( true );
            });
          });

          describe( '#doesSupportInputEvent()', function () {
            // Specs are expected to be run in modern browser that would
            // naturally support the input event, so there's no useful test
            // we can write for the false case.
            it( "returns true in any browser we would try to run specs in", function () {
              expect( element.doesSupportInputEvent() ).toEqual( true );
            });
          });
        });

        describe( '#getValue()', function () {
          it( "returns the underlying input element's value", function () {
            underlyingEl.value = 'cinnamon';
            expect( element.getValue() ).toEqual( 'cinnamon' );
          });
        });

        describe( '#boundGetValue()', function () {
          it( "gets the value when called as a function", function () {
            var boundGetValue = element.boundGetValue;
            underlyingEl.value = 'nutmeg';
            expect( boundGetValue() ).toEqual( 'nutmeg' );
          });
        });

        describe( '#setValue()', function () {
          it( "sets the underlying input element's value", function () {
            element.setValue( 'nutmeg' );
            expect( underlyingEl.value ).toEqual( 'nutmeg' );
          });
        });

        describe( '#insertNext()', function () {
          it( "inserts the given adapted element as the next sibling", function () {
            var newDomEl = document.createElement('DIV'),
                newElement = domAdapter.newElementAdapterFor( newDomEl );

            element.insertNext( newElement );
            expect( underlyingEl.nextSibling ).toEqual( newDomEl );
          });
        });

        describe( '#remove()', function () {
          it( "removes the underlying element from its context", function () {
            element.remove();
            expect( document.getElementById('example') ).toBeNull();
          });
        });

        describe( '#getOffsetBox()', function () {
          it( "returns the underlying element's offset location/size in pixels as a 2d box", function () {
            expect( element.getOffsetBox() ).toEqual(
              new phoneItIn.pixelGeometry.Box2d( 21, 23, 22, 20 )
            );
          });
        });
      });
    });
  }

});
