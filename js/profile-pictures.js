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
