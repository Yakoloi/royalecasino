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

        //reset everything
        // $("#playerScore").html("Player Score: 0");
        // $("#playerChips").html("Player Chips: 0");
        // $("#dealerScore").html("Dealer Score: 0");
        //    $("#buttonView").html("");
        //    $("#handView").html("");
        //    $("#dealerHand").html("");
        //    $("#gameText").html("");
        game.playerScore = 0;
        game.playerCards = [];



        deckObj.createDeck();
    },
    gameOverDisplay: function() {
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
    chips: 100,
    bet: 1,
    paid: 0,

    drawCards: function() {
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
        game.displayNewCards();


        // var card1ImgURL = deck[deck.length - 1].image;
        // var card1Img = "<img src='" + card1ImgURL + "'</img>"
        // $("#handView").append(card1Img)

        // //Adding cards to array with suit and card value
        // game.playerCards.push([deck[deck.length - 1].suit, deck[deck.length - 1].value]);
        // console.log("Player just clicked hit, deck seen below");
        // console.log(game.playerCards);
        // deck.pop();
    },

    handLogic: function() {
        console.log("handLogic function called");
    },

    displayNewCards: function() {

        for (i = 0; i < game.playerCards2.length; i++) {
            var cardImgURL = game.playerCards2[i][2];
            var cardImg = "<img id='card" + i + "Img' src='" + cardImgURL + "'></img>"
            $("#handView").append(cardImg);
        }

    },

    dealCards: function() {
        //get hand
        $("#handView").html("");
        var card1ImgURL = deck[deck.length - 1].image;
        var card1Img = "<img id='card1Img' src='" + card1ImgURL + "'></img>"
        $("#handView").append("<div class='hold'> " + card1Img + "<button id='card1' type='button' class='holdButton'>Hold</button></div>");
        var card2ImgURL = deck[deck.length - 2].image;
        var card2Img = "<img id='card2Img'  src='" + card2ImgURL + "'></img>"
        $("#handView").append("<div class='hold'> " + card2Img + "<button id='card2' type='button' class='holdButton'>Hold</button></div>");
        var card3ImgURL = deck[deck.length - 3].image;
        var card3Img = "<img  id='card3Img'  src='" + card3ImgURL + "'></img>"
        $("#handView").append("<div class='hold'> " + card3Img + "<button id='card3' type='button' class='holdButton'>Hold</button></div>");
        var card4ImgURL = deck[deck.length - 4].image;
        var card4Img = "<img  id='card4Img'  src='" + card4ImgURL + "'></img>"
        $("#handView").append("<div class='hold'> " + card4Img + "<button id='card4' type='button' class='holdButton'>Hold</button></div>");
        var card5ImgURL = deck[deck.length - 5].image;
        var card5Img = "<img  id='card5Img'  src='" + card5ImgURL + "'></img>"
        $("#handView").append("<div class='hold'> " + card5Img + "<button id='card5' type='button' class='holdButton'>Hold</button></div>");


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

        $(".holdButton").on("click", function() {
            game.holdIndex = $(this).attr('data-index');
            game.holdCards();
        });
        $("#deal").one("click", function() {
            game.drawCards();
        });

    },
    holdCards: function() {
        var trackDoubles = [];
        game.indexOfHoldCards.push(game.holdIndex);

    },
    playerChoices: function() {
        game.buttonChoice = "";

        $("#buttonView").html("");
        $("#buttonView").append("<button id='betOne' type='button' data-choice='betOne' class='playerChoiceButtons'>Bet One</button>");
        $("#buttonView").append("<button id='betMax' type='button' data-choice='betMax'  class='playerChoiceButtons'>Bet Max</button>");
        $("#buttonView").append("<button id='deal' type='button' data-choice='deal'  class='playerChoiceButtons'>Deal/Draw</button>");

        $(".playerChoiceButtons").one('click', function() {
            game.buttonChoice = $(this).attr('data-choice');
            game.buttonAction();

        });

    },
    buttonAction: function() {
        // game.buttonChoice = $(this).attr('data-choice');
        switch (game.buttonChoice) {
            case 'betOne':
                if (game.bet <= 4) {
                    game.bet += 1;
                    game.updatePlayerScore();
                    game.playerChoices();

                } else {
                    $("#gameText").html("That is your max bet! You must draw now!");
                    game.playerChoices();

                }


                break;
            case 'betMax':
                if (game.bet <= 4) {
                    game.bet = 5;
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
    updatePlayerScore: function() {
        $("#playerChips").html("Player Chips: " + game.chips);
        $("#bet").html("Bet: " + game.bet);
        $("#paid").html("Paid: " + game.paid);


    }

}




deckObj.createDeck();