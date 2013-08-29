function PhoneItInUIDriver(){
}
PhoneItInUIDriver.prototype = (function(){
  var mentalModel = {};
  var fixtureEl, form, inputs, ui;

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

  function getInputByNum(inputNum){
    console.log(form);
    form.getElementsByTagName('INPUT')[inputNum - 1];
  }

  function createForm(){
    if(! form ){
      form = document.createElement('FORM');
      form.innerHTML = "<input type='text' /><input type='text' />";
      getFixtureEl().appendChild(form);
      inputs = [form.firstChild, form.lastChild];
      mentalModel.inputs = [{}, {}];
    }
  }

  function populateFormInputs(){
    mentalModel.inputs[0].value = inputs[0].value = 'value1';
    mentalModel.inputs[1].value = inputs[1].value = 'value2';
  }

  function navigateToInput(inputNum){
    inputs[inputNum -1].focus();
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
    var formattedValue = mentalModel.formattedInputValue(inputNum);
    if(! helpEl.innerHTML.match(formattedValue) ){
      throw "Phone help does not contain formatted input value";
    }
    return true;
  }

  return {
    teardown                          : teardown                          ,
    createForm                        : createForm                        ,
    populateFormInputs                : populateFormInputs                ,
    enablePhoneHelpForInput           : enablePhoneHelpForInput           ,
    navigateToInput                   : navigateToInput                   ,
    enablePhoneHelpForInput           : enablePhoneHelpForInput           ,
    isPhoneEntryHelpDisplayedForInput : isPhoneEntryHelpDisplayedForInput , 
  }
})();
