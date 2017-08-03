var signupBtn = document.getElementById('signUpBtn');
var signIn = document.getElementById('signInBtn');

signUpBtn.addEventListener('click', function(){
    var emailField = document.getElementById('email').value;
    var passwordField = document.getElementById('password').value;
    firebase.auth().createUserWithEmailAndPassword(emailField, passwordField).catch(function(error){
        if(error != null){
            console.log(error.message);
            return;
        }
        alert('User Created');
    })
});

signInBtn.addEventListener('click', function(){
    var emailField = document.getElementById('email').value;
    var passwordField = document.getElementById('password').value;
});