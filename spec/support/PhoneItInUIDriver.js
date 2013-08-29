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

  function createPopulatedInputs(){
    var vitro = document.createElement('DIV')
    vitro.innerHTML =
      "<input type='text' value='value1' />" +
      "<input type='text' value='value2' />";
    inputs = [vitro.firstChild, vitro.lastChild];
    getFixtureEl().appendChild(inputs[ 0 ]);
    getFixtureEl().appendChild(inputs[ 1 ]);
    mentalModel.inputs = [
      {value: 'value1', formattedVal: '## value1 ##'} ,
      {value: 'value2', formattedVal: '## value2 ##'}
    ];
  }

  function getInputByNum(inputNum){
    return inputs[inputNum - 1];
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
    if(! helpEl.innerHTML.match(formattedValue) ){
      throw "Phone help does not contain formatted input value";
    }
    return true;
  }

  return {
    teardown                          : teardown                          ,
    createPopulatedInputs             : createPopulatedInputs             ,
    enablePhoneHelpForInput           : enablePhoneHelpForInput           ,
    navigateToInput                   : navigateToInput                   ,
    enablePhoneHelpForInput           : enablePhoneHelpForInput           ,
    isPhoneEntryHelpDisplayedForInput : isPhoneEntryHelpDisplayedForInput , 
  }
})();
