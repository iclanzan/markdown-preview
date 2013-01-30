(function(root, undefined) {
  'use strict';

  var clientID = '589507031071.apps.googleusercontent.com',
      scope = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.install',
      doc = root.document,
      analytics = root.analytics || [],
      marked, hljs, gapi, article;

  // Load analytics
  require('d2dq2ahtl5zl1z.cloudfront.net/analytics.js/v1/892gioqtse/analytics.min.js');
  analytics.push(['pageview']);

  function require(url, callback) {
    var script = doc.createElement('script');
    script.async = true;
    script.src = url;

    if (callback) {
      script.onload = callback;
    }

    doc.body.appendChild(script);
  }

  function getParam(name) {
    var results = new RegExp('[\\?&]' + name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]') + '=([^&#]*)')
                    .exec(root.location.search);
    if (!results) return '';
    else return decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function $(id) {
    return doc.getElementById(id);
  }

  function loadFile() {
    var state = JSON.parse(getParam('state') || '""'),
        client = gapi.client,
        fileId;
    if (!state || !state.ids || !state.ids.length) return;
    fileId = state.ids[0];

    analytics.push(['identify', state.userId], ['track', 'opened file', {fileId: fileId}]);

    client.load('drive', 'v2', function() {
      client.drive.files.get({
        'fileId': fileId
      }).execute(function(fileMeta) {
        var url = fileMeta.downloadUrl;
        if (url) {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          xhr.setRequestHeader('Authorization', 'Bearer ' + gapi.auth.getToken().access_token);
          xhr.onload = function() {
            render(xhr.responseText);
            doc.title = fileMeta.title;
          };
          xhr.send();
        }
      });
    });
  }

  function render(content) {
    article.innerHTML = root.marked(content);
  }

  function auth(result) {
    if (result && !result.error) {
      article.innerHTML = '';
      loadFile();
    }
    else {
      article.innerHTML = '<div id="install">Install</div>';
      $('install').onclick = function() {
        analytics.push(['track', 'clicked on install button']);
        gapi.auth.authorize({'client_id': clientID, 'scope': scope, 'immediate': false}, auth);
      };
    }
  }

  root.app = function() {
    gapi = root.gapi;
    marked = root.marked;
    hljs = root.hljs;

    marked.options({
      highlight: function(code, lang) {
        if (!lang) return code;
        if (lang == 'js') lang = 'javascript';

        return hljs.highlight(lang, code).value;
      }
    });

    article = $('article');

    gapi.auth.authorize({'client_id': clientID, 'scope': scope, 'immediate': true}, auth);
  };

})(this);
