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
        'query'     : 'music',
        'orderBy'   : 'best',
        'maxResults': '20'
      });
      
      request.execute(function(resp) {
        var numItems = resp.items.length;

        var results = $('#discover-results');
        results.html('');

        for (var i = 1; i < numItems - 1; i++) {
          var attachments = resp.items[i].object.attachments;
          var current_html = $('#discover-results').html();

          if (attachments 
            && attachments.length > 0 
            && attachments[0].objectType == "video") {

            var video_code = attachments[0].url.split("v=")[1];

            var static_img = $('<img />')
              .attr('src', 'http://img.youtube.com/vi/' + video_code + '/0.jpg')
              .attr('width', '300')
              .attr('height', '200')
              .attr('video-code', video_code)
              .click(function() {
                var this_video_code = $(this).attr('video-code');

                var real_video = $('<iframe />')
                  .attr('width', '300')
                  .attr('height', '200')
                  .attr('frameborder', '0')
                  .attr('allowfullscreen', 'allowfullscreen')
                  .attr('src', 'http://www.youtube.com/embed/' + this_video_code);

                $(this).css('display', 'none');

                real_video.hide();
                real_video.appendTo($(this).parent());
                real_video.fadeIn();
              });

            // Build wrapper
            var wrapper = $('<div />').attr('class', 'wrapper');

            static_img.appendTo(wrapper);

            wrapper.appendTo(results);

          }
         
        }
      });
    });
  }
});