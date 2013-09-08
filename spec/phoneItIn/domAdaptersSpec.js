describe( 'phoneItIn.domAdapters', function () {
  var domAdapters;

  beforeEach(function () {
    domAdapters = phoneItIn.domAdapters;
  });

  describe( '.basicAdapter', function () {
    var basic, fixtureEl,
        exampleA, exampleB, exampleC,
        textInput, telInput1, telInput2;

    beforeEach(function () {
      basicAdapter = domAdapters.basicAdapter;

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

    describe( '.getElementById', function () {
      describe( "when no matching element is in the document", function () {
        it( "returns null", function () {
          var found = basicAdapter.getElementById('no-such-elmenent');
          expect( found ).toBeNull();
        });
      });

      describe( "when a matching element is in the document", function () {
        it( "returns an adapter for the element", function () {
          var found = basicAdapter.getElementById('ex-b');
          expect( found.domElement ).toEqual( exampleB );
        });
      });
    });

    describe( '.createDiv', function () {
      it( "creates a new div and returns an element adapter for it", function () {
        var divAdapter = basicAdapter.createDiv(),
            domElement = divAdapter.domElement;

        expect( domElement.nodeName ).toEqual( 'DIV' );
        expect( domElement.parentNode ).toBeNull();
      });
    });

    describe( '.inputsOfType()', function () {
      it( "finds no elements of 'baz' type", function () {
        expect( basicAdapter.inputsOfType( 'baz' ) ).toEqual( [] );
      });

      it( "finds both elements of 'foo' type", function () {
        expect(
          basicAdapter.inputsOfType( 'foo' )
        ).toEqual(
          [ fooInput1, fooInput2 ]
        );
      });

      it( "finds the element of 'bar' type", function () {
        expect(
          basicAdapter.inputsOfType( 'bar' )
        ).toEqual(
          [ barInput ]
        );
      });
    });

    describe( '.Element', function() {
      var Element, fixtureEl, underlyingEl, element;

      beforeEach( function () {
        Element = basicAdapter.Element;

        fixtureEl = document.createElement('DIV');
        fixtureEl.setAttribute( 'style', "position: relative;" );
        fixtureEl.innerHTML =
          "<div style='position:relative; left:21px; top:23px; width:18px; height:10px;'> </div>";
        document.body.appendChild( fixtureEl );
        underlyingEl = fixtureEl.firstChild;

        element = new Element( underlyingEl );
      });

      afterEach(function() {
        if( fixtureEl ) {
          document.body.removeChild( fixtureEl );
        }
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

      describe( '#getOffsetBox()', function () {
        it( "returns the underlying element's offset location/size in pixels as a 2d box", function () {
          expect( element.getOffsetBox() ).toEqual(
            new phoneItIn.pixelGeometry.Box2d( 21, 23, 18, 10 )
          );
        });
      });
    });
  });
});
