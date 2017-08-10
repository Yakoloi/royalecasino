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
var name, email, currentBet, uid //chips
var userRef = database.ref("users/");
var newUserRef;

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log("user logged in")
        logUser = firebase.auth().currentUser;
        name = user.displayName;
        email = user.email;
        uid = user.uid;
        newUserRef = database.ref("users/" + uid);
        init();
        deckObj.createDeck();
        console.log("variable reset")
    } else {
        console.log("No user is signed in.");
        window.location = '../groupProject/startpage.html'
    }
});

function updateVariables() {
    newUserRef.once("value").then(function (snapshot) {
        game.playerChips = snapshot.child("chips").val();
        game.playerBet = snapshot.child("bet").val();
        console.log("chips: " + game.playerChips);
        console.log("currentBet: " + game.playerBet);
        $("#playerChips").html("Player Chips: " + game.playerChips);
        $("#betMoney").html("Bet: " + game.playerBet);
    })
}

//Initialize start
function init() {
    database.ref("users/" + uid + "/bet").set(0);
    newUserRef.once("value").then(function (snapshot) {
        game.playerChips = snapshot.child("chips").val();
        game.playerBet = snapshot.child("bet").val();
        console.log("chips: " + game.playerChips);
        console.log("currentBet: " + game.playerBet);
        $("#playerChips").html("Player Chips: " + game.playerChips);
        $("#bet").html("Bet: " + game.playerBet)
        $("#userName").html(name);
        updateVariables()

    })
}

function signOut() {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}


$("#signOut").click(function () {
    console.log("signing out");
    signOut();
})

var audio = document.createElement('audio');
audio.setAttribute("src", "assets/audio/cardsound.mp3");

var click = document.createElement('audio');
click.setAttribute("src", "assets/audio/click.mp3");


var deckObj = {

    deckID: "",
    queryURL: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
    deck: [],

    createDeck: function () {
        $.ajax({
                url: deckObj.queryURL,
                method: "GET"
            })
            .done(function (response) {
                deckID = response.deck_id;

                deckObj.getDeck();
            });
    },


    getDeck: function () {
        var queryURL6 = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=52";
        $.ajax({
                url: queryURL6,
                method: "GET"
            })
            .done(function (response) {

                deck = response.cards;
                $("#buttonView").append("<button id='dealCards' type='button' class='btn btn-md'>Deal Cards</button>");
                $("#chipOne").on('click', function () {
                    game.betFunction(1);
                    $("#chipTwenty").off('click');
                    $("#chipOne").off('click');
                    $("#chipFive").off('click');
                    $("#chipTen").off('click');

                });
                $("#chipFive").on('click', function () {
                    game.betFunction(5);
                    $("#chipTwenty").off('click');
                    $("#chipOne").off('click');
                    $("#chipFive").off('click');
                    $("#chipTen").off('click');
                });
                $("#chipTen").on('click', function () {

                    game.betFunction(10);
                    $("#chipTwenty").off('click');
                    $("#chipOne").off('click');
                    $("#chipFive").off('click');
                    $("#chipTen").off('click');
                });
                $("#chipTwenty").on('click', function () {

                    game.betFunction(20);
                    $("#chipTwenty").off('click');
                    $("#chipOne").off('click');
                    $("#chipFive").off('click');
                    $("#chipTen").off('click');

                });

                //     $(".img-responsive chips").one('click', function() {
                //         game.betFunction(20)
                // });

                $("#dealCards").one('click', function () {
                    audio.play();
                });
                $("#dealCards").one('click', game.dealCards);


            });

    },
    playAgain: function () {

        //reset everything
        $("#playerScore").html("Player Score: 0");
        //$("#playerChips").html("Playagain: " + chips);
        $("#dealerScore").html("Dealer Score: 0");
        $("#buttonView").html("");
        $("#handView").html("");
        $("#dealerHand").html("");
        $("#gameText").html("");
        dealer.dealerBustCheck = false;
        game.playerScore = 0;
        game.playerCards = [];
        dealer.dealerScore = 0;
        dealer.dealerCards = [];
        game.playerBet = 0;
        updateVariables();


        deckObj.createDeck();
    },
    gameOverDisplay: function () {
        //display reset button
        $("#buttonView").html("");
        $("#buttonView").append("<button id='playAgain' type='button' class='btn btn-md'>Play Again</button>");
        $("#playAgain").one('click', deckObj.playAgain);
        $("#playAgain").one('click', function () {
            audio.play();
        });

    }


}

