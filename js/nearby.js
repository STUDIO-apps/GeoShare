//Nearby

function getNearbyRadius() {
  var settingsRef = firebase.database().ref('/settings/' + currentUid);
  settingsRef.on("child_added", function (snapshot) {
    var radius = snapshot.val();
    updateNearbyRangerText(radius);
    document.getElementById('nearby-range').value = radius;

    nearbyRadius(currentPos, radius);
  });

  settingsRef.on("child_changed", function (snapshot) {
    var radius = snapshot.val();
    updateNearbyRangerText(radius);
    document.getElementById('nearby-range').value = radius;
    nearbyCircle.set('radius', radius);
  });
}

function updateNearbyRangerText(value) {
  var output = document.querySelector("#nearby-ranger-value");
  output.value = value + "m";
  var final = (value * 1.25) + 400 - 10.02;
  output.style.left = final + 'px';
}

function nearbyRadius(center, radius) {
  nearbyCircle = new google.maps.Circle({
    strokeWeight: 0,
    fillColor: '#4caf50',
    fillOpacity: 0.25,
    map: map,
    center: center,
    radius: radius
  });
}

function nearbyFriends() {
  var count = 0;

  for (var id in friendMarker) {
    var marker = friendMarker[id];
    var latLng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            if (google.maps.geometry.spherical.computeDistanceBetween(currentPos, latLng) < 200) {
              count = count + 1;
            }
        });


    } else {
        // Browser doesn't support Geolocation
    }
  }
}
