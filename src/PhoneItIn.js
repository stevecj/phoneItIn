var PhoneItIn = (function(){
  var Formatters = {
    NANP : (function(){
      function format(value){
        return value.replace( /^(...)(...)(....)$/, '($1) $2-$3' );
      }

      return {
        format : format
      }
    })()
  };

  var formatter = Formatters.NANP;

  function UI(){
  }
  UI.prototype = (function(){
    function addHelpToInput(input){
      var helpEl = document.createElement('DIV');
      helpEl.setAttribute('id', 'phin-help');
      helpEl.innerHTML = formatter.format(input.value);
      input.parentNode.insertBefore(helpEl, input.nextChild);
    };

    function bindToInput(input){
      input.addEventListener( 'focus', function(){ addHelpToInput(input); } );
    }

    return {
      bindToInput : bindToInput
    }
  })();

  return {
    Formatters : Formatters ,
    UI         : UI
  };
})();
