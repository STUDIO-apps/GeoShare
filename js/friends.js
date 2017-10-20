//Friends

function getFriendsList() {
  var friendRef = firebase.database().ref('/friends/' + currentUid);
  friendRef.on("child_added", function (snapshot) {
    var id = snapshot.key;
    var ref = firebase.database().ref('/users/' + id);

    if (id in pendingList) {
      delete pendingList[id];
    }
    friendsList[id] = true;

    ref.on("value", function (snapshot) {
        friendName = (snapshot.val() && snapshot.val().name);
        addFriendElement(id, friendName);
        addFriendManagerElement(id, friendName);
    }, function (error) {
        console.log(error.code);
    });

  });

  friendRef.on("child_removed", function (snapshot) {
    delete friendsList[snapshot.key];
    removeFriendElement(snapshot.key);
    removeFriendElement(snapshot.key + '-manager');
  })
}

function addFriendManagerElement(id, name) {
  var friendCurrentItem = document.createElement("DIV");
  friendCurrentItem.className = 'friendCurrentItem';
  friendCurrentItem.id = id + '-manager';

  var friendCurrentNameContainer = document.createElement("H2");
  var friendCurrentName = document.createTextNode(name);

  var friendCurrentPicture = document.createElement("IMG");
  friendCurrentPicture.className = 'friendCurrentPicture';
  getProfileImage(id, friendCurrentPicture);

  var optionsContainer = document.createElement("DIV");
  optionsContainer.className = 'optionsContainer';

  var friendCurrentMore = document.createElement("IMG");
  friendCurrentMore.className = 'friendCurrentMore';
  friendCurrentMore.src = 'img/more.png';

  var more = document.createElement("DIV");
  more.className = 'more';
  more.id = 'more';

  var friendOptionsRemove = document.createElement("DIV");
  friendOptionsRemove.className = 'friendOptionsRemove';
  var friendOptionsRemoveContainer = document.createElement("H3");
  var friendOptionsRemoveText = document.createTextNode("Unfriend");

  friendOptionsRemove.onclick = function() {
    firebase.database().ref('/friends/' + currentUid + "/" + id).remove();
    firebase.database().ref('/friends/' + id + "/" + currentUid).remove();

    firebase.database().ref('/current_location/' + currentUid + "/" + id).remove();
    firebase.database().ref('/current_location/' + id + "/" + currentUid).remove();
  }

  friendOptionsRemoveContainer.appendChild(friendOptionsRemoveText);
  friendOptionsRemove.appendChild(friendOptionsRemoveContainer);

  more.appendChild(friendOptionsRemove);

  optionsContainer.appendChild(friendCurrentMore);
  optionsContainer.appendChild(more);

  friendCurrentNameContainer.appendChild(friendCurrentName);
  friendCurrentItem.appendChild(friendCurrentPicture);
  friendCurrentItem.appendChild(friendCurrentNameContainer);
  friendCurrentItem.appendChild(optionsContainer);

  document.getElementById('tab-0-content').appendChild(friendCurrentItem);


}

function removeFriendElement(id) {
  var friendContainer = document.getElementById(id);
  friendContainer.remove();
}

//Friend requests

function getFriendRequests() {
  var friendRequestRef = firebase.database().ref('/pending/' + currentUid);
  friendRequestRef.on("child_added", function (snapshot) {
    var id = snapshot.key;
    var isOutgoing = snapshot.val().outgoing;
    var ref = firebase.database().ref('/users/' + id);
    ref.on("value", function (snapshot) {
      var name = (snapshot.val() && snapshot.val().name);
      pendingList[id] = true;
      addRequestElement(id, name, isOutgoing);
    })
  });

  friendRequestRef.on("child_removed", function (snapshot) {
    delete pendingList[snapshot.key];
    removeFriendElement(snapshot.key + "-manager-request");
  });
}

