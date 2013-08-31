describe( 'phoneItIn.formatters', function () {
  var formatters;

  beforeEach(function () {
    formatters = phoneItIn.formatters;
  });

  describe( 'nanp (North American Numbering Plan)', function () {
    var nanp;

    beforeEach(function () {
      nanp = formatters.nanp;
    });

    describe( '.format', function () {
      it( "returns an empty string for a blank string", function () {
        expect( nanp.format( ''    ) ).toEqual( '' );
        expect( nanp.format( ' '   ) ).toEqual( '' );
        expect( nanp.format( '\t ' ) ).toEqual( '' );
      });

      it( "returns a formatted phone number for a 10-digit phone # string", function () {
        expect( nanp.format('2349876543') ).toEqual('(234) 987-6543');
      });

      it( "returns a formatted phone number for a formatted phone number", function () {
        expect( nanp.format('(345) 765-4321') ).toEqual('(345) 765-4321');
      });

      it( "returns a formatted phone number with digits for letters", function () {
        expect( nanp.format('(34K) s65-43a1') ).toEqual('(345) 765-4321');
      });

      it( "returns a formatted phone number for a partially formatted phone number", function () {
        expect( nanp.format( '(345)7654321' ) ).toEqual( '(345) 765-4321' );
        expect( nanp.format( '234 987-6543' ) ).toEqual( '(234) 987-6543' );
      });

      it( "ignores spurious whitespace & omits from formatted result", function () {
        expect( nanp.format( '2 349876543\t'       ) ).toEqual( '(234) 987-6543' );
        expect( nanp.format( ' (345)  7 65-4321  ' ) ).toEqual( '(345) 765-4321' );
      });

      it( "returns the given input when invalid characters are present", function () {
        expect( nanp.format( '555*6781234' ) ).toEqual( '555*6781234' );
        expect( nanp.format( '555*781234'  ) ).toEqual( '555*781234'  );
      });

      it( "returns the given input when the wrong number of digits is present", function () {
        expect( nanp.format( '555678123'   ) ).toEqual( '555678123'   );
        expect( nanp.format( '55567812345' ) ).toEqual( '55567812345' );
      });

      it( "returns the given input when valid, but misplaced characters are present", function () {
        expect( nanp.format( '5(556781234' ) ).toEqual( '5(556781234' );
        expect( nanp.format( '555-6781234' ) ).toEqual( '555-6781234' );
      });
    });

    describe( "digitizeAlpha", function () {
      it( "returns the given string having no alphabetic characters", function () {
        expect( nanp.digitizeAlpha('123-456#') ).toEqual('123-456#');
      });

      (function () {
        function example( letters, replacementDigit, input, expectedResult ) {
          var doesThis =
            "returns the given string, but " +
            "with letters " + letters + " replaced " +
            "by " + replacementDigit + "s";
          it( doesThis, function () {
            expect( nanp.digitizeAlpha( input ) ).toEqual( expectedResult );
          });
        }

        example( 'a-c' , '2' , 'ab(c)#ABC-1'   , '22(2)#222-1'   );
        example( 'd-f' , '3' , 'de(f)#DEF-1'   , '33(3)#333-1'   );
        example( 'd-f' , '3' , 'de(f)#DEF-1'   , '33(3)#333-1'   );
        example( 'g-i' , '4' , 'gh(i)#GHI-1'   , '44(4)#444-1'   );
        example( 'j-l' , '5' , 'jk(l)#JKL-1'   , '55(5)#555-1'   );
        example( 'm-o' , '6' , 'mn(o)#MNO-1'   , '66(6)#666-1'   );
        example( 'p-s' , '7' , 'pq(rs)#PQRS-1' , '77(77)#7777-1' );
        example( 't-v' , '8' , 'tu(v)#TUV-1'   , '88(8)#888-1'   );
        example( 'w-z' , '9' , 'wx(yz)#WXYZ-1' , '99(99)#9999-1' );
      })();
    });
  });
});
