require('whatwg-fetch');

function find(dbName, query) {
  var e_dbName = encodeURIComponent(dbName);
  var e_query = encodeURIComponent(query);
  var url = '/keggAPI/find/?db=' + e_dbName + '&q=' + e_query;

  return fetch(url).then(function(response) {
      return response.text();
    }).then(function(rawText) {
      return rawText.split('\n').map(function(line) {
        return line.split('\t');
      });
    });
}

exports.find = find;
