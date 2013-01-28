(function(root, undefined) {
  'use strict';

  var clientID = '589507031071.apps.googleusercontent.com',
      scope = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.install',
      marked, hljs, gapi;

  function getParam(name) {
    var results = new RegExp('[\\?&]' + name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]') + '=([^&#]*)')
                    .exec(root.location.search);
    if (!results) return '';
    else return decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function loadFile() {
    var state = JSON.parse(getParam('state') || '""'),
        client = gapi.client;
    if (!state || !state.ids || !state.ids.length) return;

    client.load('drive', 'v2', function() {
      client.drive.files.get({
        'fileId': state.ids[0]
      }).execute(function(fileMeta) {
        var url = fileMeta.downloadUrl;
        if (url) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          xhr.setRequestHeader('Authorization', 'Bearer ' + gapi.auth.getToken().access_token);
          xhr.onload = function() {
            render(xhr.responseText);
          };
          xhr.send();
        }
      });
    });
  }

  function render(content) {
    root.document.getElementById('article').innerHTML = root.marked(content);
  }

  function auth(result) {
    if (result && !result.error)
      loadFile();
    else
      gapi.auth.authorize({'client_id': clientID, 'scope': scope, 'immediate': false}, auth);
  }

  root.app = function() {
    gapi = root.gapi;
    marked = root.marked;
    hljs = root.hljs;

    marked.options({
      highlight: function(code, lang) {
        return lang? hljs.highlight(lang, code).value : code;
      }
    });

    gapi.auth.authorize({'client_id': clientID, 'scope': scope, 'immediate': true}, auth);
  };

})(this);
