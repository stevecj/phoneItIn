// This is an approximation of an AAT feature spec constructed
// as a regular Jasmine spec. Each "step" is represented by a
// level of nesting.

describe('PhoneItIn', function(){
  var specDriver;

  beforeEach(function(){
    specDriver = new PhoneItInUIDriver();
  });

  afterEach(function(){
    specDriver.teardown();
    specDriver = null;
  });

  describe("Given some populated inputs,", function(){

    beforeEach(function(){
      specDriver.createPopulatedInputs();
    });

    describe("and the second input is phone-help enabled,", function(){

      beforeEach(function(){
        specDriver.enablePhoneHelpForInput(2);
      });

      describe("when the user navigates to the phone-enabled input,", function(){

        beforeEach(function(){
          specDriver.navigateToInput(2);
        });

        it("displays phone entry help for the current input", function(){
          expect( specDriver.isPhoneEntryHelpDisplayedForInput(2) ).toEqual( true );
        });
      });
    });
  });
});
