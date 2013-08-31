var phoneItInDrivers = phoneItInDrivers || {};

phoneItInDrivers.Browser = (function ( document, UI ) {
  function Browser() {
    var fixtureEl, inputs, currentInputNum, priorInputNum, ui,
        my          = {} ,
        mentalModel = {} ;

    function teardown() {
      if ( fixtureEl ) {
        document.body.removeChild( fixtureEl );
      }
      fixtureEl = null;
    }
    this.teardown = teardown;

    function getUi() {
      return ui = ui || new UI();
    }

    function getFixtureEl() {
      if ( ! fixtureEl ) {
        fixtureEl = document.createElement('DIV');
        document.body.appendChild( fixtureEl );
      }
      return fixtureEl;
    }

    function createInputs() {
      var vitro = document.createElement('DIV')

      vitro.innerHTML =
        "<input type='text' />" +
        "<input type='text' />";
      inputs = [ vitro.firstChild, vitro.lastChild ];
      getFixtureEl().appendChild( inputs[ 0 ] );
      getFixtureEl().appendChild( inputs[ 1 ] );
      mentalModel.inputs = [
        { value: undefined, formattedVal: undefined } ,
        { value: undefined, formattedVal: undefined }
      ];
    }
    this.createInputs = createInputs;

    function getInputByNum( inputNum ) {
      return inputs[ inputNum - 1 ];
    }

    function putUnformattedPhoneNumValueIntoInput( inputNum ) {
      var unformatted = '5313456789'     ,
          formatted   = '(531) 345-6789' ;

      getInputByNum( inputNum ).value = unformatted;

      var inputMM = mentalModel.inputs[ inputNum - 1 ];
      inputMM.value        = unformatted ;
      inputMM.formattedVal = formatted   ;
    }
    this.putUnformattedPhoneNumValueIntoInput = putUnformattedPhoneNumValueIntoInput;

    function navigateToInput( inputNum ) {
      priorInputNum = currentInputNum;
      getInputByNum( inputNum ).focus();
      currentInputNum = inputNum;
    }
    this.navigateToInput = navigateToInput;

    function navigateFromInput() {
      var toInputNum = ( currentInputNum % inputs.length ) + 1;
      navigateToInput( toInputNum );
    }
    this.navigateFromInput = navigateFromInput;

    function enablePhoneHelpForInput( inputNum ) {
      var input = getInputByNum( inputNum );
      getUi().bindToInput( input );
    }
    this.enablePhoneHelpForInput = enablePhoneHelpForInput;

    function enterUnformattedPhoneNumber() {
      var unformatted = '3212345678'     ,
          formatted   = '(321) 234-5678' ;

      getInputByNum( currentInputNum ).value = unformatted;

      mmInput = mentalModel.inputs[ currentInputNum -1 ];
      mmInput.value        = unformatted ;
      mmInput.formattedVal = formatted   ;
    }
    this.enterUnformattedPhoneNumber = enterUnformattedPhoneNumber;

    function assertPhoneEntryHelpDisplayedForInput( inputNum ) {
      if ( ! inputNum ) { inputNum = currentInputNum; }

      helpEl = document.getElementById('phin-help');
      if ( ! helpEl ) {
        throw "Phone help element not found";
      }
      var input = getInputByNum( inputNum );
      if ( ! helpEl.previousSibling == input ) {
        throw "Phone help element not next sibling of input";
      }
      var formattedValue = mentalModel.inputs[ inputNum - 1 ].formattedVal ;
      var helpContent = helpEl.innerHTML;
      if ( helpContent.indexOf( formattedValue ) < 0 ){
        throw 'Phone help expected to contain "' + formattedValue + '", but was "' + helpContent + '".';
      }
      return true;
    }
    this.assertPhoneEntryHelpDisplayedForInput = assertPhoneEntryHelpDisplayedForInput;

    function assertNoPhoneEntryShownForPriorInput() {
      inputEl = getInputByNum( priorInputNum );
      potentialHelpEl = inputEl.nextSibling;
      if ( potentialHelpEl && potentialHelpEl.getAttribute('id') === 'phin-help' ) {
        throw "Expected input not to have formatted phone entry help, but does have it.";
      }
    }
    this.assertNoPhoneEntryShownForPriorInput = assertNoPhoneEntryShownForPriorInput;

    function assertFormattedValueInInput( inputNum ) {
      mmInput = mentalModel.inputs[ inputNum - 1 ];
      mmInput.value = mmInput.formattedVal;

      currentValue = getInputByNum( inputNum ).value;

      if ( ! ( currentValue === mmInput.value ) ) {
        throw 'Expected current input value to be "' + mmInput.value + '", but was "' + currentValue + '".';
      }
    }
    this.assertFormattedValueInInput = assertFormattedValueInInput;
  }

  return Browser
})( document, phoneItIn.UI );