var game = {
    arrayhand: {},
    buttonChoice: "",
    playerCards: [],
    playerScore: 0,
    playerBet: 0,
    playerChips,

    drawCard: function () {
        var card1ImgURL = deck[deck.length - 1].image;
        var card1Img = "<img class='cards' src='" + card1ImgURL + "'</img>"
        $("#handView").append(card1Img)

        //Adding cards to array with suit and card value
        game.playerCards.push([deck[deck.length - 1].suit, deck[deck.length - 1].value]);
        console.log("Player just clicked hit, deck seen below");
        console.log(game.playerCards);
        deck.pop();
    },

    dealCards: function () {
        $(".playerChoiceButtons").off('click');
        //get hand
        var card1ImgURL = deck[deck.length - 1].image;
        var card1Img = "<img class='cards' src='" + card1ImgURL + "'</img>"
        $("#handView").append(card1Img)
        var card2ImgURL = deck[deck.length - 2].image;
        var card2Img = "<img class='cards' src='" + card2ImgURL + "'</img>"
        $("#handView").append(card2Img)


        //Adding cards to array with suit and card value
        game.playerCards.push([deck[deck.length - 1].suit, deck[deck.length - 1].value]);
        game.playerCards.push([deck[deck.length - 2].suit, deck[deck.length - 2].value]);
        console.log(game.playerCards);
        deck.pop();
        deck.pop();
        //how to access an array in an array (game.playerCards[0])[1]
        console.log((game.playerCards[0])[1]);
        console.log(deck);
        // console.log(typeof (game.playerCards[0])[1]);
        dealer.drawCard();
        game.updatePlayerScore();
        game.playerChoices();


    },
    playerChoices: function () {
        game.buttonChoice = "";
        $("#buttonView").html("");
        $("#buttonView").append("<button class='btn btn-md playerChoiceButtons' data-choice='hit' id='hit' type='button'>Hit</button>");
        $("#buttonView").append("<button class='btn btn-md playerChoiceButtons' data-choice='stand' id='stand' type='button'>Stand</button>");
        $("#buttonView").append("<button class='btn btn-md playerChoiceButtons' data-choice='doubleDown' id='doubleDown' type='button'>Double Down</button>");

        $(".playerChoiceButtons").one('click', function () {
            game.buttonChoice = $(this).attr('data-choice');
            game.buttonAction();
            audio.play();
        });


    },
    buttonAction: function () {
        // game.buttonChoice = $(this).attr('data-choice');
        switch (game.buttonChoice) {
            case 'hit':
                game.playerChoices();
                game.drawCard();
                game.updatePlayerScore();

                break;
            case 'stand':

                dealer.dealerTurn();

                break;
            case 'doubleDown':

                game.doubleDown();

                break;
        }
    },
    updatePlayerScore: function () {
        game.playerScore = 0;
        var hasAce = false;
        var aceIndex;
        var numWithoutAce = 0;
        for (i = 0; i < game.playerCards.length; i++) {
            var num = parseInt((game.playerCards[i])[1]) || 10;
            if (game.playerCards[i][1] === "ACE") {
                num = 0;
                hasAce = true;
                aceIndex = i;
            }
            game.playerScore += num;
        }
        if (hasAce === true) {
            for (i = 0; i < game.playerCards.length; i++) {
                if (aceIndex != i) {
                    var notAceCard = parseInt((game.playerCards[i])[1]) || 10;

                    if (game.playerCards[i][1] != "ACE") {
                        numWithoutAce += notAceCard;
                    } else {
                        //this happens because the card is a duplicate ace card, must be 1 or else it would exceed 21
                        notAceCard = 1;
                        numWithoutAce += notAceCard;
                    }
                }
            }
            if (numWithoutAce <= 10) {
                game.playerScore += 11;
            } else {
                game.playerScore += 1;
            }
            hasAce = false;
            numWithoutAce = 0;
        }

        if (game.playerScore > 21) {
            $("#gameText").html("<h4> The Dealer wins! The player busted! </h4>");
            deckObj.gameOverDisplay();
        }

        $("#playerScore").html("");
        $("#playerScore").append("Player score:" + game.playerScore);
        console.log("Player score is " + game.playerScore);

    },
    betFunction: function (x) {
        game.playerChips += game.playerBet;
        game.playerBet = x;
        database.ref("users/" + uid + "/chips").set(game.playerChips - x);
        database.ref("users/" + uid + "/bet").set(+x);
        updateVariables();
    },
    doubleDown: function () {
        currentBet = game.playerBet;
        var double = currentBet * 2;
        var chipsMinusDouble = game.playerChips - double;
        //var doubleRef = chipsMinusDouble / 2;
        database.ref("users/" + uid + "/chips").set(chipsMinusDouble);
        database.ref("users/" + uid + "/bet").set(double);
        updateVariables();
    },
    payOut: function (x) {

        switch (x) {
            case "Win":
                var winnings = game.playerBet * 1.5 + game.playerBet;

                database.ref("users/" + uid + "/chips").set(game.playerChips + winnings);
                database.ref("users/" + uid + "/bet").set(0);
                $("#gameText").html("<h4> Congratulations, you won this hand! You won a total of " + winnings + "(including your bet) chips. Hit replay to play again! </h4>");
                break;



            case "dealerBust":
                var winnings = game.playerBet * 1.5 + game.playerBet;

                database.ref("users/" + uid + "/chips").set(game.playerChips + winnings);
                $("#gameText").html("<h4> Congratulations, you won this hand because the Dealer busted! You won a total of " + winnings + "(including your bet) chips. Hit replay to play again! </h4>");
                database.ref("users/" + uid + "/bet").set(0);
                game.playerBet = 0;
                updateVariables();
                break;
            case "Lose":
                database.ref("users/" + uid + "/chips").set(game.playerChips - game.playerBet);
                $("#gameText").html("<h4> You lost the hand! You lost a total of " + game.playerBet + " chips. Hit replay to play again! </h4>");
                database.ref("users/" + uid + "/bet").set(0);
                game.playerBet = 0;
                updateVariables();
                break;

            case "Tie":
                $("#gameText").html("<h4> Tie game! You lost nothing. Hit replay to play again! </h4>");
                var refund = game.playerBet + game.playerChips;
                database.ref("users/" + uid + "/chips").set(refund);
                game.playerBet = 0;
                updateVariables();
                break;
        }
       // game.playerBet = 0;
        //updateVariables();
    },

}

