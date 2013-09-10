describe( 'phoneItIn', function () {

  describe( '.UI', function () {
    var ui, fixtureEl, textInput, telInput1, telInput2;

    beforeEach(function () {
      ui = phoneItIn.UI.getNewInstance();

      fixtureEl = document.createElement('DIV');
      fixtureEl.innerHTML =
        "<input type='text' /><input type='tel' /><input type='tel' />";

      document.body.appendChild( fixtureEl );

      textInput = fixtureEl.firstChild;
      telInput1 = textInput.nextSibling;
      telInput2 = fixtureEl.lastChild;

      spyOn( textInput, 'addEventListener' );
      spyOn( telInput1, 'addEventListener' );
      spyOn( telInput2, 'addEventListener' );
    });

    afterEach(function () {
      if( fixtureEl ) { document.body.removeChild( fixtureEl ); }
      fixtureEl = null;
    });

    describe( '#bindToTelInputs', function () {
      it( "binds to all 'tel' inputs on the page", function () {
        ui.bindToTelInputs();
        expect( telInput1.addEventListener ).toHaveBeenCalledWith( 'focus', jasmine.any(Function) );
        expect( telInput2.addEventListener ).toHaveBeenCalledWith( 'focus', jasmine.any(Function) );
      });

      it( "does not bind to inputs other than 'tel' type", function () {
        ui.bindToTelInputs();
        expect( textInput.addEventListener ).not.toHaveBeenCalled();
      });
    });
  });
});

// This is an approximation of an AAT feature spec constructed
// within a regular Jasmine spec. Each "step" is represented by a
// level of nesting.

describe( "phoneItIn features", function () {
  var specDriver;

  beforeEach(function () {
    specDriver = new phoneItInDrivers.Browser();
  });

  afterEach(function () {
    specDriver.teardown();
    specDriver = null;
  });

  describe( "Given some inputs,", function () {
    beforeEach(function () {
      specDriver.createInputs();
    });

    describe( "and the second input is phone-help enabled,", function () {
      beforeEach(function () {
        specDriver.enablePhoneHelpForInput( 2 );
      });

      describe( "and the second input has an unformatted phone # value", function () {
        beforeEach(function () {
          specDriver.putUnformattedPhoneNumValueIntoInput( 2 );
        });

        describe( "when the user navigates to the phone-enabled input,", function () {
          beforeEach(function () {
            specDriver.navigateToInput( 2 );
          });

          it( "displays formatted phone # entry help for the input", function () {
            specDriver.assertPhoneEntryHelpDisplayedForInput( 2 );
          });
        });
      });

      describe( "and the second input has the focus", function () {
        beforeEach(function () {
          specDriver.navigateToInput( 2 );
        });

        describe( "when the user enters a complete unformatted phone number", function () {
          beforeEach(function () {
            specDriver.enterCompleteUnformattedPhoneNumber();
          });

          it( "indicates that the value is complete", function () {
            specDriver.assertInputCompletenessIndicated();
          });

          describe( "and the focus moves away from the input", function () {
            beforeEach(function () {
              specDriver.navigateFromInput();
            });

            it( "formats the input's value in place", function () {
              specDriver.assertFormattedValueInInput( 2 );
            });

            it( "does not display formatted phone # entry help for the input", function () {
              specDriver.assertNoPhoneEntryShownForPriorInput();
            });
          });
        });

        describe( "when the user enters a partial unformatted phone number", function () {
          beforeEach(function () {
            specDriver.enterPartialUnformattedPhoneNumber();
          });

          it( "displays formatted phone number entry help for the partial value", function () {
            specDriver.assertPhoneEntryHelpDisplayedForInput();
          });

          it( "does not indicate that the value is complete", function () {
            specDriver.assertInputCompletenessNotIndicated();
          });

          it( "does not indicate that the value is invalid", function () {
            specDriver.assertInputInvalidityNotIndicated();
          });
        });
      })
    });
  });
});
