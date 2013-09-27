describe( 'phoneItIn.objectInstantiation', function () {
  var objectInstantiation;

  beforeEach( function () {
    objectInstantiation = phoneItIn.objectInstantiation;
  });

  describe( "the function returned by .makeCreatorFunction(Something)", function () {
    var Something, createSomething;

    beforeEach( function () {
      Something = function ( weight, color ) {
        this.weight = weight;
        this.color  = color;
      };
      createSomething = objectInstantiation.makeCreatorFunction( Something );
    });

    it( "constructs an instance of Something()", function () {
      something = createSomething( );
      expect( something ).toEqual( jasmine.any(Something) );
    });

    it( "initializes the instance using the given arguments", function () {
      something = createSomething( '10 lbs', 'blue' );
      expect( something.weight ).toEqual( '10 lbs' );
      expect( something.color  ).toEqual( 'blue'   );
    });
  });
});
