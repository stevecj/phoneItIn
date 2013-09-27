describe( 'phoneItIn.ChangeDetector', function () {
  var ChangeDetector, value, getValue, listener, strobe, createStrobe, detector;

  beforeEach( function () {
    ChangeDetector = phoneItIn.ChangeDetector;
    getValue = function () { return value; };
    listener = jasmine.createSpy('listener');
    strobe = {
      start : jasmine.createSpy( 'start' ) ,
      stop  : jasmine.createSpy( 'stop'  )
    };
    createStrobe = jasmine.createSpy('createStrobe').andReturn( strobe );
    detector = ChangeDetector.create( getValue, listener, {createStrobe: createStrobe} );
  });

  it( "should have a strobe to call its #poll method", function () {
    expect( createStrobe ).toHaveBeenCalledWith( detector.poll, jasmine.any(Number) );
  });

  describe( "when started", function () {
    beforeEach( function () {
      detector.start();
    });

    it( "calls the listener", function () {
      expect( listener ).toHaveBeenCalled();
    });

    it( "starts the strobe", function () {
      expect( strobe.start ).toHaveBeenCalled();
    });

    describe( "and then stopped", function () {
      it( "stops the strobe", function () {
        detector.stop();
        expect( strobe.stop ).toHaveBeenCalled();
      });
    });
  });

  describe( "when started", function () {
    beforeEach( function () {
      value = 'initial';
      detector.start();
      // Sanity check.
      expect( listener.calls.length ).toEqual( 1 );
    });

    describe( "and polled with no change since initial value", function () {
      it( "should not call the listener", function () {
        detector.poll();
        expect( listener.calls.length ).toBeLessThan( 2 );
      });
    });

    describe( "and polled with a change from the initial value", function () {
      it( "should call the listener", function () {
        value = 'new';
        detector.poll();
        expect( listener.calls.length ).toEqual( 2 );
      });
    });

    describe( "and polled with a change from value at previous poll", function () {
      it( "should call the listener", function () {
        var prevListenerCallCount;

        value = 'new';
        detector.poll();
        prevListenerCallCount = listener.calls.length;

        value = "initial";
        detector.poll();
        expect( listener.calls.length - prevListenerCallCount ).toEqual( 1 );
      });
    });
  });
});