function addRequestElement(id, name, isOutgoing) {
  var friendRequestItem = document.createElement("DIV");
  friendRequestItem.className = 'friendRequestItem';
  friendRequestItem.id = id + '-manager-request';

  var friendRequestNameContainer = document.createElement("H2");
  var friendRequestName = document.createTextNode(name);

  var friendRequestPicture = document.createElement("IMG");
  friendRequestPicture.className = 'friendRequestPicture';
  getProfileImage(id, friendRequestPicture);

  var acceptRejectContainer = document.createElement("DIV");
  acceptRejectContainer.className = 'acceptRejectContainer';

  var acceptButton = document.createElement("IMG");
  acceptButton.src = 'img/accept.png';
  acceptButton.title = 'accept';

  var rejectButton = document.createElement("IMG");
  rejectButton.src = 'img/decline.png';
  rejectButton.title = 'decline';

  rejectButton.onclick = function() {
    firebase.database().ref('/pending/' + id + "/" + currentUid).remove();
    firebase.database().ref('/pending/' + currentUid + "/" + id).remove();
  }

  friendRequestNameContainer.appendChild(friendRequestName);
  friendRequestItem.appendChild(friendRequestPicture);
  friendRequestItem.appendChild(friendRequestNameContainer);
  friendRequestItem.appendChild(acceptRejectContainer);

  if (!isOutgoing) {
    acceptButton.onclick = function() {
      firebase.database().ref('/pending/' + id + "/" + currentUid).remove();
      firebase.database().ref('/pending/' + currentUid + "/" + id).remove();
      firebase.database().ref('/friends/' + currentUid + "/" + id).set(true);
      firebase.database().ref('/friends/' + id + "/" + currentUid).set(true);
    }

    acceptRejectContainer.appendChild(acceptButton);
    acceptRejectContainer.appendChild(rejectButton);
    document.getElementById('incoming-container').appendChild(friendRequestItem);
    document.getElementById('no-incoming-text').style.display = 'none';
  } else {
    acceptRejectContainer.appendChild(rejectButton);
    document.getElementById('outgoing-container').appendChild(friendRequestItem);
    document.getElementById('no-outgoing-text').style.display = 'none';
  }
}

//Search

function getSearchResults(value) {
  removeSearchElements();
  if (value != "") {
    var searchResultsRef = firebase.database().ref('/users/').orderByChild('caseFoldedName').startAt(value.toLowerCase()).endAt(value.toLowerCase() + '~');
    searchResultsRef.once('value', function (snapshot) {
      snapshot.forEach(function(ds) {
        var id = ds.key;
        var name = ds.val().name;
        if (id != currentUid) {
          addSearchResultsElements(id, name);
        }
      });
    });
  }
}

function addSearchResultsElements(id, name) {
  var searchItem = document.createElement("DIV");
  searchItem.className = 'searchItem';
  searchItem.id = id;

  var searchNameContainer = document.createElement("H2");
  var searchName = document.createTextNode(name);
  var searchPicture = document.createElement("IMG");
  searchPicture.className = 'searchPicture';

  if (id in friendsList) {
    var isFriendIndicator = document.createElement("IMG");
    isFriendIndicator.className = 'friendIndicator';
    isFriendIndicator.title = 'Friend';
    isFriendIndicator.src = 'img/person.png';
  } else if (id in pendingList) {
    var isFriendIndicator = document.createElement("IMG");
    isFriendIndicator.className = 'friendIndicator';
    isFriendIndicator.title = 'Friend request sent'
    isFriendIndicator.src = 'img/person-grey.png';
  } else {
    var sendRequest = document.createElement("IMG");
    sendRequest.className = 'sendRequest';
    sendRequest.src = '';

    sendRequest.onclick = function() {
      firebase.database().ref('/pending/' + currentUid + "/" + id + "/outgoing").set(true);
      firebase.database().ref('/pending/' + id + "/" + currentUid + "/outgoing").set(false);

      var isFriendIndicator = document.createElement("IMG");
      isFriendIndicator.className = 'friendIndicator';
      isFriendIndicator.title = 'Friend request sent'
      isFriendIndicator.src = 'img/person-grey.png';

      searchItem.appendChild(isFriendIndicator);

      sendRequest.remove();
    }
  }

  getProfileImage(id, searchPicture);

  searchNameContainer.appendChild(searchName);
  searchItem.appendChild(searchPicture);
  searchItem.appendChild(searchNameContainer);

  if (id in friendsList || id in pendingList) {
    searchItem.appendChild(isFriendIndicator);
  } else {
    searchItem.appendChild(sendRequest);
  }

  document.getElementById('search-results-container').insertBefore(searchItem, document.getElementById('search-results-container').firstChild);
}

