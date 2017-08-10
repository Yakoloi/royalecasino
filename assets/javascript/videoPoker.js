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
var name, email, currentBet, uid, chips, paid;
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
        deckObj.createDeck();
        console.log("variable reset")
    } else {
        alert("No user is signed in.");
    }
});

function updateVariables() {
    newUserRef.once("value").then(function (snapshot) {
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

                game.playerChoices();
                // $("#dealCards").one('click', game.playerChoices);


            });

    },
    playAgain: function () {

        //Reset Everything
        $("#playerScore").html("Player Score: 0");
        $("#dealerScore").html("Dealer Score: 0");
        $("#buttonView").html("");
        $("#handView").html("");
        $("#handView").append("<img id='card1' class='cards' alt='cardback' src='assets/images/cardback.jpg'> </img>");
        $("#handView").append("<img id='card2' class='cards' alt='cardback' src='assets/images/cardback.jpg'> </img>");
        $("#handView").append("<img id='card3' class='cards' alt='cardback' src='assets/images/cardback.jpg'> </img>");
        $("#handView").append("<img id='card4' class='cards' alt='cardback' src='assets/images/cardback.jpg'> </img>");
        $("#handView").append("<img id='card5' class='cards' alt='cardback' src='assets/images/cardback.jpg'> </img>");
        $("#dealerHand").html("");
        $("#gameText").html("");
        game.playerScore = 0;
        game.playerCards = [];



        deckObj.createDeck();
    },
    gameOverDisplay: function () {
        //display reset button
        $("#buttonView").html("");
        $("#buttonView").append("<button id='playAgain' type='button' class='btn btn-outline-primary'>Play Again</button>");
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
    drawCards: function () {
        $("#handView").html("");
        var nonHoldCardCount = 0;
        for (i = 0; i < game.indexOfHoldCards.length; i++) {

            //integer of held card in Player Cards array
            var num = parseInt(game.indexOfHoldCards[i]);
            //held card to append to array
            var heldCard = game.playerCards[num];
            game.playerCards2.splice(num, 0, game.playerCards[num]);
            game.playerCards2.splice(num + 1, 1);
        }

        //looping through players full hand before holding cards
        for (a = 0; a < game.playerCards.length; a++) {

            var aIsHoldCard = false;

            //if i is NOT in game.indexOfHoldCards
            for (b = 0; b < game.indexOfHoldCards.length; b++) {
                var bIndex = parseInt(game.indexOfHoldCards[b]);
                if (a === bIndex) {
                    aIsHoldCard = true;
                }
            }

            //after checking index array, IF a is NOT the index of a hold card!
            if (aIsHoldCard === false) {
                game.playerCards2[a].push(deck[deck.length - 1].suit, deck[deck.length - 1].value, deck[deck.length - 1].image);
                deck.pop();
            }



        }
        // game.playerCards2 = game.playerCards2.filter(e => e.length);
        console.log(game.playerCards2);
        game.handLogic();
        game.payOut();
        game.displayNewCards();


    },

    payOut: function () {
        var handLogicReturn = game.handLogic();

        //one pair
        if (handLogicReturn.result === "One Pair" && handLogicReturn.isJackOrBetter === true) {
            if (currentBet === 1) {
                paid = 1;
            }
            if (currentBet === 2) {
                paid = 2;paidpaidpaidpaidpaidpaid
            }
            if (currentBet === 3) {
                paid = 3;
            }
            if (currentBet === 4) {
                paid = 4;
            }
            if (currentBet === 5) {
                paid = 5;
            }

        }

        //two pair
        if (handLogicReturn.result === "Two Pair") {
            if (currentBet === 1) {
                paid = 2;
            }
            if (currentBet === 2) {
                paid = 4;
            }
            if (currentBet === 3) {
                paid = 6;
            }
            if (currentBet === 4) {
                paid = 8;
            }
            if (currentBet === 5) {
                paid = 10;
            }
        }


        //three of a kind 
        if (handLogicReturn.result === "Three Of A Kind") {
            if (currentBet === 1) {
                paidpaidpaidpaidpaid = 3;
            }
            if (currentBet === 2) {
                paidpaidpaidpaidpaid = 6;
            }
            if (currentBet === 3) {
                paidpaidpaidpaidpaid = 9;
            }
            if (currentBet === 4) {
                paidpaidpaidpaidpaid = 12;
            }
            if (currentBet === 5) {
                paidpaidpaidpaidpaid = 15;
            }
        }


        //Straight
        if (handLogicReturn.result === "Straight") {
            if (currentBet === 1) {
                paid = 4;
            }
            if (currentBet === 2) {
                paid = 8;
            }
            if (currentBet === 3) {
                paid = 12;
            }
            if (currentBet === 4) {
                paid = 16;
            }
            if (currentBet === 5) {
                paid = 20;
            }
        }

        //flush 
        if (handLogicReturn.result === "Flush") {
            if (currentBet === 1) {
                paid = 6;
            }
            if (currentBet === 2) {
                paid = 12;
            }
            if (currentBet === 3) {
                paid = 18;
            }
            if (currentBet === 4) {
                paid = 24;
            }
            if (currentBet === 5) {
                paid = 30;
            }
        }
        //full house
        if (handLogicReturn.result === "Full House") {
            if (currentBet === 1) {
                paid = 9;
            }
            if (currentBet === 2) {
                paid = 18;
            }
            if (currentBet === 3) {
                paid = 27;
            }
            if (currentBet === 4) {
                paid = 36;
            }
            if (currentBet === 5) {
                paid = 45;
            }
        }
        //4 of a kind 
        if (handLogicReturn.result === "Four Of A Kind") {
            if (currentBet === 1) {
                paid = 25;
            }
            if (currentBet === 2) {
                paid = 50;
            }
            if (currentBet === 3) {
                paid = 75;
            }
            if (currentBet === 4) {
                paid = 100;
            }
            if (currentBet === 5) {
                paid = 125;
            }
        }
        //straight flush
        if (handLogicReturn.result === "Straight Flush") {
            if (currentBet === 1) {
                paid = 50;
            }
            if (currentBet === 2) {
                paid = 100;
            }
            if (currentBet === 3) {
                paid = 150;
            }
            if (currentBet === 4) {
                paid = 200;
            }
            if (currentBet === 5) {
                paid = 250;
            }
        }
        //Royal Flush
        if (handLogicReturn.result === "Royal Flush") {
            if (currentBet === 1) {
                paid = 250;
            }
            if (currentBet === 2) {
                paid = 500;
            }
            if (currentBet === 3) {
                paid = 750;
            }
            if (currentBet === 4) {
                paid = 1000;
            }
            if (currentBet === 5) {
                paid = 4000;
            }


        }
        if (handLogicReturn.result === "One Pair" && handLogicReturn.isJackOrBetter === true) {
            var winPay = chips + paid;
            $("#gameText").html("The Player's Hand: " + handLogicReturn.result);
            $("#gameText").append("<p> You won " + paid + ". Click Play Again to play again!</p>");
            database.ref("users/" + uid + "/chips").set(winPay);
        } else if (handLogicReturn.result != "" && handLogicReturn.result !== "One Pair") {
            var pairPay = chips + paid;
            $("#gameText").html("The Player's Hand: " + handLogicReturn.result);
            $("#gameText").append("<p> You won " + paid + ". Click Play Again to play again!</p>");
            database.ref("users/" + uid + "/chips").set(pairPay);
        } else {
            var chipsMinusBet = chips - currentBet;
            $("#gameText").html("You lose!");
            $("#gameText").append("<p>Click Play Again to play again!</p>");
            database.ref("users/" + uid + "/chips").set(chipsMinusBet);
        }


        game.updatePlayerScore();
        deckObj.gameOverDisplay();

    },
    handLogic: function () {
        var pairCount = 0;
        var suitCount = 1;
        var straightCount = 1;
        var duplicateCount = 1;
        var hasStraight = false;
        var hasFlush = false;
        var hasHighestStraight = false;
        var pairValues = [];
        var handValues = [];
        var handSuits = [];
        var handResult = {
            result: "",
            onePairValue: "",
            isJackOrBetter: false

        }

        //card values
        for (i = 0; i < game.playerCards2.length; i++) {
            handValues.push(game.playerCards2[i][1]);
        }

        //card suits
        for (i = 0; i < game.playerCards2.length; i++) {
            handSuits.push(game.playerCards2[i][0]);
        }

        handValues.sort();
        handSuits.sort();


        console.log("Hand values: " + handValues);
        console.log("handSuit: " + handSuits);


        //count pairs
        var currentValue;
        var duplicateValues = [];
        var duplicateCard;
        var hasFirstPair = false;


        //FOR TESTING 
        // handValues = ["5", "5", "JACK", "JACK", "QUEEN"];
        // handValues=["2","7","ACE","KING",'KING']
        // handValues = ["10", "7", "ACE", "JACK", "JACK"]
        // handSuits = ["HEARTS", "HEARTS", "HEARTS", "HEARTS", "HEARTS"];
        // handValues = ["2", "2", "9", "QUEEN", "QUEEN"];

        //CHECK FOR pair, two pair, three of a kind, or four of a kind
        for (i = 0; i < handValues.length; i++) {
            if (handValues[i + 1] === handValues[i]) {
                duplicateCount += 1;

                //IF THE CURRENT CARD IN THIS FOR LOOP IS NOT A DUPLICATE OF THE PREVIOUS CARD
                if (duplicateCard !== handValues[i] && duplicateCard !== undefined) {

                    //duplicateCount can increment to 4 in the event of full house. if at full house, we want this variable to be 3
                    duplicateCount -= 1;
                }

                //IF THERE IS NOT THREE OF A KIND 
                if (duplicateCount !== 3) {
                    hasFirstPair = true;
                    // duplicateValues.push(handValues[i]);
                }
            } else if (duplicateCount >= 2) {
                //SAVING THIS VALUE IN CASE THERE IS FULL HOUSE
                //LAST DUPLICATE CARD BEFORE NEW ONE
                duplicateCard = handValues[i - 1];
            }

            if (hasFirstPair === true) {
                pairCount += 1;
                hasFirstPair = false;
                handResult.onePairValue = handValues[i];
            }

        }



        //after for loop


        //one pair
        if (pairCount === 1) {
            handResult.result = "One Pair";
            if (handResult.onePairValue === "JACK" || handResult.onePairValue === "QUEEN" || handResult.onePairValue === "KING" || handResult.onePairValue === "ACE") {
                handResult.isJackOrBetter = true;
            }

        }
        //two pair
        if (pairCount === 2) {
            handResult.result = "Two Pair";
        }
        //three of a kind 
        if (duplicateCount === 3) {
            handResult.result = "Three Of A Kind";
        }
        //four of a kind
        if (duplicateCount === 4) {
            handResult.result = "Four Of A Kind";
        }





        //INCASE THE 3 of kind was after the pair, the duplicateCount would be 2 but it would still be a full house
        // duplicateCount += 1;
        //CHECK IF PLAYER HAS FULL HOUSE
        if (duplicateCount === 3 || duplicateCount === 2) {
            //CHECK LAST 2 CARDS
            if (duplicateCount === 3) {
                var firstNonPairIndex = handValues.indexOf(duplicateCard)

                var lastTwoCards = [];

                for (i = 0; i < handValues.length; i++) {
                    if (handValues[i] !== handValues[firstNonPairIndex - 1]) {
                        lastTwoCards.push(handValues[i]);


                    }
                }
                if (lastTwoCards[0] === lastTwoCards[1]) {
                    handResult.result = "Full House";
                }
            }

            //CHECK LAST TWO CARDS
            if (duplicateCount === 2) {
                var firstNonPairIndex = handValues.indexOf(duplicateCard)

                var lastThreeCards = [];

                for (i = 0; i < handValues.length; i++) {
                    if (handValues[i] !== handValues[firstNonPairIndex - 1]) {
                        lastThreeCards.push(handValues[i]);


                    }
                }
                if (lastThreeCards[0] === lastThreeCards[1] && lastThreeCards[1] === lastThreeCards[2]) {
                    handResult.result = "Full House";
                }
            }


        }




        //check for Straight
        //for TESTING
        // handValues = ["8", "9", "10", "JACK", "QUEEN"];
        // handValues.sort();
        var hasTen = handValues.indexOf("10");
        for (i = 0; i < handValues.length; i++) {
            var num = parseInt(handValues[i]) || 11;
            if (num === (parseInt(handValues[i + 1]) + 1) || num === (parseInt(handValues[i + 1]) - 1)) {
                straightCount += 1;
                hasTen = -1;
            }
            // if (num === (parseInt(handValues[i + 1]) + 1) || num === (parseInt(handValues[i + 1]) - 1) || hasTen !== -1) {
            //     straightCount += 1;
            //     hasTen = -1;
            // }


            if (num === 11) {

                if (straightCount === 1 || straightCount === 2 || straightCount === 3 || straightCount === 4) {
                    if (handValues.indexOf("2") === -1 && handValues.indexOf("3") === -1 && handValues.indexOf("4") === -1 && handValues.indexOf("5") === -1) {
                        var handIndex = handValues.indexOf("JACK");
                        if (handIndex !== (-1)) {
                            straightCount += 1;
                        }
                    }
                }

                // && handValues.indexOf("3") === -1 && handValues.indexOf("4") === -1 && handValues.indexOf("5") === -1
                if (straightCount === 2 || straightCount === 3 || straightCount === 4) {
                    if (handValues.indexOf("2") === -1 && handValues.indexOf("3") === -1 && handValues.indexOf("4") === -1 && handValues.indexOf("5") === -1) {


                        var handIndex = handValues.indexOf("QUEEN")
                        if (handIndex !== (-1)) {
                            straightCount += 1;
                        }

                    }

                }
                if (straightCount === 3 || straightCount === 4) {

                    if (handValues.indexOf("2") === -1 && handValues.indexOf("3") === -1 && handValues.indexOf("4") === -1 && handValues.indexOf("5") === -1) {
                        var handIndex = handValues.indexOf("KING");
                        if (handIndex !== (-1)) {
                            straightCount += 1;
                        }

                        if (handValues.indexOf("10") !== -1 && handValues.indexOf("JACK") !== -1 && handValues.indexOf("QUEEN") !== -1 && handValues.indexOf("KING") !== -1) {
                            hasHighestStraight = true;
                        }
                    }
                }
                if (straightCount === 4) {
                    var handIndex = handValues.indexOf("ACE");
                    if (handIndex !== (-1)) {
                        straightCount += 1;



                    }

                }
            }
        }
        if (straightCount === 5) {
            handResult.result = "Straight";
            hasStraight = true;
        }
        console.log("Straight Count is" + straightCount);
        //END STRAIGHT CHECK 



        //check for flush 
        for (i = 0; i < handSuits.length; i++) {
            if (handSuits[i] === handSuits[i + 1]) {
                suitCount += 1;
            }
        }
        if (suitCount === 5) {
            handResult.result = "Flush";
            hasFlush = true;
        }




        //check for Straight Flush
        if (hasFlush === true && hasStraight === true) {
            handResult.result = "Straight Flush";
        }

        //Check for Royal Flush
        if (hasFlush === true && hasHighestStraight === true) {
            handResult.result = "Royal Flush";
        }

        console.log(duplicateValues);
        console.log(handResult.result);
        console.log(duplicateCount);
        console.log("Suit Count is" + suitCount);



        return handResult;
    },

    displayNewCards: function () {

        for (i = 0; i < game.playerCards2.length; i++) {
            var cardImgURL = game.playerCards2[i][2];
            var cardImg = "<img id='card" + i + "Img' src='" + cardImgURL + "'></img>"
            $("#handView").append(cardImg);
        }

    },

    dealCards: function () {
        //get hand
        $("#handView").html("");
        var card1ImgURL = deck[deck.length - 1].image;
        var card1Img = "<img id='card1Img' src='" + card1ImgURL + "'></img>"
        $("#handView").append("<div class='hold'> " + card1Img + "<button id='card1' data-index='0' type='button' class='holdButton'>Hold</button></div>");
        var card2ImgURL = deck[deck.length - 2].image;
        var card2Img = "<img id='card2Img'  src='" + card2ImgURL + "'></img>"
        $("#handView").append("<div class='hold'> " + card2Img + "<button id='card2' data-index='1' type='button' class='holdButton'>Hold</button></div>");
        var card3ImgURL = deck[deck.length - 3].image;
        var card3Img = "<img  id='card3Img'  src='" + card3ImgURL + "'></img>"
        $("#handView").append("<div class='hold'> " + card3Img + "<button id='card3' data-index='2' type='button' class='holdButton'>Hold</button></div>");
        var card4ImgURL = deck[deck.length - 4].image;
        var card4Img = "<img  id='card4Img'  src='" + card4ImgURL + "'></img>"
        $("#handView").append("<div class='hold'> " + card4Img + "<button id='card4' data-index='3' type='button' class='holdButton'>Hold</button></div>");
        var card5ImgURL = deck[deck.length - 5].image;
        var card5Img = "<img  id='card5Img'  src='" + card5ImgURL + "'></img>"
        $("#handView").append("<div class='hold'> " + card5Img + "<button id='card5' data-index='4' type='button' class='holdButton'>Hold</button></div>");


        //Adding cards to array with suit and card value
        game.playerCards.push([deck[deck.length - 1].suit, deck[deck.length - 1].value, deck[deck.length - 1].image]);
        $("#card1").attr("data-index", 0);
        game.playerCards.push([deck[deck.length - 2].suit, deck[deck.length - 2].value, deck[deck.length - 2].image]);
        $("#card2").attr("data-index", 1);
        game.playerCards.push([deck[deck.length - 3].suit, deck[deck.length - 3].value, deck[deck.length - 3].image]);
        $("#card3").attr("data-index", 2);
        game.playerCards.push([deck[deck.length - 4].suit, deck[deck.length - 4].value, deck[deck.length - 4].image]);
        $("#card4").attr("data-index", 3);
        game.playerCards.push([deck[deck.length - 5].suit, deck[deck.length - 5].value, deck[deck.length - 5].image]);
        $("#card5").attr("data-index", 4);

        console.log(game.playerCards);
        deck.pop();
        deck.pop();
        deck.pop();
        deck.pop();
        deck.pop();

        // dealer.drawCard();
        // game.updatePlayerScore();
        // game.playerChoices();

        $(".holdButton").on("click", function () {
            game.holdIndex = $(this).attr('data-index');
            game.holdCards();
        });
        $("#deal").one("click", function () {
            game.drawCards();
        });

    },
    holdCards: function () {
        var trackDoubles = [];
        game.indexOfHoldCards.push(game.holdIndex);

    },
    playerChoices: function () {
        game.buttonChoice = "";

        $("#buttonView").html("");
        $("#buttonView").append("<button id='betOne' type='button' data-choice='betOne' class='playerChoiceButtons'>Bet One</button>");
        $("#buttonView").append("<button id='betMax' type='button' data-choice='betMax'  class='playerChoiceButtons'>Bet Max</button>");
        $("#buttonView").append("<button id='deal' type='button' data-choice='deal'  class='playerChoiceButtons'>Deal/Draw</button>");
        game.updatePlayerScore();
        $(".playerChoiceButtons").one('click', function () {
            game.buttonChoice = $(this).attr('data-choice');
            game.buttonAction();

        });

    },
    buttonAction: function () {
        // game.buttonChoice = $(this).attr('data-choice');
        switch (game.buttonChoice) {
            case 'betOne':
                if (currentBet <= 4) {
                    database.ref("users/" + uid + "/bet").set(currentBet += 1);
                    game.updatePlayerScore();
                    game.playerChoices();

                } else {
                    $("#gameText").html("That is your max bet! You must draw now!");
                    game.playerChoices();

                }


                break;
            case 'betMax':
                if (currentBet <= 4) {
                    database.ref("users/" + uid + "/bet").set(5);
                    game.updatePlayerScore();
                    game.playerChoices();

                } else {
                    $("#gameText").html("That is your max bet! You must draw now!");
                    game.playerChoices();

                }
                break;

            case 'deal':

                game.dealCards();
                // game.playerChoices();
                // game.drawCard();
                // game.updatePlayerScore();
                break;

        }
    },
    updatePlayerScore: function () {
        newUserRef.once("value").then(function (snapshot) {
            updateVariables();
        })
    },
    reset: function () {

    }

}




deckObj.createDeck();
