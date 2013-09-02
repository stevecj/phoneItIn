Phone It In
===========
**A phone number entry helper**

Phone It In is a very simple North American phone number data
entry helper for HTML forms written in JavaScript. The idea is
to provide useful assistance without getting in the way and
without any kind of excessive cleverness that will be likely to
break in new or untested browsers.

Many other phone number data entry helpers act as in-place
templates, enforcing format with every character typed and
automatically filling in parentheses and dashes. It is very hard
to implement this reliably, and at the same time, it can break
users' expectations of what they should be able to do with an
input on a form, such as paste in a value.

This helper takes a different approach and opens a helper next
to the input that dynamically shows what the formatted phone
number will look, whether there are any problems, and whether
entry is complete. Upon leaving the input, the value is re-
formatted to standard.

Note: This project is in early develpment and has just reached
the point of starting to be useful in production. It currently
works only with very modern browsers and it will be much
firendlier once it can display an indication of when a complete
phone number has been entered or when invalid or extra characters
have been entered. These indications are coming very soon.
