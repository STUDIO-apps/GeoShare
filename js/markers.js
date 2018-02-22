//Markers

function createFriendMarkerImage(id) {
  var canvas, context;

  var width = 64;
  var height = 86;
  var radius = 4;

  var marker = friendMarker[id];

  var markerImg = new Image();
  markerImg.src = 'img/marker.png';

  canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext("2d");

  context.clearRect(0,0,width,height);

  var markerImg = new Image();
  markerImg.setAttribute('crossOrigin', 'anonymous');
  markerImg.src = 'img/marker.png';

  var markerProfileImg = new Image();
  markerProfileImg.setAttribute('crossOrigin', 'anonymous');
  //Profile picture
  var storage = firebase.storage();
  var gsRef = storage.refFromURL('gs://modular-decoder-118720.appspot.com/profile_pictures');

  gsRef.child('/' + id + '.png').getDownloadURL().then(function (url) {
      markerProfileImg.src = url;
  }).catch(function (error) {

  });

  markerProfileImg.onload = function() {
    context.drawImage(markerImg, 0, 0, width, height);
    context.drawImage(scaleImage(20, 20, 40, 40, 20, markerProfileImg), 12, 14);

    marker.setIcon(canvas.toDataURL());
  }
}

function addFriendMarker(id, lat, long) {
  var latLong = {lat: lat, lng: long};
  var marker = new google.maps.Marker({
    position: latLong,
    map: map
  });
  friendMarker[id] = marker;
  createFriendMarkerImage(id);

  var ref = firebase.database().ref('/users/' + id);
  ref.on("value", function (snapshot) {
    var name = (snapshot.val() && snapshot.val().name);
    marker.setTitle(name);
  })
}

function updateFriendMarker(id, lat, long) {
  var latLong = {lat: lat, lng: long};
  var marker = friendMarker[id];
  marker.setPosition(latLong);
}

function friendMarkerVisibility(id, state) {
  var marker = friendMarker[id];
  if (marker != null) {
    marker.setVisible(state)
  }
}

function removeFriendMarker(id) {
  var marker = friendMarker[id];
  if (marker != null) {
    marker.setMap(null);
    delete friendMarker[id];
  }
}
