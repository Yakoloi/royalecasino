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
 var name, email, bet, uid, chips;
 var userRef = database.ref("users/");
 var newUserRef;


 firebase.auth().onAuthStateChanged(function (user) {
     if (user) {
         alert("loggedin");
         logUser = firebase.auth().currentUser;
         uid = user.uid;
         name = user.displayName;
         email = user.email;
         newUserRef = database.ref("users/" + uid);
         chips = user.chips;
         console.log("chips: " + chips)
         bet = user.bet;

     } else {
         console.log("No user is signed in.");
     }
 });

 var signUpBtn = document.getElementById('signUpBtn');
 var signInBtn = document.getElementById("signInBtn");


 /*signUpBtn.addEventListener("click", function () {
     var emailInput = document.getElementById('email').value;
     var passwordInput = document.getElementById('password').value;
     firebase.auth().createUserWithEmailAndPassword(emailInput, passwordInput).catch(function (error) {
         console.log(error.code);
         console.log(error.message);
     });

     //newUserInit();

     function newUserInit() {

         newUserRef.set({
             chips: 1000,
             email: email,
             bet: 0,
         });

         alert("user is created")
     };
     setTimeout(newUserInit, 4000);


 });*/

 $("#sign-up").on("click", function (event) {
     event.preventDefault();
     
     
     var emailInput = document.getElementById('sign-up-email').value;
     var passwordInput = document.getElementById('sign-up-password').value;
     firebase.auth().createUserWithEmailAndPassword(emailInput, passwordInput).catch(function (error) {
         console.log(error.code);
         console.log(error.message);
     });

     //newUserInit();
     function newUserInit() {

         newUserRef.set({
             chips: 1000,
             email: email,
             bet: 0,
         });

         alert("user is created")
     };
     setTimeout(newUserInit, 3000);

 });

 $("#sign-in").on("click", function (event) {
     event.preventDefault();
     var emailInput = document.getElementById('log-in-email').value;
     var passwordInput = document.getElementById('log-in-password').value;

     firebase.auth().signInWithEmailAndPassword(emailInput, passwordInput).catch(function (error) {
         console.log(error.code);
         console.log(error.message);
     });

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
