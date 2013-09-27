describe( 'phoneItIn.actsAsLiveChangeSource', function () {
  var actsAsLiveChangeSource, elementAdapter, listener, focusListener, blurListener;

  beforeEach( function () {
    actsAsLiveChangeSource = phoneItIn.actsAsLiveChangeSource;

    elementAdapter = {
      addInputListener : jasmine.createSpy('addInputListener') ,
      addFocusListener : function ( l ) { focusListener = l } ,
      addBlurListener  : function ( l ) { blurListener  = l }
    };

    listener = jasmine.createSpy('listener');
  });

  describe( "component behavior", function() {
    describe( '.extendElementAdapter()', function () {
      it( "adds .addLiveChangeListener() to an element adapter instance", function () {
        actsAsLiveChangeSource.extendElementAdapter( elementAdapter );
        expect( elementAdapter.addLiveChangeListener ).toEqual( jasmine.any(Function) );
      });
    });
  });

  describe( '.Extender', function () {
    var Extender, createEventBinding, extender;

    beforeEach( function () {
      Extender = actsAsLiveChangeSource.Extender;
      createEventBinding = jasmine.createSpy('createEventBinding');
      extender = new Extender( createEventBinding );
    });

    describe( "an element adapter extended via #extend()", function () {
      beforeEach( function () {
        extender.extend( elementAdapter );
      });

      describe( '.addLiveChangeListener()', function () {
        describe( "for an adapter that supports the input event", function () {
          beforeEach( function () {
            elementAdapter.doesSupportInputEvent = function () { return true; }
          });

          it( "delegates to .addInputListener()", function () {
            elementAdapter.addLiveChangeListener( listener );
            expect( elementAdapter.addInputListener ).toHaveBeenCalledWith( listener );
          });
        });

        describe( "for an adapter that does not support the input event", function () {
          beforeEach( function () {
            elementAdapter.doesSupportInputEvent = function () { return false; }
          });

          it( "creates an EventBinding from the element adapter to the listener", function() {
            elementAdapter.addLiveChangeListener( listener );
            expect( createEventBinding ).toHaveBeenCalledWith( elementAdapter, listener, phoneItIn.ChangeDetector.create );
          });
        });
      });
    });
  });

  describe( '.EventBinding', function () {
    var EventBinding, changeDetector, createChangeDetector;

    beforeEach( function () {
      EventBinding = actsAsLiveChangeSource.EventBinding;
      changeDetector = {
        start : jasmine.createSpy( 'start' ) ,
        stop  : jasmine.createSpy( 'stop'  )
      };
      createChangeDetector = jasmine.createSpy('createChangeDetector').andReturn( changeDetector );
    });

    describe( "instantiation", function () {
      it( "creates a detector to call the listener when the element value changes", function () {
        EventBinding.create( elementAdapter, listener, createChangeDetector );
        expect( createChangeDetector ).toHaveBeenCalledWith( elementAdapter.boundGetValue, listener );
      });
    });

    describe( "an instance", function () {
      var eventBinding;

      beforeEach( function () {
        eventBinding = new EventBinding( elementAdapter, listener, createChangeDetector );
      });

      it( "starts the change detector when the element receives the focus", function () {
        focusListener();
        expect( changeDetector.start ).toHaveBeenCalled();
      });

      it( "stops the change detector when the element loses the focus", function () {
        blurListener();
        expect( changeDetector.stop ).toHaveBeenCalled();
      });
    });
  });
});
