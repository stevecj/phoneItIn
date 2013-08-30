function PhoneItInUIDriver(){
}
PhoneItInUIDriver.prototype = (function(document, UI){
  var my = {};

  var mentalModel = {};
  var fixtureEl, inputs, ui;

  function teardown(){
    if(fixtureEl){
      document.body.removeChild(fixtureEl);
    }
    fixture = null;
  }
  my.teardown = teardown;

  function getUi(){
    return ui = ui || new UI();
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
  my.createInputs = createInputs;

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
  my.putUnformattedPhoneNumValueIntoInput = putUnformattedPhoneNumValueIntoInput;

  function navigateToInput(inputNum){
    getInputByNum(inputNum).focus();
  }
  my.navigateToInput = navigateToInput;

  function enablePhoneHelpForInput(inputNum){
    var input = getInputByNum(inputNum)
    getUi().bindToInput(input);
  }
  my.enablePhoneHelpForInput = enablePhoneHelpForInput;

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
  my.isPhoneEntryHelpDisplayedForInput = isPhoneEntryHelpDisplayedForInput;

  return my;
})(document, PhoneItIn.UI);