function removeSearchElements() {
  var searchResContainer = document.getElementById('search-results-container');
  while (searchResContainer.lastChild) {
    searchResContainer.removeChild(searchResContainer.lastChild);
  }
}

/* Right nav view */

function addFriendElement(id, name) {
  var friendContainer = document.createElement("DIV");
  friendContainer.className = 'friendContainer';
  friendContainer.id = id;

  var friendItem = document.createElement("DIV");
  friendItem.className = 'friendItem';

  var friendNameContainer = document.createElement("H2");
  var friendName = document.createTextNode(name);
  var friendPicture = document.createElement("IMG");

  getProfileImage(id, friendPicture);

  friendNameContainer.appendChild(friendName);
  friendItem.appendChild(friendNameContainer);
  friendItem.appendChild(friendPicture);
  friendContainer.appendChild(friendItem);

  document.getElementById('friendsWrapper').appendChild(friendContainer);

  friendContainer.onclick = function() {
    //addParameter("window.location.href", "friendId", id, false);

    if (currentSelection != null && currentSelection != id) {
      document.getElementById(currentSelection + '-options').remove();
      document.getElementById(currentSelection).className = ('friendContainer');
    }
    var optionDiv = document.getElementById(id + '-options');
    if (optionDiv == null) {
      document.getElementById(id).className = ('friendContainer no-hover');
      //Container
      var friendOptionsContainer = document.createElement("DIV");
      friendOptionsContainer.className = 'friendOptionsContainer';
      friendOptionsContainer.id = id + '-options';

      //Options
      //Share option
      var friendOptionsShareContainer = document.createElement("DIV");
      friendOptionsShareContainer.className = 'friendOptionsItem first';
      var friendOptionsShare = document.createElement("H2");
      var friendOptionsShareText = document.createTextNode('Share current location');
      friendOptionsShare.appendChild(friendOptionsShareText);
      friendOptionsShareContainer.appendChild(friendOptionsShare);

      friendOptionsShareContainer.onclick = function(event) {
        event.stopPropagation()

        //Share dialog
        var shareDialogContainer = document.createElement("DIV");
        shareDialogContainer.className = 'shareDialogContainer';
        shareDialogContainer.id = 'shareDialogContainer';

        var shareDialogBackground = document.createElement("DIV");
        shareDialogBackground.className = 'shareDialogBackground';

        var shareDialog = document.createElement("DIV");
        shareDialog.className = 'shareDialog';

        var shareDialogTextContainer = document.createElement("H2");
        var shareDialogText = document.createTextNode("THIS WILL SHARE YOUR CURRENT LOCATION \n GET THE APP FOR LIVE TRACKING");
        shareDialogTextContainer.appendChild(shareDialogText);

        var shareDialogButtonContainer = document.createElement("DIV");
        shareDialogButtonContainer.className = 'shareDialogButtonContainer';

        var shareDialogCancelButton = document.createElement("DIV");
        shareDialogCancelButton.className = 'shareDialogButton';
        var shareDialogTextCancelContainer = document.createElement("H2");
        var shareDialogTextCancel = document.createTextNode("CANCEL");
        shareDialogTextCancelContainer.appendChild(shareDialogTextCancel);

        shareDialogCancelButton.onclick = function(event) {
          shareDialogContainer.remove();
        }

        shareDialogCancelButton.appendChild(shareDialogTextCancelContainer);

        var shareDialogGetButton = document.createElement("DIV");
        shareDialogGetButton.className = 'shareDialogButton';
        var shareDialogTextGetContainer = document.createElement("H2");
        var shareDialogTextGet = document.createTextNode("GET THE ANDROID APP");
        shareDialogTextGetContainer.appendChild(shareDialogTextGet);

        shareDialogGetButton.onclick = function(event) {

        }

        shareDialogGetButton.appendChild(shareDialogTextGetContainer);

        var shareDialogContinueButton = document.createElement("DIV");
        shareDialogContinueButton.className = 'shareDialogButton';
        var shareDialogTextOkContainer = document.createElement("H2");
        var shareDialogTextOk = document.createTextNode("SHARE");
        shareDialogTextOkContainer.appendChild(shareDialogTextOk);

        shareDialogContinueButton.onclick = function(event) {
          shareCurrentLocation(id, shareDialogContainer);
        }

        shareDialogContinueButton.appendChild(shareDialogTextOkContainer);

        shareDialogButtonContainer.appendChild(shareDialogCancelButton);
        shareDialogButtonContainer.appendChild(shareDialogGetButton);
        shareDialogButtonContainer.appendChild(shareDialogContinueButton);

        shareDialog.appendChild(shareDialogTextContainer);
        shareDialog.appendChild(shareDialogButtonContainer);
        shareDialogContainer.appendChild(shareDialogBackground);
        shareDialogContainer.appendChild(shareDialog);


        document.body.appendChild(shareDialogContainer);
      }

      //Find option
      var friendOptionsFindContainer = document.createElement("DIV");
      friendOptionsFindContainer.className = 'friendOptionsItem';
      var friendOptionsFind = document.createElement("H2");
      var friendOptionsFindText = document.createTextNode('Find location');
      friendOptionsFind.appendChild(friendOptionsFindText);
      friendOptionsFindContainer.appendChild(friendOptionsFind);

      friendOptionsFindContainer.onclick = function(event) {
        event.stopPropagation()
        var marker = friendMarker[id];
        if (marker != null) {
          var latLng = new google.maps.LatLng(marker.position.lat(), marker.position.lng());
          map.panTo(latLng);
          map.setZoom(17);
        }
      }

      //Show option
      var friendOptionsShowContainer = document.createElement("DIV");
      friendOptionsShowContainer.className = 'friendOptionsItem last';
      var friendOptionsShow = document.createElement("H2");
      var friendOptionsShowText = document.createTextNode('Show on map');

      var friendOptionsShowCheckbox = document.createElement("INPUT");
      friendOptionsShowCheckbox.setAttribute("type", "checkbox");
      isShowingOnMap(id, friendOptionsShowCheckbox);

      friendOptionsShow.appendChild(friendOptionsShowText);
      friendOptionsShowContainer.appendChild(friendOptionsShow);
      friendOptionsShowContainer.appendChild(friendOptionsShowCheckbox);

      friendOptionsShowContainer.onclick = function(event) {
        event.stopPropagation();
        friendOptionsShowCheckbox.checked = !friendOptionsShowCheckbox.checked;
        updateShowOnMap(id, friendOptionsShowCheckbox.checked);
      }

      friendOptionsShowCheckbox.onclick = function(event) {
        event.stopPropagation();
        updateShowOnMap(id, friendOptionsShowCheckbox.checked);
      }

      //Append children to parent container
      friendOptionsContainer.appendChild(friendOptionsShareContainer);
      friendOptionsContainer.appendChild(friendOptionsFindContainer);
      friendOptionsContainer.appendChild(friendOptionsShowContainer);

      document.getElementById(id).appendChild(friendOptionsContainer);

      currentSelection = id;
    } else {
      currentSelection = null;
      optionDiv.remove();
      document.getElementById(id).className = ('friendContainer');
    }
  };
}

//Get profile from storage

function getProfileImage(id, friendPicture) {
  var imageUrl = null;
  //Profile picture
  var storage = firebase.storage();
  var gsRef = storage.refFromURL('gs://modular-decoder-118720.appspot.com/profile_pictures');

  gsRef.child('/' + id + '.png').getDownloadURL().then(function (url) {
      friendPicture.src = url;
  }).catch(function (error) {
    friendPicture.src = 'img/dummy-profile.png'
  });
}
