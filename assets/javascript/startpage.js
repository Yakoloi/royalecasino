// Initialize Firebase
var config = {
    apiKey: "AIzaSyDx2Q4c27zp0bwaoTpishDh5yRQWL8H60w",
    authDomain: "groupproject1-624dd.firebaseapp.com",
    databaseURL: "https://groupproject1-624dd.firebaseio.com",
    projectId: "groupproject1-624dd",
    storageBucket: "groupproject1-624dd.appspot.com",
    messagingSenderId: "696725330630"
};
firebase.initializeApp(config);

var database = firebase.database();
var logUser = "";
var name, email, photoUrl, uid, emailVerified;
var userRef = database.ref("users/");
var newUserRef;


firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        alert("loggedin");
        logUser = firebase.auth().currentUser;
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        uid = user.uid;
        newUserRef = database.ref("users/" + uid)
    } else {
        alert("No user is signed in.");
    }
});

$(document).ready(function () {
    console.log("ready!");


    $("#sign-up").on("click", function (event) {
        event.preventDefault();

        var emailInput = document.getElementById('email-sign-up').value;
        var passwordInput = document.getElementById('sign-up-password').value;
        firebase.auth().createUserWithEmailAndPassword(emailInput, passwordInput).catch(function (error) {
            console.log(error.code);
            console.log(error.message);
        });
        newUserInit();
    });

    $(".signIn").on("click", function (event) {
        event.preventDefault();

        var emailInput = document.getElementById('email-login').value;
        var passwordInput = document.getElementById('password').value;


        /*    firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput).catch(function (error) {
                console.log(error.code);
                console.log(error.message);
            });
*/
        firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput).catch(function (error) {

            var errorCode = error.code;
            var errorMessage = error.message;

            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
        });
    });

    function newUserInit() {

        newUserRef.set({
            chips: 1000,
            email: email,
        });
    }

});
