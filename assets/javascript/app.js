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
var provider = new firebase.auth.GoogleAuthProvider();

console.log("database "+ database)
console.log("provider "+ provider)

function signIn(){
    //oAuth firebase sign up
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;

    //sign up existing users
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
});
});

    setup();
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
  } else {
    // User is signed out.
    // ...
  }
});




firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // ...
  }
  // The signed-in user info.
  var user = result.user;
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});



var highScore = [];
var username = []; //to be incorporated into objects?

$("#startbutton").click(function () {
    //click to start
    //signIn();
    setup();
});



function setup() {
    $("#menu").html("<image></image>");
    $("#about").html("<image></image");
    $("#startS").html("<image></image");
    // $("startM").html("<image></image>");
    $("#leaderB").html("<image></image>")
}


$("#about").click(function () {
    //fancyboxpopout 
});


$("startS").click(function () {
    //startsgame
    sGameStart();
});

/*$("startM").click(function(){
   //starts multiplayer
    mGameStart();
});*/

$("leaderB").click(function () {
    //use firebase to populate leaderboard
    $("#leader-board > lbody").append("<tr><td>" + "username" + "userscore")
})
