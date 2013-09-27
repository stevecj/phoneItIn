describe( 'phoneItIn', function () {

  describe( '.UI', function () {
    var ui, domAdapter, telInput1, telInput2, actsAsLiveChangeSource;

    beforeEach(function () {
      function TelInput() {
        this.addFocusListener      = jasmine.createSpy( 'addFocusListener'      );
        this.addBlurListener       = jasmine.createSpy( 'addBlurListener'       );
        this.addLiveChangeListener = jasmine.createSpy( 'addLiveChangeListener' );
      }
      telInput1 = new TelInput();
      telInput2 = new TelInput();

      domAdapter = {
        inputsOfType         : function () { } ,
        newElementAdapterFor : function () { }
      };

      actsAsLiveChangeSource = {
        extendElementAdapter: jasmine.createSpy('extendElementAdapter')
      };
      ui = new phoneItIn.UI( domAdapter, actsAsLiveChangeSource );
    });

    describe( '#bindToInput', function () {
      it( "binds to the given input element", function () {
        var domTelInput1 = {};
        spyOn( domAdapter, 'newElementAdapterFor' ).andReturn( telInput1 );
        ui.bindToInput( domTelInput1 );
        expect( actsAsLiveChangeSource.extendElementAdapter ).toHaveBeenCalledWith( telInput1 );
        expect( telInput1.addLiveChangeListener ).toHaveBeenCalledWith( jasmine.any(Function) );
        expect( domAdapter.newElementAdapterFor ).toHaveBeenCalledWith( domTelInput1 );
      });
    });

    describe( '#bindToTelInputs', function () {
      it( "binds to all 'tel' inputs on the page", function () {
        spyOn( domAdapter, 'inputsOfType' ).andReturn([ telInput1, telInput2 ]);
        ui.bindToTelInputs();
        expect( domAdapter.inputsOfType ).toHaveBeenCalledWith( 'tel' );
        // TODO: Stop redundantly testing shared functionality. Extract
        //       implementation to somewhere we can test it in isolation.
        expect( actsAsLiveChangeSource.extendElementAdapter ).toHaveBeenCalledWith( telInput1 );
        expect( actsAsLiveChangeSource.extendElementAdapter ).toHaveBeenCalledWith( telInput2 );
        expect( telInput1.addFocusListener ).toHaveBeenCalledWith( jasmine.any(Function) );
        expect( telInput2.addFocusListener ).toHaveBeenCalledWith( jasmine.any(Function) );
      });
    });
  });
});
