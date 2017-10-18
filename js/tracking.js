function getTrackingInfo() {
  var trackingRef = firebase.database().ref('/current_location/' + currentUid + "/tracking");
  trackingRef.on("child_added", function (snapshot) {
    var id = snapshot.key;

    if (snapshot.val().tracking != null) {
      if (snapshot.val().tracking) {
        if (snapshot.val().showOnMap != null) {
          if (snapshot.val().showOnMap) {
            showTrackingFriends(id);
            nearbyFriends();
          }
        } else {
          showTrackingFriends(id);
          nearbyFriends();
        }
      }
    }

    if (snapshot.val().showOnMap != null) {
      if (!snapshot.val().showOnMap) {
        removeFriendMarker(id);
      }
    }
  });

  trackingRef.on("child_changed", function (snapshot) {
    var id = snapshot.key;

    if (snapshot.val().tracking != null) {
      if (snapshot.val().showOnMap != null) {
        if (snapshot.val().tracking && snapshot.val().showOnMap) {
          showTrackingFriends(id);
        } else {
          removeFriendMarker(id);
        }
      } else {
        if (snapshot.val().tracking) {
          showTrackingFriends(id);
        } else {
          removeFriendMarker(id);
        }
      }
    }
  });

  trackingRef.on("child_removed", function (snapshot) {
    removeFriendMarker(id);
    nearbyFriends();
  });
}

function showTrackingFriends(id) {
  var livePositionRef = firebase.database().ref('/current_location/' + id + "/location")
  livePositionRef.once("value").then(function (snapshot) {
    var lat = snapshot.val().lat;
    var long = snapshot.val().longitude;

    addFriendMarker(id, lat, long);
  });
}

function isShowingOnMap(id, checkbox) {
  var showOnMapRef = firebase.database().ref('/current_location/' + currentUid + '/tracking/' + id);
  showOnMapRef.once("value").then(function (snapshot) {
    var exists = snapshot.val();
    if (exists == null) {
      checkbox.setAttribute("checked", "");
    } else {
      if (snapshot.val().showOnMap || snapshot.val().showOnMap == null) {
        checkbox.setAttribute("checked", "");
      }
    }
  });
}

function getSharedLocations() {
  var shareRef = firebase.database().ref('/current_location/' + currentUid);
  shareRef.on("child_added", function (snapshot) {
    if (snapshot.key == "tracking") {
      console.log("Tracking");
    } else if (snapshot.key == "location") {
      console.log("Location changed");
    } else {
      addFriendMarker(snapshot.key, snapshot.val().lat, snapshot.val().longitude);
      nearbyFriends();
    }
  });

  shareRef.on("child_changed", function (snapshot) {
    if (snapshot.key == "tracking") {
      console.log("Tracking");
    } else if (snapshot.key == "location") {
      console.log("Location changed");
    } else {
      updateFriendMarker(snapshot.key, snapshot.val().lat, snapshot.val().longitude);
      nearbyFriends();
    }
  });

  shareRef.on("child_removed", function (snapshot) {
    if (snapshot.key == "tracking") {
      console.log("Tracking");
    } else if (snapshot.key == "location") {
      console.log("Location changed");
    } else {
      removeFriendMarker(snapshot.key);
      nearbyFriends();
    }
  });
}

function updateShowOnMap(id, state) {
  firebase.database().ref("/current_location/" + currentUid + "/tracking/" + id + "/showOnMap").set(state);
}
