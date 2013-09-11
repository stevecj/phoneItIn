describe( 'phoneItIn', function () {

  describe( '.UI', function () {
    var ui, domAdapter, telInput1, telInput2;

    beforeEach(function () {
      telInput1 = { addEventListener: function() { } };
      telInput2 = { addEventListener: function() { } };

      spyOn( telInput1, 'addEventListener' );
      spyOn( telInput2, 'addEventListener' );

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
        expect( telInput1.addEventListener ).toHaveBeenCalledWith( 'focus', jasmine.any(Function) );
        expect( domAdapter.newElementAdapterFor ).toHaveBeenCalledWith( domTelInput1 );
      });
    });

    describe( '#bindToTelInputs', function () {
      it( "binds to all 'tel' inputs on the page", function () {
        spyOn( domAdapter, 'inputsOfType' ).andReturn([ telInput1, telInput2 ]);
        ui.bindToTelInputs();
        expect( domAdapter.inputsOfType ).toHaveBeenCalledWith( 'tel' );
        expect( telInput1.addEventListener ).toHaveBeenCalledWith( 'focus', jasmine.any(Function) );
        expect( telInput2.addEventListener ).toHaveBeenCalledWith( 'focus', jasmine.any(Function) );
      });
    });
  });
});
