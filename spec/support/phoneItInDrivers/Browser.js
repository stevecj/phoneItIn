var phoneItInDrivers = phoneItInDrivers || {};
phoneItInDrivers.browser = {};

phoneItInDrivers.Browser = (function ( browser, document, UI ) {
  function Browser() {
    var fixtureEl, inputs, currentInput, priorInput, ui;

    this.      teardown =
      function teardown()
    {
      if ( fixtureEl ) {
        document.body.removeChild( fixtureEl );
      }
      fixtureEl = null;
    }

    function getUi() {
      ui = ui || UI.getNewInstance();
      return ui;
    }

    function getFixtureEl() {
      if ( ! fixtureEl ) {
        fixtureEl = document.createElement('DIV');
        document.body.appendChild( fixtureEl );
      }
      return fixtureEl;
    }

    this.      createInputs =
      function createInputs()
    {
      inputs = [
        new browser.Input( getFixtureEl(), 1 ) ,
        new browser.Input( getFixtureEl(), 2 )
      ];
    }

    function getInputByNum( inputNum ) {
      return inputs[ inputNum - 1 ];
    }

    function findPhoneHelpElement() {
      return document.getElementById('phin-help');
    }

    this.      putUnformattedPhoneNumValueIntoInput =
      function putUnformattedPhoneNumValueIntoInput( inputNum )
    {
      var input = getInputByNum( inputNum );
      input.enterValue( '5313456789', '(531) 345-6789' );
    }

    this.      enterCompleteUnformattedPhoneNumber =
      function enterCompleteUnformattedPhoneNumber()
    {
      currentInput.enterValue( '3212345678', '(321) 234-5678' );
    }

    this.      enterPartialUnformattedPhoneNumber =
      function enterPartialUnformattedPhoneNumber()
    {
      currentInput.enterValue( '87632', '(876) 32_-____' );
    }

    this.      navigateToInput =
      function navigateToInput( inputNum )
    {
      var input = getInputByNum( inputNum );

      input.focus();
      priorInput = currentInput;
      currentInput = input;
    }

    this.      navigateFromInput =
      function navigateFromInput()
    {
      var toInputNum = ( currentInput.getInputNum() % inputs.length ) + 1;
      this.navigateToInput( toInputNum );
    }

    this.      enablePhoneHelpForInput =
      function enablePhoneHelpForInput( inputNum )
    {
      var input = getInputByNum( inputNum );
      getUi().bindToInput( input.getElement() );
    }

    this.      assertPhoneEntryHelpDisplayedForInput =
      function assertPhoneEntryHelpDisplayedForInput( inputNum )
    {
      var contentMismatch,
          input = inputNum ? getInputByNum( inputNum ) : currentInput,
          helpEl = findPhoneHelpElement();

      if ( ! helpEl ) {
        throw "Phone help element not found";
      }
      if( ! input.hasAsNextSiblingElement( helpEl ) ) {
        throw "Phone help element not next sibling of input";
      }
      contentMismatch = input.actualExpectedHelpContentMismatch( helpEl );
      if ( contentMismatch ){
        throw 'Phone help expected to contain "' + contentMismatch.expectedToContain + '", ' +
              'but was "' + contentMismatch.actual + '".';
      }
    }

    this.      assertNoPhoneEntryShownForPriorInput =
      function assertNoPhoneEntryShownForPriorInput()
    {
      var helpEl = findPhoneHelpElement();

      if( helpEl && priorInput.hasAsNextSiblingElement( helpEl ) ) {
        throw "Expected formatted phone entry help not to be shown for input, but it was shown";
      }
    }

    this.      assertFormattedValueInInput =
      function assertFormattedValueInInput( inputNum )
    {
      var mismatch,
          input = getInputByNum( inputNum );

      input.expectValueWasFormatted();

      mismatch = input.actualExpectedValueMismatch();
      if ( mismatch ) {
        throw 'Expected current input value to be "' + mismatch.expected + '", ' +
              'but was "' + mismatch.actual + '".';
      }
    }

    this.      assertInputCompletenessIndicated =
      function assertInputCompletenessIndicated()
    {
      var helpEl = findPhoneHelpElement();
      if ( ! helpEl.className.match(/\bphin-complete\b/) ) {
        throw "Expected input completeness to be indicated, but was not indicated."
      }
    }

    this.      assertInputCompletenessNotIndicated =
      function assertInputCompletenessNotIndicated()
    {
      var helpEl = findPhoneHelpElement();
      if ( helpEl.className.match(/\bphin-complete\b/) ) {
        throw "Expected input completeness not to be indicated, but was indicated."
      }
    }

    this.      assertInputInvalidityNotIndicated =
      function assertInputInvalidityNotIndicated()
    {
      var helpEl = findPhoneHelpElement();
      if ( helpEl.className.match(/\bphin-invalid\b/) ) {
        throw "Expected input validity not to be indicated, but was indicated."
      }
    }
  }

  return Browser;
})( phoneItInDrivers.browser, document, phoneItIn.UI );

phoneItInDrivers.browser.Input = (function ( document ) {
  function Input( parentEl, inputNum ) {
    var mentalModel,
        element = document.createElement('INPUT');

    element.setAttribute( 'type', 'text' );
    parentEl.appendChild( element );

    mentalModel = {
      value          : '' ,
      formattedValue : ''
    };

    this.      getInputNum =
      function getInputNum()
    { return inputNum; }

    this.      getElement =
      function getElement()
    { return element; }

    this.      hasAsNextSiblingElement =
      function hasAsNextSiblingElement( candidateEl )
    {
      return element.nextSibling === candidateEl;
    }

    this.      getMentalModel =
      function getMentalModel()
    { return mentalModel; }

    this.      enterValue =
      function enterValue( value, formattedValue )
    {
      element.value = value;
      element.dispatchEvent( new Event('input') );
      mentalModel.value = value;
      mentalModel.formattedValue = formattedValue;
    }

    this.      focus =
      function focus()
    {
      element.focus();
    }

    this.      expectValueWasFormatted =
      function expectValueWasFormatted()
    {
      mentalModel.value = mentalModel.formattedValue;
    }

    this.      actualExpectedValueMismatch =
      function actualExpectedValueMismatch()
    {
      return element.value === mentalModel.value ?
        null :
        { actual: element.value, expected: mentalModel.value };
    }

    this.      actualExpectedHelpContentMismatch =
      function actualExpectedHelpContentMismatch( helpEl )
    {
      var helpContent = helpEl.textContent,
          expectedValue = mentalModel.formattedValue;

      return helpContent === expectedValue ?
        null :
        { actual: helpContent, expectedToContain: expectedValue };
    }
  }

  return Input;
})( document );
