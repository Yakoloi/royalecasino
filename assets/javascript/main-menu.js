$('.loader').hide();
//Initialize Firebase
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
var name, email, bet, uid, chips, paid, newUserRef;;
var userRef = database.ref("users/");
var usernameInput;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("log in cookie detected");
        logUser = firebase.auth().currentUser;
        uid = user.uid;
        name = user.displayName;
        email = user.email;
        newUserRef = database.ref("users/" + uid);
        chips = user.chips;
        console.log("chips: " + chips)
        bet = user.bet;
        $("#userName").html(name);

    } else {
        console.log("No user is signed in.");
        window.location = '../groupProject/startpage.html';
    }
});

$("#signOut").on("click", function () {
    signOut();
});

$("#blackJack").on("click", function () {
    $('.whole').fadeOut("fast");
    $('.loader').fadeIn("fast");
    setTimeout(blackJack, 1000);
});

$("#videoPoker").on("click", function () {
    $('.whole').fadeOut("fast");
    $('.loader').fadeIn("fast");
    setTimeout(videoPoker, 1000);
});

function signOut() {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}

function redirect() {
    setTimeout(redirect, 1000);
    window.location = '../groupProject/main-menu.html';
}

function blackJack() {
    setTimeout(blackJack, 1000);
    window.location = '../groupProject/blackjack-table6.html';
}

function videoPoker() {
    setTimeout(videoPoker, 1000);
    window.location = '../groupProject/blackjack-table6.html';
}


//leaderboard
database.ref("users/").orderByChild('chips').on("child_added", function (childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
    var listName = childSnapshot.val().username;
    listChips = childSnapshot.val().chips;
    console.log(listName);
    $("#user-info > tbody").prepend("<tr><td>" + listName + "</td><td>" + listChips);
});
