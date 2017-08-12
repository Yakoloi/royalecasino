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

firebase.auth().onAuthStateChanged(function(user) {
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
    newUserRef.once("value").then(function(snapshot) {
        game.chips = snapshot.child("chips").val();
        game.bet = snapshot.child("bet").val();
        console.log("chips: " + game.chips);
        console.log("currentBet: " + game.bet);
        $("#playerChips").html("Player Chips: " + game.chips);
        $("#betMoney").html("Bet: " + game.bet);
    })
}

//Initialize start
function init() {
    database.ref("users/" + uid + "/bet").set(0);
    newUserRef.once("value").then(function(snapshot) {
        game.chips = snapshot.child("chips").val();
        game.bet = snapshot.child("bet").val();
        console.log("chips: " + game.chips);
        console.log("currentBet: " + game.bet);
        $("#playerChips").html("Player Chips: " + game.chips);
        $("#bet").html("Bet: " + game.bet)
        $("#userName").html(name);
        updateVariables()

    })
}


function signOut() {
    firebase.auth().signOut().then(function() {
        console.log('Signed Out');
    }, function(error) {
        console.error('Sign Out Error', error);
    });
}


$("#signOut").click(function() {
    console.log("signing out");
    signOut();
})

//syncs locally stored variables with database then updates the numbers fields
function updateVariables() {
    newUserRef.once("value").then(function(snapshot) {
        chips = snapshot.child("chips").val();
        paid = snapshot.child("paid").val();
        currentBet = snapshot.child("bet").val();
        console.log("chips: " + chips);
        console.log("currentBet: " + currentBet);
        $("#playerChips").html("Player Chips: " + chips);
        $("#bet").html("Bet: " + currentBet);
        $("#paid").html("Paid: " + paid);
    })
}

var deckObj = {

    deckID: "",
    queryURL: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
    deck: [],

    createDeck: function() {
        $.ajax({
                url: deckObj.queryURL,
                method: "GET"
            })
            .done(function(response) {
                deckID = response.deck_id;

                deckObj.getDeck();
            });
    },


    getDeck: function() {
        var queryURL6 = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=52";
        $.ajax({
                url: queryURL6,
                method: "GET"
            })
            .done(function(response) {

                deck = response.cards;

                game.playerChoices();
                // $("#dealCards").one('click', game.playerChoices);


            });

    },
    playAgain: function() {

        //Reset Everything
        database.ref("users/" + uid + "/bet").set(game.bet);
        database.ref("users/" + uid + "/chips").set(game.chips);
        updateVariables();
        $("#playerChips").html("Player Chips: " + game.chips);
        $("#bet").html("Player Bet: " + game.bet);
        $("#paid").html("bet: 0");
        $("#buttonView").html("");
        $("#handView").html("");
        $("#handView").append("<img id='card1' class='cards' alt='cardback' src='assets/images/cardback.jpg'> </img>");
        $("#handView").append("<img id='card2' class='cards' alt='cardback' src='assets/images/cardback.jpg'> </img>");
        $("#handView").append("<img id='card3' class='cards' alt='cardback' src='assets/images/cardback.jpg'> </img>");
        $("#handView").append("<img id='card4' class='cards' alt='cardback' src='assets/images/cardback.jpg'> </img>");
        $("#handView").append("<img id='card5' class='cards' alt='cardback' src='assets/images/cardback.jpg'> </img>");
        $("#gameText").html("");
        // game.playerScore = 0;
        game.playerCards = [];



        deckObj.createDeck();
    },
    gameOverDisplay: function() {
        //display reset button
        $("#buttonView").html("");
        $("#buttonView").append("<button id='playAgain' type='button' class='btn btn-outline-primary playAgainButton btn-transparent'>Play Again</button>");
        $("#playAgain").one('click', deckObj.playAgain);
    }


}

var game = {
    arrayhand: {},
    buttonChoice: "",
    holdIndex: "",
    playerCards: [],
    indexOfHoldCards: [],
    playerCards2: [
        [],
        [],
        [],
        [],
        []
    ],
    chips: 100,
    bet: 0,
    paid: 0,
    trackDoubleHoldCards: [],
    isClicked: false,
    currentHoldCard: 0,

    drawCards: function() {
        $("#handView").html("");
        //loop through entire player hand
        for (a = 0; a < game.playerCards.length; a++) {
            //check if index of current playerCard is the index of a hold card
            if ($.inArray(a.toString(), game.indexOfHoldCards) === -1) {
                game.playerCards[a] = [deck[deck.length - 1].suit, deck[deck.length - 1].value, deck[deck.length - 1].image];
                deck.pop();
            }
        }

        game.indexOfHoldCards = [];
        hand.checkHand();
        game.payOut();
        game.displayNewCards();


    },

    payOut: function() {
        var handLogicReturn = hand.checkHand();
        console.log("handResult.result at payOut function: " + handLogicReturn.result);
        //one pair
        if (handLogicReturn.result === "One Pair" && handLogicReturn.isJackOrBetter === true) {
            if (game.bet === 1) {
                game.paid = 1;
            }
            if (game.bet === 2) {
                game.paid = 2;
            }
            if (game.bet === 3) {
                game.paid = 3;
            }
            if (game.bet === 4) {
                game.paid = 4;
            }
            if (game.bet === 5) {
                game.paid = 5;
            }

        }

        //two pair
        if (handLogicReturn.result === "Two Pair") {
            if (game.bet === 1) {
                game.paid = 2;
            }
            if (game.bet === 2) {
                game.paid = 4;
            }
            if (game.bet === 3) {
                game.paid = 6;
            }
            if (game.bet === 4) {
                game.paid = 8;
            }
            if (game.bet === 5) {
                game.paid = 10;
            }
        }


        //three of a kind 
        if (handLogicReturn.result === "Three Of A Kind") {
            if (game.bet === 1) {
                game.paid = 3;
            }
            if (game.bet === 2) {
                game.paid = 6;
            }
            if (game.bet === 3) {
                game.paid = 9;
            }
            if (game.bet === 4) {
                game.paid = 12;
            }
            if (game.bet === 5) {
                game.paid = 15;
            }
        }


        //Straight
        if (handLogicReturn.result === "Straight") {
            if (game.bet === 1) {
                game.paid = 4;
            }
            if (game.bet === 2) {
                game.paid = 8;
            }
            if (game.bet === 3) {
                game.paid = 12;
            }
            if (game.bet === 4) {
                game.paid = 16;
            }
            if (game.bet === 5) {
                game.paid = 20;
            }
        }

        //flush 
        if (handLogicReturn.result === "Flush") {
            if (game.bet === 1) {
                game.paid = 6;
            }
            if (game.bet === 2) {
                game.paid = 12;
            }
            if (game.bet === 3) {
                game.paid = 18;
            }
            if (game.bet === 4) {
                game.paid = 24;
            }
            if (game.bet === 5) {
                game.paid = 30;
            }
        }
        //full house
        if (handLogicReturn.result === "Full House") {
            if (game.bet === 1) {
                game.paid = 9;
            }
            if (game.bet === 2) {
                game.paid = 18;
            }
            if (game.bet === 3) {
                game.paid = 27;
            }
            if (game.bet === 4) {
                game.paid = 36;
            }
            if (game.bet === 5) {
                game.paid = 45;
            }
        }
        //4 of a kind 
        if (handLogicReturn.result === "Four Of A Kind") {
            if (game.bet === 1) {
                game.paid = 25;
            }
            if (game.bet === 2) {
                game.paid = 50;
            }
            if (game.bet === 3) {
                game.paid = 75;
            }
            if (game.bet === 4) {
                game.paid = 100;
            }
            if (game.bet === 5) {
                game.paid = 125;
            }
        }
        //straight flush
        if (handLogicReturn.result === "Straight Flush") {
            if (game.bet === 1) {
                game.paid = 50;
            }
            if (game.bet === 2) {
                game.paid = 100;
            }
            if (game.bet === 3) {
                game.paid = 150;
            }
            if (game.bet === 4) {
                game.paid = 200;
            }
            if (game.bet === 5) {
                game.paid = 250;
            }
        }
        //Royal Flush
        if (handLogicReturn.result === "Royal Flush") {
            if (game.bet === 1) {
                game.paid = 250;
            }
            if (game.bet === 2) {
                game.paid = 500;
            }
            if (game.bet === 3) {
                game.paid = 750;
            }
            if (game.bet === 4) {
                game.paid = 1000;
            }
            if (game.bet === 5) {
                game.paid = 4000;
            }


        }
        if (handLogicReturn.result === "One Pair" && handLogicReturn.isJackOrBetter === true) {
            $("#gameText").html("The Player's Hand: " + handLogicReturn.result);
            $("#gameText").append("<p> You won " + game.paid + ". Click Play Again to play again!</p>");
            game.chips += game.paid;
            $("#paid").html("Paid: " + game.paid);

        } else if (handLogicReturn.result != "" && handLogicReturn.result !== "One Pair") {
            $("#gameText").html("The Player's Hand: " + handLogicReturn.result);
            $("#gameText").append("<p> You won " + game.paid + ". Click Play Again to play again!</p>");
            game.chips += game.paid;
            $("#paid").html("Paid: " + game.paid);
        } else {
            $("#gameText").html("You lose!");
            $("#gameText").append("<p>Click Play Again to play again!</p>");
            game.chips -= game.bet;
        }


        // game.updatePlayerScore();
        deckObj.gameOverDisplay();

    },
    displayNewCards: function() {

        for (i = 0; i < game.playerCards.length; i++) {
            var cardImgURL = game.playerCards[i][2];
            var cardImg = "<img id='card" + i + "Img' src='" + cardImgURL + "'></img>"
            $("#handView").append(cardImg);
        }

    },

    dealCards: function() {
        //get hand from deck obj
        $("#handView").html("");
        var card1ImgURL = deck[deck.length - 1].image;
        var card1Img = "<img id='card1Img' src='" + card1ImgURL + "'></img>"
        $("#handView").append("<div id='card1' class='hold'><div class='row'> " + card1Img + " </div>" + "<div class='row'>" + "<button id='card1' type='button' class='holdButton btn-transparent'>Hold</button></div></div>")
        var card2ImgURL = deck[deck.length - 2].image;
        var card2Img = "<img id='card2Img'  src='" + card2ImgURL + "'></img>"
        $("#handView").append("<div id='card2' class='hold'><div class='row'> " + card2Img + " </div>" + "<div class='row'>" + "<button id='card2' type='button' class='holdButton btn-transparent'>Hold</button></div></div>")
        var card3ImgURL = deck[deck.length - 3].image;
        var card3Img = "<img  id='card3Img'  src='" + card3ImgURL + "'></img>"
        $("#handView").append("<div id='card3' class='hold'><div class='row'> " + card3Img + " </div>" + "<div class='row'>" + "<button id='card3' type='button' class='holdButton btn-transparent'>Hold</button></div></div>")
        var card4ImgURL = deck[deck.length - 4].image;
        var card4Img = "<img  id='card4Img'  src='" + card4ImgURL + "'></img>"
        $("#handView").append("<div id='card4' class='hold'><div class='row'> " + card4Img + " </div>" + "<div class='row'>" + "<button id='card4' type='button' class='holdButton btn-transparent'>Hold</button></div></div>")
        var card5ImgURL = deck[deck.length - 5].image;
        var card5Img = "<img  id='card5Img'  src='" + card5ImgURL + "'></img>"
        $("#handView").append("<div id='card5' class='hold'><div class='row'> " + card5Img + " </div>" + "<div class='row'>" + "<button id='card5' type='button' class='holdButton btn-transparent'>Hold</button></div></div>")


        //Adding cards to new array with suit and card value
        game.playerCards.push([deck[deck.length - 1].suit, deck[deck.length - 1].value, deck[deck.length - 1].image]);
        $("#card1").attr("data-index", 0);
        $("#card1").attr("data-isClicked", false);
        game.playerCards.push([deck[deck.length - 2].suit, deck[deck.length - 2].value, deck[deck.length - 2].image]);
        $("#card2").attr("data-index", 1);
        $("#card2").attr("data-isClicked", false);
        game.playerCards.push([deck[deck.length - 3].suit, deck[deck.length - 3].value, deck[deck.length - 3].image]);
        $("#card3").attr("data-index", 2);
        $("#card3").attr("data-isClicked", false);
        game.playerCards.push([deck[deck.length - 4].suit, deck[deck.length - 4].value, deck[deck.length - 4].image]);
        $("#card4").attr("data-index", 3);
        $("#card4").attr("data-isClicked", false);
        game.playerCards.push([deck[deck.length - 5].suit, deck[deck.length - 5].value, deck[deck.length - 5].image]);
        $("#card5").attr("data-index", 4);
        $("#card5").attr("data-isClicked", false);

        console.log(game.playerCards);

        //take off 5 cards from the top of the deck becuase we just pulled them
        deck.pop();
        deck.pop();
        deck.pop();
        deck.pop();
        deck.pop();


        //when the player clicks the deal/draw button, call function that will draw new cards for every nonHold Card
        $("#deal").one("click", function() {
            game.drawCards();
        });

    },
    playerChoiceButtonAudio: function() {
        // player choices audio  
        var betOneAudio = document.createElement('audio');
        betOneAudio.setAttribute("src", "assets/audio/chipsStack.mp3");
        betOneAudio.load()
        betOneAudio.play();

    },
    holdAudio: function() {
        $(this).toggleClass('clicked');
        // hold card audio
        var holdAudio = document.createElement('audio');
        holdAudio.setAttribute("src", "assets/audio/cardSlide.mp3");
        $(".holdButton.btn-transparent").on('click', function() {
            holdAudio.play();
        });
    },
    playerChoices: function() {
        game.buttonChoice = "";
        $("#buttonView").html("");
        $("#buttonView").append("<button id='betOne' type='button' data-choice='betOne' class='playerChoiceButtons btn-transparent'>Bet One</button>");
        $("#buttonView").append("<button id='betMax' type='button' data-choice='betMax' class='playerChoiceButtons btn-transparent'>Bet Max</button>");
        $("#buttonView").append("<button id='deal'   type='button' data-choice='deal'   class='playerChoiceButtons btn-transparent'>Deal/Draw</button>");
        $(".playerChoiceButtons").one('click', function() {
            game.buttonChoice = $(this).attr('data-choice');
            game.buttonAction();
        });

    },
    buttonAction: function() {
        if (game.chips <= 0) {
            $("#gameText").html("You're out of chips! Create a new account to start from scratch.");
        } else {
            switch (game.buttonChoice) {

                case 'betOne':
                    if (game.bet <= 4) {
                        $("#gameText").html("You incremented your bet by one, you can bet up to five!");
                        game.chips -= 1;
                        database.ref("users/" + uid + "/chips").set(game.chips);
                        game.bet += 1;
                        database.ref("users/" + uid + "/bet").set(game.bet);
                        updateVariables();
                        game.playerChoices();

                    } else {
                        $("#gameText").html("You can click on bet one to increment up until 5, then it will start at one again");
                        game.chips += 4;
                        game.bet = 1;

                        //update firebase database and redisplay point
                        database.ref("users/" + uid + "/bet").set(game.bet);
                        database.ref("users/" + uid + "/chips").set(game.chips);
                        updateVariables();
                        //recall the button that will give onclick events for this 
                        game.playerChoices();

                    }
                    break;

                case 'betMax':
                    if (game.bet <= 4) {
                        game.chips += game.bet;
                        $("#gameText").html("That is your max bet! Click on Bet One to start from One again");
                        //update firebase database and redisplay point
                        database.ref("users/" + uid + "/chips").set(game.chips);
                        game.bet = 5;
                        database.ref("users/" + uid + "/bet").set(game.bet);
                        game.chips -= 5;
                        database.ref("users/" + uid + "/chips").set(game.chips);
                        updateVariables();

                        //recall the button that will give onclick events for this 
                        game.playerChoices();

                    } else {
                        $("#gameText").html("That is your max bet! Click on Bet One to start from One again");
                        game.playerChoices();

                    }
                    break;

                case 'deal':
                    game.dealCards();
                    $("#betOne").off("click");
                    $("#betMax").off("click");
                    break;

            }

        }
    },
    updatePlayerScore: function() {
        $("#playerChips").html("Player Chips: " + game.chips);
        $("#bet").html("Bet: " + game.bet);
        $("#paid").html("Paid: " + game.paid);
        newUserRef.once("value").then(function(snapshot) {
            updateVariables();
        })


    },

}

var hand = {
    suitCount: 1,
    hasPair: false,
    hasThreeOfAKind: false,
    hasStraight: false,
    hasFlush: false,
    hasHighestStraight: false,

    //Player's card values
    handValues: [],

    //Player's cart suits
    handSuits: [],

    //object that the main method checkHand will return
    handResult: {
        result: "",
        onePairValue: "",
        isJackOrBetter: false

    },

    //this function will convert all cards into an integer and sort them in ascending order
    organizeHand: function() {
        var sortedArray = [];
        var faceCardOrTen = [];
        for (i = 0; i < hand.handValues.length; i++) {
            var num = parseInt(hand.handValues[i]) || -1;
            if (num === 10) {
                faceCardOrTen.push(num);
            }
            if (num !== -1 && num !== 10) {
                sortedArray.push(num);
            }
            if (hand.handValues[i] === "JACK") {
                faceCardOrTen.push(11)
            }
            if (hand.handValues[i] === "QUEEN") {
                faceCardOrTen.push(12)

            }
            if (hand.handValues[i] === "KING") {
                faceCardOrTen.push(13)

            }
            if (hand.handValues[i] === "ACE") {
                faceCardOrTen.push(14)
            }
        }

        sortedArray.sort();
        faceCardOrTen.sort();

        //AFTER SORTING 10 + cards, push them to sortedArray, so it is in numerical order
        for (i = 0; i < faceCardOrTen.length; i++) {
            sortedArray.push(faceCardOrTen[i]);
        }
        return sortedArray;
    },
    checkHand: function() {
        // hand.organizeHand();
        //Reset all object variables
        hand.suitCount = 1;
        hand.hasPair = false;
        hand.hasThreeOfAKind = false;
        hand.hasStraight = false;
        hand.hasFlush = false;
        hand.hasHighestStraight = false;
        hand.handValues = [];
        hand.handSuits = [];
        hand.handResult = {
            result: "",
            onePairValue: "",
            isJackOrBetter: false

        }

        //card values
        for (i = 0; i < game.playerCards.length; i++) {
            hand.handValues.push(game.playerCards[i][1]);
        }

        //card suits
        for (i = 0; i < game.playerCards.length; i++) {
            hand.handSuits.push(game.playerCards[i][0]);
        }

        //SORT
        hand.handValues.sort();
        hand.handSuits.sort();


        console.log("Hand values: " + hand.handValues);
        console.log("handSuit: " + hand.handSuits);

        // ************************************************************************************************************
        //You can change array values here to change possible hand outcomes (i.e test the result of a Royal Flush);

        // hand.handValues = ["JACK", "KING", "QUEEN", "10", "ACE"];

        // hand.handSuits = ["HEARTS","HEARTS","HEARTS","HEARTS","HEARTS"];

        //**************************************************************************************************************

        //CHECK ALL POSSIBLE HANDS and update hand.handResult.result
        hand.checkPairOrTwoPair();
        hand.checkThreeOrFourOfAKind();
        hand.checkFullHouse();
        hand.checkStraight();
        hand.checkFlush();
        hand.checkStraightFlush();
        hand.checkRoyalFlush();

        return hand.handResult;
    },
    checkPairOrTwoPair: function() {
        var sortedArray = hand.organizeHand();
        var pairCount = 0;
        for (i = 0; i < sortedArray.length; i++) {
            if (sortedArray[i] === sortedArray[i + 1]) {
                pairCount += 1;
                if (sortedArray[i] >= 11) {
                    hand.handResult.result = "One Pair";
                    hand.handResult.isJackOrBetter = true;
                    hand.hasPair = true;

                }
            }

        }
        if (pairCount === 2) {
            hand.handResult.result = "Two Pair";
        }
        return hand.handResult.result;

    },
    checkThreeOrFourOfAKind: function() {
        var sortedArray = hand.organizeHand();
        var duplicateCount = 1;

        //In the event of a full house, we use this variable to make sure that it doesn't count the 3 of a kind + the extra pair 
        //as a four of a kind.
        var cardChanged = false;

        for (i = 0; i < sortedArray.length; i++) {
            if (sortedArray[i] === sortedArray[i + 1]) {
                if (cardChanged === false || duplicateCount === 1) {
                    duplicateCount += 1;
                }
                cardChanged = false;
            } else {
                cardChanged = true;
            }
        }
        if (duplicateCount === 3) {
            hand.handResult.result = "Three Of A Kind";
            hand.hasThreeOfAKind = true;
        }
        if (duplicateCount === 4) {
            hand.handResult.result = "Four Of A Kind";
        }

        return hand.handResult.result;


    },
    checkFullHouse: function() {
        // hand.handValues = ["ACE", "KING", "KING", "ACE", "KING"];
        var sortedArray = hand.organizeHand();
        if (hand.hasPair === true && hand.hasThreeOfAKind === true) {
            hand.handResult.result === "Full House";
        }
    },
    checkStraight: function() {
        var straightArray = hand.organizeHand();
        var straightCount = 1;
        for (i = 0; i < straightArray.length; i++) {
            if (straightArray[i] + 1 === straightArray[i + 1]) {
                straightCount += 1;
            }
            if (straightArray[0] === 2 && straightArray[1] === 3 && straightArray[2] === 4 && straightArray[3] === 5) {
                if (straightArray[i] === 14) {
                    straightCount += 1;
                }
            }
        }



        if (straightCount === 5) {
            hand.handResult.result = "Straight";
            hand.hasStraight = true;
            if (straightArray[3] === 13) {
                hand.hasHighestStraight = true;
            }
        }

    },
    checkFlush: function() {
        //check for flush 
        for (i = 0; i < hand.handSuits.length; i++) {
            if (hand.handSuits[i] === hand.handSuits[i + 1]) {
                hand.suitCount += 1;
            }
        }
        if (hand.suitCount === 5) {
            hand.handResult.result = "Flush";
            hand.hasFlush = true;
        }
    },
    checkStraightFlush: function() {
        //check for Straight Flush
        if (hand.hasFlush === true && hand.hasStraight === true) {
            hand.handResult.result = "Straight Flush";
        }

    },
    checkRoyalFlush: function() {
        //Check for Royal Flush
        if (hand.hasFlush === true && hand.hasHighestStraight === true) {
            hand.handResult.result = "Royal Flush";
        }
    }


}
$(document).on("click", "#betOne", game.playerChoiceButtonAudio);
$(document).on("click", "#betMax", game.playerChoiceButtonAudio);
$(document).on("click", "#deal", game.playerChoiceButtonAudio);
$(document).on("click", "#playAgain", game.playerChoiceButtonAudio);
$(document).on("click", ".hold", game.holdAudio);

$(document).on("click", ".hold", function() {
    game.holdIndex = $(this).attr('data-index');
    game.isClicked = $(this).attr('data-isClicked');

    game.currentholdCard = $(this);
    game.indexOfHoldCards.sort();
    var alreadyClicked2 = $.inArray(game.holdIndex, game.indexOfHoldCards);
    if (alreadyClicked2 === -1) {
        game.indexOfHoldCards.push(game.holdIndex);
        $(this).attr("data-isClicked", true);
    } else {
        var alreadyClicked = $.inArray(game.holdIndex, game.indexOfHoldCards);
        while (alreadyClicked !== -1) {
            game.indexOfHoldCards.splice(alreadyClicked, 1);
            alreadyClicked = $.inArray(game.holdIndex, game.indexOfHoldCards);
        }

        $(this).attr("data-isClicked", false);
    }

});
$(document).on("click", ".menuButtons", function() {
    window.location.replace("./main-menu.html");
});
deckObj.createDeck();