var browserify = require('browserify');
var express = require('express');
var glob = require('glob');
var path = require('path');
var q = require('q');
var reactTools = require('react-tools');
var through = require('through');

var Promise = q.Promise;

var COMPONENTS_DIR = path.resolve(__dirname, 'components');
var PAGE_BOOTLOADER_PATH = path.resolve(__dirname, 'pageBootloader.js');

function getJSBundleData() {
  return new Promise(function(res, rej) {
    console.log('Finding all files under ./components/...');
    glob(path.resolve(COMPONENTS_DIR, '*.js'), null, function(err, files) {
      if (err) { rej(err); }
      console.log(' - Found ' + files.length + ' files.');

      console.log('Building browserify instance...');
      var bInst = browserify({
        baseDir: COMPONENTS_DIR,
      });

      files.unshift('./' + path.relative(__dirname, PAGE_BOOTLOADER_PATH));
      files.forEach(function(filePath) {
        console.log(' - Adding to bundle: ' + filePath + '...');
        bInst.require(filePath);
      });

      console.log(' - Setting up file transformer...');
      bInst.transform(function() {
        var data = '';
        return through(
          function(chunk) { data += chunk; },
          function() {
            this.queue(reactTools.transform(data, {harmony: true}));
            this.queue(null);
          }
        );
      }, {global: true});

      console.log(' - Bundling files...');
      var bStream = bInst.bundle();
      var jsBundleData = '';
      bStream.on('data', function(chunk) { jsBundleData += chunk; });
      bStream.on('error', rej);
      bStream.on('end', function() { res(jsBundleData); });
    });
  });
}

getJSBundleData().done(function(jsBundleData) {
  console.log('Starting web server...');

  var app = express();
  app.get('/', function(req, res) {
    res.send([
      '<html>',
      '  <head>',
      '    <title>BCGgeneDB</title>',
      '  </head>',
      '  <body>',
      '    <div id="toplevel"></div>',
      '    <script src="http://fb.me/react-0.13.1.js"></script>',
      '    <script src="/bundle.js"></script>',
      '    <script type="text/javascript">',
      '      require("./pageBootloader.js").startPage();',
      '    </script>',
      '  </body>',
      '</html>',
    ].join('\n'));
  });

  app.get('/bundle.js', function(req, res) {
    res.set('Content-Type', 'text/javascript');
    res.send(jsBundleData);
  });

  var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log(' - Webserver started at: http://%s:%s/', host, port);
  });
});
