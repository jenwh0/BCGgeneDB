require('whatwg-fetch');

function find(dbName, query) {
  var e_dbName = encodeURIComponent(dbName);
  var e_query = encodeURIComponent(query);
  var url = '/keggAPI/find/?db=' + e_dbName + '&q=' + e_query;

  return fetch(url)
    .then(function(response) {
      return response.text();
    })
    .then(function(rawText) {
      return rawText.trim().split('\n')
        .filter(function(line) {
          return line !== '';
        })
        .map(function(line) {
          return line.split('\t');
        });
    });
}

function getNtSeqs(dbNames) {
  var e_dbNames = encodeURIComponent(JSON.stringify(dbNames));
  var url = '/keggAPI/getNtSeqs/?dbNames=' + e_dbNames;

  return fetch(url)
    .then(function(response) {
      return response.text();
    })
    .then(function(rawText) {
      return rawText.trim().split(/^>/gm)
        .filter(function(result) {
          return result !== '';
        })
        .reduce(function(map, result) {
          var resultLines = result.split('\n').filter(function(line) {
            return line !== '';
          });
          var nameAndDesc = resultLines.shift().split(' ');
          var dbName = nameAndDesc.shift();
          var description = nameAndDesc.join(' ');
          var ntSeq = resultLines.reduce(function(seq, chunk) {
            return seq + chunk.trim();
          }, '');

          map[dbName] = {description: description, seq: ntSeq};
          return map;
        }, {});
    });
}

exports.find = find;
exports.getNtSeqs = getNtSeqs;
