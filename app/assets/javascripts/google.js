$(document).ready(function () {

  // Wait for the Google API to load before working with it
  waitForGAPI(200, function () {
    authGAPI('AIzaSyAME2fVyr6qZf0F37fnBfeSweSe7k8yIaM');
    loadMusic('#music');
  });

  function waitForGAPI(delay, callback) {
    if (gapi && gapi.client) {
      console.log("gapi loaded");
      callback();
      return;
    }

    setTimeout(function () {
      waitForGAPI(2 * delay, callback);
    });
  }

  function authGAPI(api_key) {
    gapi.client.setApiKey('AIzaSyAME2fVyr6qZf0F37fnBfeSweSe7k8yIaM');
  }

  function loadMusic(query) {
    // Load the API
    gapi.client.load('plus', 'v1', function() {
      var request = gapi.client.plus.activities.search({
        'query' : 'music'
      });
      
      request.execute(function(resp) {
        var numItems = resp.items.length;
        for (var i = 0; i < numItems; i++) {
          document.write('ID: ' + resp.items[i].id + ' Content: ' +
            resp.items[i].object.content);
        }
      });
    });
  }
});