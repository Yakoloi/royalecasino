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
         window.location = '../groupProject/blackjack-table6.html';

     } else {
         console.log("No user is signed in.");
     }
 });

 function newUserInit() {
     console.log("newUserInit");

     logUser.updateProfile({
         displayName: usernameInput,
     }).then(function () {
         console.log("displayname changed to: " + usernameInput);
         console.log("user is created database references set redirecting");
         window.location = '../groupProject/blackjack-table6.html';
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

     setTimeout(newUserInit, 2500);

     var emailInput = document.getElementById('sign-up-email').value;
     var passwordInput = document.getElementById('sign-up-password').value;
     usernameInput = document.getElementById('sign-up-username').value;

     if (passwordInput.length < 6) {
         alert("Password must be 6 characters or greater");
     }

     firebase.auth().createUserWithEmailAndPassword(emailInput, passwordInput).catch(function (error) {
         console.log(error.code);
         console.log(error.message);
     });

 });

 $("#sign-in").on("click", function (event) {
     event.preventDefault();

     var emailInput = document.getElementById('log-in-email').value;
     var passwordInput = document.getElementById('log-in-password').value;


     firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput)
         .then(function () {
             console.log("loggedinSignIn");
             window.location = '../groupProject/blackjack-table6.html';
             // Success 
         })
         .catch(function (error) {
             console.log("please try again");
             // Error Handling
         });

 });

 //login page animation section
 // first hide the login register page
 $('.login-container').hide();
 //click the start button
 $('#startButton').on('click', function () {
     // $('body').css({
     //   'background': 'url(assets/images/signin-bg.png) no-repeat center center fixed',
     //   'background-size': 'cover'
     // });
     $('#startButton').hide();
     $('.blink').hide();
     $('.login-container').show();
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
 //validate password matching
 var signUpPassword = document.getElementById("sign-up-password")
 var confirm_password = document.getElementById("confirm_password");

 function validatePassword() {
     if (signUpPassword.value != confirm_password.value) {
         confirm_password.setCustomValidity("Passwords Don't Match");
     } else {
         confirm_password.setCustomValidity('');
     }
 }
 signUpPassword.onchange = validatePassword;
 confirm_password.onkeyup = validatePassword;
