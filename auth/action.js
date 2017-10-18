function showSignin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('new-account').style.display = 'block';
    document.getElementById('forgot-password').style.display = 'block';
}

function showSignup() {
    document.getElementById('signupForm').style.display = 'block';
    document.getElementById('back').style.display = 'block';
}

function handleSignIn(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        console.log(error.message);
        document.getElementById('errorMessage').innerHTML = error.message;
    });
}

function handleSignUp(name, email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
        isNewUser = true;
        newName = name;
        newEmail = email;
    }).catch(function (error) {
        console.log(error.message);
        document.getElementById('errorMessage').innerHTML = error.message;
    });
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);

    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function handleResetPassword(auth, actionCode) {
    var accountEmail;
    // Verify the password reset code is valid.
    if (actionCode == '') {
        document.getElementById('getResetPasswordForm').style.display = 'block';
        document.getElementById('back').style.display = 'block';
    } else {
        auth.verifyPasswordResetCode(actionCode).then(function (email) {
            var accountEmail = email;

            // TODO: Show the reset screen with the user's email and ask the user for
            // the new password.
            document.getElementById('resetPasswordForm').style.display = 'block';
            document.getElementById('resetEmail').value = accountEmail;


        }).catch(function (error) {
            document.getElementById('errorMessage').innerHTML = error.message;
            // Invalid or expired action code. Ask user to try to reset the password
            // again.
        });
    }
}

function resetPassword(accountEmail, newPassword) {
    var actionCode = getParameterByName('oobCode');
    // Save the new password.
    firebase.auth().confirmPasswordReset(actionCode, newPassword).then(function (resp) {
        console.log("Here now!");
        // Password reset has been confirmed and new password updated.

        // TODO: Display a link back to the app, or sign-in the user directly
        // if the page belongs to the same domain as the app:
        // auth.signInWithEmailAndPassword(accountEmail, newPassword);
        firebase.auth().signInWithEmailAndPassword(accountEmail, newPassword);
    }).catch(function (error) {
        console.log("Ohh no!");
        document.getElementById('errorMessage').innerHTML = error.message;
        // Error occurred during confirmation. The code might have expired or the
        // password is too weak.
    });
}

function sendPasswordResetEmail(email) {
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        console.log("Email sent!")
        document.getElementById('errorMessage').innerHTML = 'Email sent!';
    }).catch(function (error) {
        console.log(error.message)
        document.getElementById('errorMessage').innerHTML = error.message;
    })
}

function handleRecoverEmail() {

}

function enterPressed(event, id) {
    if (event.keyCode == 13 || event.which == 13) {
      document.getElementById(id).click();
      return false;
    }
    return true;
}
