describe( 'phoneItIn.pixelGeometry', function () {
  var pixelGeometry;

  beforeEach(function () {
    pixelGeometry = phoneItIn.pixelGeometry;
  });

  describe( '.Vector2d', function () {
    var Vector2d;

    beforeEach(function () {
      Vector2d = pixelGeometry.Vector2d;
    });

    describe( "construction", function () {
      it( "initializes 'h' and 'v' attributes", function () {
        vect = new Vector2d( 10, 15 );
        expect( vect.h ).toEqual( 10 );
        expect( vect.v ).toEqual( 15 );
      });
    });

    describe( '#getTopLeftStyle()', function() {
      it( "returns CSS style text for top/left position in pixel units", function () {
        vect = new Vector2d( 15, 17 );
        styleText = vect.getTopLeftStyle();
        expect( styleText.replace( /\s/g, '' ) ).toEqual( 'top:17px;left:15px;' );
      });
    });
  });

  describe( '.Box2d', function () {
    var Box2d;

    beforeEach(function () {
      Box2d = pixelGeometry.Box2d;
    });

    describe( "construction", function () {
      it( "initializes position and size vectors", function () {
        box = new Box2d( 11, 14, 6, 5 );
        expect( box.topLeft ).toEqual( new pixelGeometry.Vector2d( 11, 14 ) );
        expect( box.size    ).toEqual( new pixelGeometry.Vector2d(  6,  5 ) );
      });
    });

    describe( '#below()', function () {
      it( "returns a vector for the top-left position immediately below", function() {
        box = new Box2d( 9, 12, 6, 5 );
        expect( box.below() ).toEqual( new pixelGeometry.Vector2d( 9, 17 ) );
      });
    });
  });
});
