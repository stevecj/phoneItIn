describe( 'phoneItIn.formatters', function () {
  var formatters;

  beforeEach(function () {
    formatters = phoneItIn.formatters;
  });

  describe( '.nanp (North American Numbering Plan)', function () {
    var nanp;

    beforeEach(function () {
      nanp = formatters.nanp;
    });

    describe( "format", function () {
      it( "returns an empty template for a blank string", function () {
        var expected = '(___) ___-____';

        expect( nanp.format( ''    ) ).toEqual( expected );
        expect( nanp.format( ' '   ) ).toEqual( expected );
        expect( nanp.format( '\t ' ) ).toEqual( expected );
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

      it( "returns the 'formatted' value even if invalid characters are present", function () {
        expect( nanp.format( '555*678123' ) ).toEqual( '(555) *67-8123' );
        expect( nanp.format( '5557812~34' ) ).toEqual( '(555) 781-2~34' );
      });

      it( "returns a partially filled template when too few digits are present", function () {
        expect( nanp.format( '5'         ) ).toEqual( '(5__) ___-____' );
        expect( nanp.format( '54'        ) ).toEqual( '(54_) ___-____' );
        expect( nanp.format( '543876'    ) ).toEqual( '(543) 876-____' );
        expect( nanp.format( '543876543' ) ).toEqual( '(543) 876-543_' );
      });

      it( "returns a partially filled template for a partial formatted number", function () {
        expect( nanp.format( '(5'           ) ).toEqual( '(5__) ___-____' );
        expect( nanp.format( '(54'          ) ).toEqual( '(54_) ___-____' );
        expect( nanp.format( '(543)876'     ) ).toEqual( '(543) 876-____' );
        expect( nanp.format( '543) 876-543' ) ).toEqual( '(543) 876-543_' );
      });

      it( "returns a formatted value followed by a space, then extra digits for too many digits", function () {
        expect( nanp.format( '56767812345'   ) ).toEqual( '(567) 678-1234 5'   );
        expect( nanp.format( '5676781234567' ) ).toEqual( '(567) 678-1234 567' );
      });
    });

    describe( ".validityOf()", function () {

      it( "returns 'partial' for a blank value", function () {
        expect( nanp.validityOf( ''    ) ).toEqual( 'partial' );
        expect( nanp.validityOf( '\t ' ) ).toEqual( 'partial' );
      });

      it( "returns 'partial' for a partial valid value", function () {
        expect( nanp.validityOf( '543'      ) ).toEqual( 'partial' );
        expect( nanp.validityOf( '(654)3 M' ) ).toEqual( 'partial' );
      });

      it( "returns 'invalid' with invalid characters in value", function () {
        expect( nanp.validityOf( '5*3'     ) ).toEqual( 'invalid' );
        expect( nanp.validityOf( '(645)3~' ) ).toEqual( 'invalid' );
      });

      it( "returns 'invalid' with delimiters in invalid positions", function () {
        expect( nanp.validityOf( '5(03) 234-5678' ) ).toEqual( 'invalid' );
        expect( nanp.validityOf( '(645)3-2'       ) ).toEqual( 'invalid' );
      });
    });

    describe( ".digitizeAlpha()", function () {
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
