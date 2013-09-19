describe( 'phoneItIn', function () {

  describe( '.UI', function () {
    var ui, domAdapter, telInput1, telInput2;

    beforeEach(function () {
      function TelInput() {
        this.addFocusListener = jasmine.createSpy( 'addFocusListener' );
        this.addBlurListener  = jasmine.createSpy( 'addBlurListener'  );
        this.addInputListener = jasmine.createSpy( 'addInputListener' );
      }
      telInput1 = new TelInput();
      telInput2 = new TelInput();

      domAdapter = {
        inputsOfType         : function () { } ,
        newElementAdapterFor : function () { }
      };
      ui = new phoneItIn.UI( domAdapter );
    });

    describe( '#bindToInput', function () {
      it( "binds to the given input element", function () {
        var domTelInput1 = {};
        spyOn( domAdapter, 'newElementAdapterFor' ).andReturn( telInput1 );
        ui.bindToInput( domTelInput1 );
        expect( telInput1.addFocusListener ).toHaveBeenCalledWith( jasmine.any(Function) );
        expect( domAdapter.newElementAdapterFor ).toHaveBeenCalledWith( domTelInput1 );
      });
    });

    describe( '#bindToTelInputs', function () {
      it( "binds to all 'tel' inputs on the page", function () {
        spyOn( domAdapter, 'inputsOfType' ).andReturn([ telInput1, telInput2 ]);
        ui.bindToTelInputs();
        expect( domAdapter.inputsOfType ).toHaveBeenCalledWith( 'tel' );
        expect( telInput1.addFocusListener ).toHaveBeenCalledWith( jasmine.any(Function) );
        expect( telInput2.addFocusListener ).toHaveBeenCalledWith( jasmine.any(Function) );
      });
    });
  });
});