var dealer = {
    arrayhand: {},
    buttonChoice: "",
    dealerCards: [],
    dealerScore: 0,
    dealerBustCheck: false,

    drawCard: function () {
        //get hand

        var card1ImgURL = deck[deck.length - 1].image;
        var card1Img = "<img class='cards' src='" + card1ImgURL + "'</img>"
        $("#dealerHand").append(card1Img)

        //Adding cards to array with suit and card value
        dealer.dealerCards.push([deck[deck.length - 1].suit, deck[deck.length - 1].value]);
        deck.pop();


        console.log("Below is dealer's hand!");
        console.log(dealer.dealerCards);

        dealer.updateDealerScore();

    },
    updateDealerScore: function () {
        //start from zero
        dealer.dealerScore = 0;

        //does Dealer have ace?
        var hasAce = false;

        //where is that ace?
        var aceIndex;

        //total points of hand without that ace
        var numWithoutAce = 0;

        for (i = 0; i < dealer.dealerCards.length; i++) {

            //get me the value of the card, if it returns Null than give value of 10 (is faceCard)
            var num2 = parseInt((dealer.dealerCards[i])[1]) || 10;

            //if facecard is ace
            if (dealer.dealerCards[i][1] === "ACE") {
                num2 = 0;
                hasAce = true;
                aceIndex = i;
            }
            dealer.dealerScore += num2;
        }
        //if player has ace in hand
        if (hasAce === true) {
            for (i = 0; i < dealer.dealerCards.length; i++) {
                if (aceIndex != i) {
                    var notAceCard = parseInt((dealer.dealerCards[i])[1]) || 10;
                    if (dealer.dealerCards[i][1] != "ACE") {
                        numWithoutAce += notAceCard;
                    } else {
                        //this happens because the card is a duplicate ace card, must be 1 or else it would exceed 21
                        notAceCard = 1;
                        numWithoutAce += notAceCard;
                    }

                }
            }
            if (numWithoutAce <= 10) {
                dealer.dealerScore += 11;
            } else {
                dealer.dealerScore += 1;
            }
        }

        if (dealer.dealerScore > 21) {
            dealer.dealerBustCheck = true;
        }
        $("#dealerScore").html("");
        $("#dealerScore").html("The dealer score: " + dealer.dealerScore);
        console.log("Dealer score is" + dealer.dealerScore);

    },

    dealerTurn: function () {
        $("#gameText").html("<h4> Dealer's turn!</h4>");
        while (dealer.dealerScore <= 17) {
            dealer.drawCard();
        }
        console.log("Dealer's score after stand is" + dealer.dealerScore);
        dealer.endGame();


    },
    endGame: function () {
        if (game.playerScore > dealer.dealerScore) {
            // $("#gameText").html("<h4> The player wins! Hit replay to play again! </h4>");
            game.payOut("Win");
            deckObj.gameOverDisplay();

        } else if (game.playerScore < dealer.dealerScore) {
            if (dealer.dealerBustCheck === true) {
                // $("#gameText").html("<h4> The Player wins! The dealer busted! </h4>");
                game.payOut("dealerBust");
                deckObj.gameOverDisplay();
                dealer.dealerBustCheck = false;
            } else {
                // $("#gameText").html("<h4> The dealer wins! Click on play Again to play again! </h4>");
                game.payOut("Lose");
                deckObj.gameOverDisplay();
            }
        } else {
            // $("#gameText").html("<h4> Tie Game! The pot is split! </h4>");
            game.payOut("Tie");
            deckObj.gameOverDisplay();
        }

    },

}
