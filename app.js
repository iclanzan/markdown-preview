(function(root, undefined) {
  'use strict';

  var clientID = '589507031071.apps.googleusercontent.com',
      scope = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.install',
      gapi;

  function getParam(name) {
    var results = new RegExp('[\\?&]' + name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]') + '=([^&#]*)')
                    .exec(root.location.search);
    if (!results) return '';
    else return decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  function loadFile() {
    var state = JSON.parse(getParam('state'));
    if (!state || !state.ids || !state.ids.length) return;

    gapi.client.load('drive', 'v2', function() {
      gapi.client.drive.files.get({
        'fileId': state.ids[0]
      }).execute(function(res) {
        console.log(res);
      });
    });
  }

  function auth(result) {
    if (result && !result.error)
      loadFile();
    else
      gapi.auth.authorize({'client_id': clientID, 'scope': scope, 'immediate': false}, auth);
  }

  root.app = function() {
    gapi = root.gapi;
    gapi.auth.authorize({'client_id': clientID, 'scope': scope, 'immediate': true}, auth);
  };

})(this);
