$('.whole').hide();

setTimeout(function () {
    $('.loader').fadeOut();
    $('.loader').delay(150).fadeOut('slow');
    $(".whole").fadeIn("slow");
}, 1500);

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
        $("#startButton").click(function () {
            $('#startButton').hide();
            $('.loader').show();
            setTimeout(redirect, 2000);
        })

    } else {
        console.log("No user is signed in.");
    }
});

function newUserInit() {
    setTimeout(redirect, 1000);
    console.log("newUserInit");
    $('.login-container').fadeOut("fast");
    $('.loader').show();

    logUser.updateProfile({
        displayName: usernameInput,
    }).then(function () {
        console.log("displayname changed to: " + usernameInput);
        console.log("user is created database references set redirecting");
        redirect();
    }).catch(function (error) {
        console.log("error updating display name");
    });

    newUserRef.set({
        chips: 1000,
        email: email,
        bet: 0,
        paid: 0,
        username: usernameInput
    });
};

$("#sign-up").on("click", function (event) {
    event.preventDefault();

    var emailInput = document.getElementById('sign-up-email').value;
    var passwordInput = document.getElementById('sign-up-password').value;
    var confirmPassword = document.getElementById("confirm_password").value;
    usernameInput = document.getElementById('sign-up-username').value;

    if (passwordInput == confirmPassword) {

        firebase.auth().createUserWithEmailAndPassword(emailInput, passwordInput)
            .then(function () {
                console.log("usercreated");
                $('.login-container').fadeOut("fast");
                $('.loader').fadeIn("fast");
                setTimeout(newUserInit, 1000);
                // Success 
            })
            .catch(function (error) {
                console.log(error.message);
                $("#text").html(error.message);
            });
    } else $("#text").html("Password doesn't match");
});

$("#sign-in").on("click", function (event) {
    event.preventDefault();

    var emailInput = document.getElementById('log-in-email').value;
    var passwordInput = document.getElementById('log-in-password').value;


    firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput)
        .then(function () {
            console.log("loggedinSignIn");
            $('.login-container').fadeOut("fast");
            $('.loader').fadeIn("fast");
            setTimeout(redirect, 2000);
            // Success 
        })
        .catch(function (error) {
            console.log("please try again");
            $("#text").html(error.message);
            // Error Handling
        });

});

function redirect() {
    setTimeout(redirect, 2000);
    window.location = '../groupProject/main-menu.html';
}


//login page animation section
// first hide the login register page
$('.login-container').hide();
//click the start button
$('#startButton').one('click', function () {
    // $('body').css({
    //   'background': 'url(assets/images/signin-bg.png) no-repeat center center fixed',
    //   'background-size': 'cover'
    // });
    // $('#startButton').hide();
    //$('.blink').hide();
    //$('.login-container').show();
    $('#startButton').show();
    setTimeout(function () {
        $('#startButton').hide();
        $('.loader').fadeIn("fast");
    }, 300);
    $('.blink').show();
    setTimeout(function () {
        $('.blink').hide();
    }, 300);
    $('.login-container').hide();
    setTimeout(function () {
        $('.login-container').fadeIn("slow");
    }, 2000);

});
//animation for the login/signup panel
$(".log-in").on('click', function () {
    $(".signIn").addClass("active-dx");
    $(".signUp").addClass("inactive-sx");
    $(".signUp").removeClass("active-sx");
    $(".signIn").removeClass("inactive-dx");
});
//animation for the login/goback pannel
$(".back").on('click', function () {
    $(".signUp").addClass("active-sx");
    $(".signIn").addClass("inactive-dx");
    $(".signIn").removeClass("active-dx");
    $(".signUp").removeClass("inactive-sx");
});