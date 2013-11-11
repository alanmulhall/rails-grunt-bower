// My
// -----------

// This is a normal comment, that will become part of the
// annotations after running through the Docco tool. Use this
// space to describe the function or other code just below 
// this comment. For example: 
//
// The `DoSomething` method does something! It doesn't take any
// parameters... it just does something.
var My = {
  sqrt: function(x) {
    if (x < 0) throw new Error("sqrt can't work on negative number");
      return Math.exp(Math.log(x)/2);
  }
};
