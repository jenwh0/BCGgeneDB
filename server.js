var q = require('q');
global.Promise = q.Promise;

var browserify = require('browserify');
var express = require('express');
var fs = require('fs');
var glob = require('glob');
var fetch = require('node-fetch');
var path = require('path');
var reactTools = require('react-tools');
var through = require('through');

var COMPONENTS_DIR = path.resolve(__dirname, 'components');
var CSS_DIR = path.resolve(__dirname, 'css');
var LIB_DIR = path.resolve(__dirname, 'lib');
var PAGE_BOOTLOADER_PATH = path.resolve(__dirname, 'pageBootloader.js');

function fetchJSBundleData() {
  return new Promise(function(res, rej) {
    console.log('Finding files to be bundled...');
    var compsGlob = path.resolve(COMPONENTS_DIR, '*.js');
    var libGlob = path.resolve(LIB_DIR, '*.js');
    glob('{' + compsGlob + ',' + libGlob + '}', null, function(err, files) {
      if (err) { rej(err); }
      console.log(' - Found ' + files.length + ' files.');

      var bInst = browserify({
        baseDir: COMPONENTS_DIR,
      });

      files.unshift('./' + path.relative(__dirname, PAGE_BOOTLOADER_PATH));
      files.forEach(function(filePath) {
        console.log(' - Adding to bundle: ' + filePath + '...');
        bInst.require(filePath);
      });

      console.log(' - Setting up file transformer...');
      bInst.transform(function(fname) {
        var data = '';
        return through(
          function(chunk) { data += chunk; },
          function() {
            var result;
            try {
              result = reactTools.transform(data, {harmony: true});
            } catch(e) {
              e.message = fname + ': ' + e.message;
              throw e;
            }
            this.queue(result);
            this.queue(null);
          }
        );
      }, {global: true});

      console.log(' - Bundling files...');
      var bStream = bInst.bundle();
      var jsBundleData = '';
      bStream.on('data', function(chunk) { jsBundleData += chunk; });
      bStream.on('error', rej);
      bStream.on('end', function() {
        console.log('Finished bundling.');
        res(jsBundleData);
      });
    });
  });
}

var jsBundleData = null;
function getJSBundleData() {
  // TODO: Memoize the results if nothing has changed
  if (jsBundleData === null) {
    console.log('Re-bundling files incase something changed...');
    jsBundleData = fetchJSBundleData().then(function(data) {
      jsBundleData = null;
      return data;
    });
  }
  return jsBundleData;
}

getJSBundleData();

console.log('Starting web server...');
var app = express();
app.get('/', function(req, res) {
  glob(path.resolve(CSS_DIR, '*.css'), null, function(err, files) {
    var linkTags = files.map(function(filePath) {
      filePath = path.join('css' + filePath.slice(CSS_DIR.length));
      return '<link rel="stylesheet" type="text/css" href="' + filePath + '">';
    });

    console.log('Generating page with ' + linkTags.length + ' css files...');

    res.send([
      '<html>',
      '  <head>',
      '    <title>BCGgeneDB</title>',
      ].concat(linkTags).concat([
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
    ]).join('\n'));
  });
});

app.get('/bundle.js', function(req, res) {
  getJSBundleData().done(function(jsBundleData) {
    res.set('Content-Type', 'text/javascript');
    res.send(jsBundleData);
  });
});

app.get('/keggAPI/find/', function(req, res) {
  var e_db = encodeURIComponent(req.query.db);
  var e_query = encodeURIComponent(req.query.q);

  var url = 'http://rest.kegg.jp/find/' + e_db + '/' + e_query;
  console.log('Fetching from KEGG API: ' + url + '...');
  fetch(url)
    .then(function(response) {
      return response.text();
    })
    .done(function(response) {
      res.send(response);
    });
});

app.get('/keggAPI/getNtSeqs/', function(req, res) {
  var dbs = JSON.parse(req.query.dbNames);

  var dbsToQuery;
  var prevQuery = Promise.resolve('');
  do {
    if (dbs.length > 10) {
      dbsToQuery = dbs.slice(0, 10);
      dbs = dbs.slice(10);
    } else {
      dbsToQuery = dbs.slice(0);
      dbs = [];
    }

    var e_dbs = dbsToQuery.map(encodeURIComponent).join('+');
    var url = 'http://rest.kegg.jp/get/' + e_dbs + '/ntseq';
    console.log('Fetching from KEGG API: ' + url + '...');
    var thisFetch = fetch(url).then(function(response) {
      return response.text();
    });
    prevQuery = prevQuery.then(function(prevResult) {
      return thisFetch.then(function(result) {
        return prevResult + '\n' + result.trim();
      });
    });
  } while (dbs.length > 0);

  return prevQuery.then(function(result) {
    res.send(result);
  });
});

app.get('/css/*.css', function(req, res) {
  console.log('Request for /css/' + req.params[0] + '.css ...');
  var filePath = path.resolve(CSS_DIR, req.params[0] + '.css');
  fs.readFile(filePath, function(err, data) {
    if (err) { throw err; }
    res.set('Content-Type', 'text/css');
    res.send(data);
  });
});

var server = app.listen(3000, 'localhost', function() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Webserver started at: http://%s:%s/', host, port);
});
