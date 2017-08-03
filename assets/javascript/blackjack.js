// var deckObj = {

//     deckID: "",
//     queryURL:"https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
//     deck: [],

//     createDeck: function() {
//         $.ajax({
//                 url: queryURL,
//                 method: "GET"
//             })
//             .done(function(response) {
//                 deckID = response.deck_id;

//                 deckObj.getDeck();
//             });
//     },


//     getDeck: function() {
//         var queryURL6 = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=52";
//         $.ajax({
//                 url: queryURL6,
//                 method: "GET"
//             })
//             .done(function(response) {

//                 deck = response.cards;


//             });

//     }



// }

var deckID = "";
var queryURL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
var deck = [];

function createDeck() {
    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .done(function(response) {
            deckID = response.deck_id;

            getDeck();
        });
}


function getDeck() {
    var queryURL6 = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=52";
    $.ajax({
            url: queryURL6,
            method: "GET"
        })
        .done(function(response) {

            deck = response.cards;
            $("#buttonView").append("<button id='dealCards' type='button' class='btn btn-outline-primary'>Deal Cards</button>");
            $("#dealCards").one('click', game.dealCards);
        });

}



createDeck();



var game = {
    arrayhand: {},
    buttonChoice: "",
    playerCards: [],
    playerScore: 0,

    dealCardsListener: function() {
        // $("#dealCards").one('click', game.dealCards);

    },

    dealCards: function() {
        //get hand
        var card1ImgURL = deck[deck.length - 1].image;
        var card1Img = "<img src='" + card1ImgURL + "'</img>"
        $("#handView").append(card1Img)
        var card2ImgURL = deck[deck.length - 2].image;
        var card2Img = "<img src='" + card2ImgURL + "'</img>"
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
    playerChoices: function() {
        game.buttonChoice = "";
        $("#buttonView").html("");
        $("#buttonView").append("<button class='playerChoiceButtons' data-choice='hit' id='hit' type='button' class='btn btn-outline-primary'>Hit</button>");
        $("#buttonView").append("<button class='playerChoiceButtons' data-choice='stand' id='stand' type='button' class='btn btn-outline-primary'>Stand</button>");
        // $("#buttonView").append("<button class='playerChoiceButtons' data-choice='doubleDown' id='doubleDown' type='button' class='btn btn-outline-primary'>Double Down</button>");

        $(".playerChoiceButtons").one('click', function() {
            game.buttonChoice = $(this).attr('data-choice');
            game.buttonAction()

        });

    },
    buttonAction: function() {
        // game.buttonChoice = $(this).attr('data-choice');
        switch (game.buttonChoice) {
            case 'hit':
                var card1ImgURL = deck[deck.length - 1].image;
                var card1Img = "<img src='" + card1ImgURL + "'</img>"
                $("#handView").append(card1Img)

                //Adding cards to array with suit and card value
                game.playerCards.push([deck[deck.length - 1].suit, deck[deck.length - 1].value]);
                console.log("Player just clicked hit, deck seen below");
                console.log(game.playerCards);
                deck.pop();
                game.updatePlayerScore();
                game.playerChoices();



                break;
            case 'stand':


                dealer.dealerTurn();

                break;
                // case 'doubleDown':

                //     break;
        }
    },
    updatePlayerScore: function() {
        game.playerScore = 0;
        for (i = 0; i < game.playerCards.length; i++) {
            var num = parseInt((game.playerCards[i])[1]) || 10;
            game.playerScore += num;
        }
        if (game.playerScore >= 21) {
            game.playerBust();
        }
        console.log("Player score is " + game.playerScore);
    },
    playerBust: function() {
        $("#gameText").html("<p> Your score is " + game.playerScore + ". This is over 21, you bust! </p>");
    }


}

var dealer = {
    arrayhand: {},
    buttonChoice: "",
    dealerCards: [],
    dealerScore: 0,
    dealerBust: false,

    drawCard: function() {
        //get hand

        var card1ImgURL = deck[deck.length - 1].image;
        var card1Img = "<img src='" + card1ImgURL + "'</img>"
        $("#dealerHand").append(card1Img)

        //Adding cards to array with suit and card value
        dealer.dealerCards.push([deck[deck.length - 1].suit, deck[deck.length - 1].value]);
        deck.pop();


        console.log("Below is dealer's hand!");
        console.log(dealer.dealerCards);

        dealer.updateDealerScore();

    },
    updateDealerScore: function() {
        dealer.dealerScore = 0;
        for (i = 0; i < dealer.dealerCards.length; i++) {
            var num = parseInt((dealer.dealerCards[i])[1]) || 10;
            dealer.dealerScore += num;
        }
        if (dealer.dealerScore >= 21) {
            dealer.dealerBust();
            dealer.dealerBust = false;
        }
        console.log("Dealer score is" + dealer.dealerScore);

    },

    dealerTurn: function() {
        $("#gameText").html("<p> Dealer's turn!</p>");
        while (dealer.dealerScore <= 17) {
            dealer.drawCard();
        }
        console.log("Dealer's score after stand is" + dealer.dealerScore);
        dealer.endGame();


    },
    dealerBust: function() {
        $("#gameText").html("<p> Dealer busted!</p>");
    },
    endGame: function() {
      if (game.playerScore > dealer.dealerScore) {
        $("#gameText").html("<p> The player wins! Hit replay to play again! </p>");
        $("#buttonView").html("");
        $("#buttonView").append("<button id='playAgain' type='button' class='btn btn-outline-primary'>Play Again</button>");
        // $("#dealCards").one('click', game.dealCards);
      } else if (game.playerScore < dealer.dealerScore){
        if (dealer.dealerBust===false) {
          $("#gameText").html("<p> The dealer wins! Click on play Again to play again! </p>");
          $("#buttonView").html("");
          $("#buttonView").append("<button id='playAgain' type='button' class='btn btn-outline-primary'>Play Again</button>");

        }else {
          $("#gameText").html("<p> The Player wins! The dealer busted! </p>");
          $("#buttonView").html("");
          $("#buttonView").append("<button id='playAgain' type='button' class='btn btn-outline-primary'>Play Again</button>");
        }
      } else{
        $("#gameText").html("<p> Tie Game! The pot is split! </p>");
        $("#buttonView").html("");
        $("#buttonView").append("<button id='playAgain' type='button' class='btn btn-outline-primary'>Play Again</button>");
      }
    }
}


game.dealCardsListener();