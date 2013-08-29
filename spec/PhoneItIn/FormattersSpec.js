describe('PhoneItIn.Formatters', function(){
  var Formatters;

  beforeEach(function(){
    Formatters = PhoneItIn.Formatters;
  });

  describe('NANP (North American Numbering Plan)', function(){
    var NANP;

    beforeEach(function(){
      NANP = Formatters.NANP;
    });

    describe('.format', function(){

      it('returns a formatted phone number for a 10-digit phone # string', function(){
        expect( NANP.format('2349876543') ).toEqual( '(234) 987-6543' );
      });
    });
  });
});
