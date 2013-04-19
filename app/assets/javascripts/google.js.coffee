signinCallback = (authResult) ->
  token = gapi.auth.getToken()
  accessToken = token.access_token
  if authResult["access_token"]
    accessUrl = "https://www.googleapis.com/plus/v1/people/me?access_token=" + accessToken
    $.ajax
      type: "GET"
      url: accessUrl
      async: false
      contentType: "application/json"
      dataType: "jsonp"
      success: (data) ->
        originalImage = data.image.url
        imageUrl = originalImage.slice(0, -2)
        gplusImage = imageUrl + "200"
        $("#fullname").val data.displayName
        $("#gplus").val data.id
        $(".is-this-you").html "<h3>Is this you?</h3><img src='" + gplusImage + "'><br><h4>" + data.displayName + "</h4><br><input type='submit' value='Login or Register'>"

      error: (e) ->
        console.log e

  else $(".is-this-you").html "<h4>Your request could not be completed at this time</h4>"  if authResult["error"]
(->
  po = document.createElement("script")
  po.type = "text/javascript"
  po.async = true
  po.src = "https://apis.google.com/js/client:plusone.js"
  s = document.getElementsByTagName("script")[0]
  s.parentNode.insertBefore po, s
)()