//Settings

function settingsPage(option) {
  switch (option) {
    case 'nearby':
      var elements = document.getElementsByClassName('content-view');
      for (var i = 0; i < elements.length; i++) {
        elements[i].className = 'content-view hidden';
      }
      document.getElementById('nearby-radius-content').className = 'content-view';

      var elements = document.getElementsByClassName('item-empty');
      for (var i = 0; i < elements.length; i++) {
        elements[i].className = 'item-empty';
      }
      document.getElementById('item-nearby-radius').className = 'item-empty selected';
      break;
    case 'name':
      var elements = document.getElementsByClassName('content-view');
      for (var i = 0; i < elements.length; i++) {
        elements[i].className = 'content-view hidden';
      }
      document.getElementById('display-name-content').className = 'content-view';

      var elements = document.getElementsByClassName('item-empty');
      for (var i = 0; i < elements.length; i++) {
        elements[i].className = 'item-empty';
      }
      document.getElementById('item-display-name').className = 'item-empty selected';
      break;
    case 'picture':
      var elements = document.getElementsByClassName('content-view');
      for (var i = 0; i < elements.length; i++) {
        elements[i].className = 'content-view hidden';
      }
      document.getElementById('profile-picture-content').className = 'content-view';

      var elements = document.getElementsByClassName('item-empty');
      for (var i = 0; i < elements.length; i++) {
        elements[i].className = 'item-empty';
      }
      document.getElementById('item-profile-picture').className = 'item-empty selected';
      break;
    case 'pwrd':
      var elements = document.getElementsByClassName('content-view');
      for (var i = 0; i < elements.length; i++) {
        elements[i].className = 'content-view hidden';
      }
      document.getElementById('chng-pwrd-content').className = 'content-view';

      var elements = document.getElementsByClassName('item-empty');
      for (var i = 0; i < elements.length; i++) {
        elements[i].className = 'item-empty';
      }
      document.getElementById('item-chng-pwrd').className = 'item-empty selected';
      break;
    case 'delete':
      var elements = document.getElementsByClassName('content-view');
      for (var i = 0; i < elements.length; i++) {
        elements[i].className = 'content-view hidden';
      }
      document.getElementById('delete-user-content').className = 'content-view warning';

      var elements = document.getElementsByClassName('item-empty');
      for (var i = 0; i < elements.length; i++) {
        elements[i].className = 'item-empty';
      }
      document.getElementById('item-delete-user').className = 'item-empty selected warning';
      break;
    default:

  }
}

function updateSettings(setting) {
  var value = null;
  switch (setting) {
    case 'nearbyRadius':
       value = parseInt(document.getElementById('nearby-range').value);
       firebase.database().ref('/settings/' + currentUid + '/' + setting).set(value);
      break;
    case 'name':
      value = document.getElementById('name-entry').value;
      firebase.database().ref('/users/' + currentUid + '/' + setting).set(value);
      firebase.database().ref('/users/' + currentUid + '/caseFoldedName').set(value.toLowerCase());
      break;
    case 'profile-picture':
      var storageRef = firebase.storage().ref();
      var profileRef = storageRef.child('profile_pictures/' + currentUid + ".png");
      profileRef.put(file).then(function (snapshot) {
        console.log('File uploaded');
      });
      break;
    case 'password':
      var password = document.getElementById('password-entry').value;
      firebase.auth().currentUser.updatePassword(password).then(function() {
        document.getElementById('password-entry').value = '';
        document.getElementById('success-pwrd-set').innerHTML = 'Password has been changed!';
        document.getElementById('error-pwrd-set').innerHTML = '';
      }).catch(function(error) {
        console.log(error.code);
        if (error.code == "auth/requires-recent-login") {
          document.getElementById('password-entry').value = '';
          document.getElementById('error-pwrd-set').innerHTML = '';
          document.getElementById('password-reauth-container').className = 'content-view-container';
          document.getElementById('set-password-container').className = 'content-view-container hidden';
        } else if (error.code == "auth/weak-password") {
          document.getElementById('password-entry').value = '';
          document.getElementById('error-pwrd-set').innerHTML = error.message;
        }
      });
      break;
    case 'auth':
      var user = firebase.auth().currentUser;
      var password = document.getElementById('password-entry-reauth').value;
      var credentials = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
      );
      user.reauthenticateWithCredential(credentials).then(function() {
        document.getElementById('password-entry-reauth').value = '';
        document.getElementById('error-reauth').innerHTML = '';
        document.getElementById('success-pwrd-set').innerHTML = 'You have been reauthenticated';
        document.getElementById('password-reauth-container').className = 'content-view-container hidden';
        document.getElementById('set-password-container').className = 'content-view-container';
      }).catch(function(error) {
        document.getElementById('password-entry-reauth').value = '';
        document.getElementById('error-reauth').innerHTML = 'The password is invalid.';
        document.getElementById('error-reauth').style.color = '#ff9800';
        console.log(error.message);
      });
      break;
    case 'delete':
      var user = firebase.auth().currentUser;
      var password = document.getElementById('password-delete-reauth').value;
      var creds = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
      );
      user.reauthenticateWithCredential(creds).then(function() {
        //Pending under pending friends
        while (Object.keys(pendingList).length > 0) {
          var friendId = Object.keys(pendingList)[0];

          firebase.database().ref('pending/' + friendId + "/" + currentUid).remove();

          delete pendingList[friendId];
        }
        //Pending currentUid
        firebase.database().ref('pending/' + currentUid).remove();
        //settings
        firebase.database().ref('settings/' + currentUid).remove();
        //current_location currentUid
        firebase.database().ref('current_location/' + currentUid).remove();
        //current_location under friends && Friends under friends id
        while (Object.keys(friendsList).length > 0) {
          var friendId = Object.keys(friendsList)[0];

          firebase.database().ref('current_location/' + friendId + "/" + currentUid).remove();
          firebase.database().ref('current_location/' + friendId + "/tracking/" + currentUid).remove();
          firebase.database().ref('friends/' + friendId + "/" + currentUid).remove();

          delete friendsList[friendId];
        }
        //Friends currentUid
        firebase.database().ref('friends/' + currentUid).remove();
        //users
        firebase.database().ref('users/' + currentUid).remove();

        var storageRef = firebase.storage().ref();

        var profileRef = storageRef.child('profile_pictures/' + currentUid + ".png");

        profileRef.delete().then(function() {
          console.log('File deleted!');
        }).catch(function(error) {
          console.log(error.message);
        });

        user.delete().then(function() {
          window.location.replace('/auth/action?mode=deleted')
        }).catch(function(error) {
          console.log(error.message);
        });
      }).catch(function(error) {
        console.log(error.message);
      });
      break;
    default:
  }
}
