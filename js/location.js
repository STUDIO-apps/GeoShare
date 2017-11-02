//Locations

function getLatLng() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
          position = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
          };
      });
  } else {
      // Browser doesn't support Geolocation
  }
}

function centerMyLocation() {
  console.log(currentPos);
  map.panTo(currentPos);
  map.setZoom(17);
}

//Location sharing

function shareCurrentLocation(id, dialog) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        firebase.database().ref('/current_location/' + id + "/" + currentUid).set({
          lat: position.coords.latitude,
          longitude: position.coords.longitude,
          timeStamp: Date.now()
        }).then(function(event) {
          dialog.remove();
        }).catch(function (error) {
          console.log(error);
        });
    });
  } else {
    // Browser doesn't support Geolocation
    console.log("No support");
  }
}
