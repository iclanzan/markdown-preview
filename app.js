(function(root, undefined) {
  'use strict';

  var gapi = root.gapi,
      clientID = '589507031071.apps.googleusercontent.com',
      scope = 'https://www.googleapis.com/auth/drive';

  function auth(result) {
    if (result && !result.error) {
      console.log('Authorized');
    }
    else
      gapi.auth.authorize({'client_id': clientID, 'scope': scope, 'immediate': false}, auth);
  }

  root.app = function() {
    gapi.auth.authorize({'client_id': clientID, 'scope': scope, 'immediate': true}, auth);
  };

})(this);
