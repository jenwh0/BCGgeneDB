var AppComponent = require('./components/AppComponent');
var React = require('react');

exports.startPage = function() {
  var containerDiv = document.getElementById('toplevel');
  React.render(<AppComponent />, containerDiv);
};
