var firebaseScript = document.createElement('script');
firebaseScript.type = 'text/javascript';
firebaseScript.src = 'https://www.gstatic.com/firebasejs/4.5.0/firebase.js';
document.head.appendChild(firebaseScript);

var appScript = document.createElement('script');
appScript.type = 'text/javascript';
appScript.src = 'https://www.gstatic.com/firebasejs/4.5.0/firebase-app.js';
document.head.appendChild(appScript);

var authScript = document.createElement('script');
authScript.type = 'text/javascript';
authScript.src = 'https://www.gstatic.com/firebasejs/4.5.0/firebase-auth.js';
document.head.appendChild(authScript);

document.addEventListener('DOMContentLoaded', function () {
    var mode = getParameterByName('mode');
    var signOut = getParameterByName('signedOut');

    var auth = firebase.auth();

    switch (mode) {
        case 'resetPassword':
            handleResetPassword(auth, getParameterByName('oobCode'));
            break;
        case 'recoverEmail':
            handleRecoverEmail();
            break;
        /*case 'LOGIN':
            handleSignIn(getParameterByName('email'), getParameterByName('password'));
            break;*/
        case 'signin':
            showSignin();
            break;
        case 'signup':
            showSignup();
            break;
        default:
    }

    switch (signOut) {
        case 'success':
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('new-account').style.display = 'none';
            document.getElementById('forgot-password').style.display = 'none';
            break;
        case 'failed':
            window.location.replace('../');
            break;
        default:

    }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.location.replace('../')
        }
    });
}, false);

function showSignin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('new-account').style.display = 'block';
    document.getElementById('forgot-password').style.display = 'block';
}

function showSignup() {
    document.getElementById('signupForm').style.display = 'block';
}

function handleSignIn(email, password) {
    console.log(email + ' ' + password);
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
        console.log(error.message);
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
    } else {
        auth.verifyPasswordResetCode(actionCode).then(function (email) {
            var accountEmail = email;

            // TODO: Show the reset screen with the user's email and ask the user for
            // the new password.
            document.getElementById('resetPasswordForm').style.display = 'block';

            // Save the new password.
            auth.confirmPasswordReset(actionCode, newPassword).then(function (resp) {
                // Password reset has been confirmed and new password updated.

                // TODO: Display a link back to the app, or sign-in the user directly
                // if the page belongs to the same domain as the app:
                // auth.signInWithEmailAndPassword(accountEmail, newPassword);
            }).catch(function (error) {
                // Error occurred during confirmation. The code might have expired or the
                // password is too weak.
            });
        }).catch(function (error) {
            // Invalid or expired action code. Ask user to try to reset the password
            // again.
        });
    }
}

function handleRecoverEmail() {

}
