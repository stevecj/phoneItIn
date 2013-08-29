function PhoneItInUIDriver(){
}
PhoneItInUIDriver.prototype = (function(){
  var mentalModel = {};
  var fixtureEl, inputs, ui;

  function teardown(){
    if(fixtureEl){
      document.body.removeChild(fixtureEl);
    }
    fixture = null;
  }

  function getUi(){
    if(! ui){ ui = new PhoneItIn.UI(); }
    return ui;
  }

  function getFixtureEl(){
    if(! fixtureEl){
      fixtureEl = document.createElement('DIV');
      document.body.appendChild( fixtureEl );
    }
    return fixtureEl;
  }

  function createInputs(){
    var vitro = document.createElement('DIV')
    vitro.innerHTML =
      "<input type='text' />" +
      "<input type='text' />";
    inputs = [vitro.firstChild, vitro.lastChild];
    getFixtureEl().appendChild(inputs[ 0 ]);
    getFixtureEl().appendChild(inputs[ 1 ]);
    mentalModel.inputs = [
      {value: undefined, formattedVal: undefined} ,
      {value: undefined, formattedVal: undefined}
    ];
  }

  function getInputByNum(inputNum){
    return inputs[inputNum - 1];
  }

  function putUnformattedPhoneNumValueIntoInput(inputNum){
    var unformatted = '5313456789', formatted = '(531) 345-6789';

    getInputByNum(inputNum).value = unformatted;

    var inputMM = mentalModel.inputs[inputNum - 1];
    inputMM.value        = unformatted;
    inputMM.formattedVal = formatted;
  }

  function navigateToInput(inputNum){
    getInputByNum(inputNum).focus();
  }

  function enablePhoneHelpForInput(inputNum){
    var input = getInputByNum(inputNum)
    getUi().bindToInput(input);
  }

  function isPhoneEntryHelpDisplayedForInput(inputNum){
    helpEl = document.getElementById('phin-help');
    if(! helpEl){
      throw "Phone help element not found";
    }
    var input = getInputByNum(inputNum);
    if(! helpEl.previousSibling == input ) {
      throw "Phone help element not next sibling of input";
    }
    var formattedValue = mentalModel.inputs[inputNum - 1].formattedVal ;
    var helpContent = helpEl.innerHTML;
    if( helpContent.indexOf(formattedValue) < 0 ){
      throw 'Phone help expected to contain "' + formattedValue + '", but was "' + helpContent + '".';
    }
    return true;
  }

  return {
    teardown                             : teardown                             ,
    createInputs                         : createInputs                         ,
    putUnformattedPhoneNumValueIntoInput : putUnformattedPhoneNumValueIntoInput ,
    enablePhoneHelpForInput              : enablePhoneHelpForInput              ,
    navigateToInput                      : navigateToInput                      ,
    enablePhoneHelpForInput              : enablePhoneHelpForInput              ,
    isPhoneEntryHelpDisplayedForInput    : isPhoneEntryHelpDisplayedForInput    , 
  }
})();
