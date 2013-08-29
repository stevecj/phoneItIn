var PhoneItIn = (function(){
  function UI(){
  }
  UI.prototype = (function(){
    function addHelpToInput(input){
      var helpEl = document.createElement('DIV');
      helpEl.setAttribute('id', 'phin-help');
      helpEl.innerHTML = '## value2 ##';
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
    UI : UI
  };
})();
