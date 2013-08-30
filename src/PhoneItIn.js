var PhoneItIn = PhoneItIn || {};

PhoneItIn.Formatters = PhoneItIn.Formatters || {};

PhoneItIn.Formatters.NANP = (function(){
  var my = {};

  function format(value){
    return value.replace( /^(...)(...)(....)$/, '($1) $2-$3' );
  }
  my.format = format;

  return my;
})();

PhoneItIn.UI = (function(){
  var formatter = PhoneItIn.Formatters.NANP;

  function UI(){ }
  UI.prototype = {};

  function addHelpToInput(input){
    var helpEl = document.createElement('DIV');
    helpEl.setAttribute('id', 'phin-help');
    helpEl.innerHTML = formatter.format(input.value);
    input.parentNode.insertBefore(helpEl, input.nextChild);
  };

  function bindToInput(input){
    input.addEventListener( 'focus', function(){ addHelpToInput(input); } );
  }
  UI.prototype.bindToInput = bindToInput;

  return UI;
})();
