$(document).ready(function () {

  // Check for search query
  var query = window.location.search.replace( "?", "" );
  if (query && query.length > 0 && query.indexOf('=') > -1) {
    query = query.split("=")[1];
    if (query) {
      $('#search-box').val(unescape(query));
    }
  }

  // Wait for the Google API to load before working with it
  waitForGAPI(200, function () {
    authGAPI('AIzaSyAME2fVyr6qZf0F37fnBfeSweSe7k8yIaM');
    if (query) {
      loadMusic(query);
    } else {
      loadMusic('music');
    }
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
        'query'     : query,
        'orderBy'   : 'best',
        'maxResults': '20'
      });
      
      request.execute(function(resp) {
        if (!resp.items) {
          $('#discover-results').text('No results found. Try something else!');
          return;
        }

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

            if (video_code && video_code.indexOf('&') > -1) {
              video_code = video_code.split('&')[0];
            }

            var static_img = $('<img />')
              .attr('src', 'http://img.youtube.com/vi/' + video_code + '/0.jpg')
              .attr('width', '300')
              .attr('height', '225')
              .attr('video-code', video_code)
              .click(function() {
                // Lazy-evaluate the building of this song's YouTube video
                var this_video_code = $(this).attr('video-code');

                var real_video = $('<iframe />')
                  .attr('width', '300')
                  .attr('height', '200')
                  .attr('frameborder', '0')
                  .attr('allowfullscreen', 'allowfullscreen')
                  .attr('src', 'http://www.youtube.com/embed/' + this_video_code);

                $(this).hide();
                $(this).parent().find('.video-label').hide();

                real_video.hide();
                real_video.appendTo($(this).parent());
                real_video.fadeIn();
              })
              .mouseover(function () {
                $(this).fadeTo('fast', 0.6);
              })
              .mouseout(function () {
                var opacity = Math.round($(this).css('opacity') * 10) / 10;
                if (opacity >= 0.6 && !$(this).is(":hidden")) {
                  $(this).fadeTo('fast', 1.0);
                }
              });

            // Build wrapper
            var wrapper = $('<div />')
              .attr('class', 'wrapper');

            var label = $('<div />')
              .attr('class', 'video-label')
              .attr('video-code', video_code)
              .text('');

            // Add image/video to wrapper
            static_img.appendTo(wrapper);
            label.appendTo(wrapper);

            wrapper
              .hide()
              .appendTo(results)
              .fadeIn('slow');

          }
         
        }

        $.each($('div.video-label'), function (key, value) {
          var this_video_code = $(value).attr('video-code');

          $.getJSON('https://gdata.youtube.com/feeds/api/videos/' + this_video_code + '?v=1&alt=json', function(data) {
            $('.video-label[video-code=' + this_video_code + ']')
              .hide()
              .text(data.entry.title.$t)
              .fadeIn('fast');
          });
        });
  
      });
    });
  }
});

function signinCallback() {

}