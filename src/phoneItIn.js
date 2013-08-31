var phoneItIn = phoneItIn || {};

phoneItIn.formatters = phoneItIn.formatters || {};

phoneItIn.formatters.nanp = (function(){
  var my = {};

  function digitizeAlpha(value){
    return value.
      replace(/[a-c]/ig, '2').
      replace(/[d-f]/ig, '3').
      replace(/[g-i]/ig, '4').
      replace(/[j-l]/ig, '5').
      replace(/[m-o]/ig, '6').
      replace(/[p-s]/ig, '7').
      replace(/[t-v]/ig, '8').
      replace(/[w-z]/ig, '9');
  }
  my.digitizeAlpha = digitizeAlpha;

  function format(value){
    var formatted = value.replace(/\s/g, '');
    if( formatted.length === 0 ){ return formatted; }
    formatted = digitizeAlpha(formatted);
    if(! formatted.match(/^[(]?(\d\d\d)[)]?(\d\d\d)-?(\d\d\d\d)$/) ){ return value; }
    return formatted.replace( /^[(]?(\d\d\d)[)]?(\d\d\d)-?(\d\d\d\d)$/, '($1) $2-$3' );
  }
  my.format = format;

  return my;
})();

phoneItIn.UI = (function(){
  var formatter = phoneItIn.formatters.nanp;

  function UI(){ }
  UI.prototype = {};

  function addHelpToInput(input){
    var helpEl = document.createElement('DIV');
    helpEl.setAttribute('id', 'phin-help');
    helpEl.innerHTML = formatter.format(input.value);
    input.parentNode.insertBefore(helpEl, input.nextChild);
  };

  function removeHelp(){
    helpEl = document.getElementById('phin-help');
    if( helpEl ){ helpEl.parentNode.removeChild(helpEl); }
  }

  function formatValueOfInput(input){
    input.value = formatter.format(input.value);
  }

  function bindToInput(input){
    input.addEventListener( 'focus', function(){ addHelpToInput(input);     } );
    input.addEventListener( 'blur' , function(){ formatValueOfInput(input); } );
    input.addEventListener( 'blur' , function(){ removeHelp(); } );
  }
  UI.prototype.bindToInput = bindToInput;

  return UI;
})();
