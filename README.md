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

![Partial Entry](/readme-images/partial-entry.png)

![Complete Entry](/readme-images/complete-entry.png)

![Entry With Extra Digit](/readme-images/extra-digit.png)

![Entry With Invalid Character](/readme-images/bad-partial-entry.png)

Note that this code currently relies on features only present
in up-to-date modern browsers.
