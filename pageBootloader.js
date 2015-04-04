var q = require('q');
global.Promise = q.Promise;
global.Promise.prototype.done = function(f, r) {
  return Q(this, f, r);
};

var AppComponent = require('./components/AppComponent');
var React = require('react');

exports.startPage = function() {
  var containerDiv = document.getElementById('toplevel');
  React.render(<AppComponent />, containerDiv);
};
