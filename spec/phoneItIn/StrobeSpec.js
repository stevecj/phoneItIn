describe( 'Strobe', function () {
  var strobe,
      Strobe = phoneItIn.Strobe;

  afterEach( function () {
    if ( strobe && strobe.stop ) {
      strobe.stop();
    }
    strobe = null;
  });

  describe( '.create', function() {
    it( "creates a new Strobe instance when invoked as a function", function () {
      var create = Strobe.create;
      strobe = create( function () { }, 1 );
      expect( strobe.constructor ).toEqual( Strobe );
    });
  });

  describe( '#start()', function () {
    it( "does not call the listener before 1 interval has elapsed", function () {
      var callCount = 0;

      strobe = Strobe.create( function () {
        callCount += 1;
      }, 75 );

      strobe.start()
      expect( callCount ).toEqual( 0 );
    });

    it( "starts calling the listener once per interval", function () {
      var callCount = 0;

      strobe = Strobe.create( function () {
        callCount += 1;
      }, 75 );

      jasmine.Clock.useMock();

      strobe.start();
      jasmine.Clock.tick( 188 );

      expect( callCount ).toEqual( 2 );
    });
  });

  describe( '#stop()', function() {
    it( "ceases calling the listener", function() {
      var callCount = 0;

      strobe = Strobe.create( function () {
        callCount += 1;
      }, 100 );

      jasmine.Clock.useMock();

      strobe.start();
      jasmine.Clock.tick( 101 );
      strobe.stop();
      jasmine.Clock.tick( 500 );

      expect( callCount ).toEqual( 1 );
    });
  });
});
