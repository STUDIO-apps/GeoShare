document.addEventListener('DOMContentLoaded', function() {
  var mode = getParameterByName('mode');
  var signOut = getParameterByName('signedOut');

  switch (mode) {
    case 'resetPassword':
      handleResetPassword();
      break;
    case 'recoverEmail':
      handleRecoverEmail();
      break;
    default:
  }

  switch (signOut) {
    case 'success':
      window.location.replace('google.com');
      break;
    case 'failed':
      window.location.replace('../../');
      break;
    default:

  }
}, false);

function getParameterByName(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);

    if(results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function handleResetPassword(auth, actionCode) {
  var accountEmail;
  // Verify the password reset code is valid.
  auth.verifyPasswordResetCode(actionCode).then(function(email) {
    var accountEmail = email;

    // TODO: Show the reset screen with the user's email and ask the user for
    // the new password.

    // Save the new password.
    auth.confirmPasswordReset(actionCode, newPassword).then(function(resp) {
      // Password reset has been confirmed and new password updated.

      // TODO: Display a link back to the app, or sign-in the user directly
      // if the page belongs to the same domain as the app:
      // auth.signInWithEmailAndPassword(accountEmail, newPassword);
    }).catch(function(error) {
      // Error occurred during confirmation. The code might have expired or the
      // password is too weak.
    });
  }).catch(function(error) {
    // Invalid or expired action code. Ask user to try to reset the password
    // again.
  });
}
