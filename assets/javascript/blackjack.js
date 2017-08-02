      var deckID = "";
      var queryURL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

      $.ajax({
              url: queryURL,
              method: "GET"
          })
          .done(function(response) {
              deckID = response.deck_id;
              console.log(response);
          });

      var game = {
          arrayhand: {},
          buttonChoice: "",
          playerCards: [],
          playerScore: 0,

          dealCardsListener: function() {
              $("#buttonView").append("<button id='dealCards' type='button' class='btn btn-outline-primary'>Deal Cards</button>");
              $("#dealCards").one('click', game.dealCards);
          },

          dealCards: function() {
              //get hand
              var queryURL2 = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=2";

              $.ajax({
                      url: queryURL2,
                      method: "GET"
                  })
                  .done(function(response) {
                      console.log(response);
                      var card1ImgURL = response.cards[0].image;
                      var card1Img = "<img src='" + card1ImgURL + "'</img>"
                      $("#handView").append(card1Img)
                      var card2ImgURL = response.cards[1].image;
                      var card2Img = "<img src='" + card2ImgURL + "'</img>"
                      $("#handView").append(card2Img)


                      //Adding cards to array with suit and card value
                      game.playerCards.push([response.cards[0].suit, response.cards[0].value]);
                      game.playerCards.push([response.cards[1].suit, response.cards[1].value]);
                      console.log(game.playerCards);
                      //how to access an array in an array (game.playerCards[0])[1]
                      console.log((game.playerCards[0])[1]);
                      // console.log(typeof (game.playerCards[0])[1]);
                      dealer.drawCard();
                      game.updatePlayerScore();
                      game.playerChoices();

                  });

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

                      var queryURL3 = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=1";

                      $.ajax({
                              url: queryURL3,
                              method: "GET"
                          })
                          .done(function(response) {
                              var card1ImgURL = response.cards[0].image;
                              var card1Img = "<img src='" + card1ImgURL + "'</img>"
                              $("#handView").append(card1Img)
                              game.playerCards.push([response.cards[0].suit, response.cards[0].value]);
                              console.log(game.playerCards);
                              $("#gameText").append("<p> You got a " + (game.playerCards[game.playerCards.length - 1])[1] + " of " + (game.playerCards[game.playerCards.length - 1])[0] + "</p>");
                              game.updatePlayerScore();
                              game.playerChoices();

                          });

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

              drawCard: function() {
                  //get hand
                  var queryURL4 = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=1";

                  $.ajax({
                          url: queryURL4,
                          method: "GET"
                      })
                      .done(function(response) {
                          console.log(response);
                          var card1ImgURL = response.cards[0].image;
                          var card1Img = "<img src='" + card1ImgURL + "'</img>"

                          $("#dealerHand").append(card1Img)

                          //Adding cards to array with suit and card value
                          dealer.dealerCards.push([response.cards[0].suit, response.cards[0].value]);
                          console.log(dealer.dealerCards);
                          //how to access an array in an array (game.playerCards[0])[1]
                          console.log((dealer.dealerCards[0])[1]);
                          dealer.updateDealerScore();
                      });
              },
              updateDealerScore: function() {
                  dealer.dealerScore = 0;
                  for (i = 0; i < dealer.dealerCards.length; i++) {
                      var num = parseInt((dealer.dealerCards[i])[1]) || 10;
                      dealer.dealerScore += num;
                  }
                  if (dealer.dealerScore >= 21) {
                      dealer.dealerBust();
                  }

              },

              dealerTurn: function() {
                  $("#gameText").html("<p> Dealer's turn!</p>");
                  // for (i = 0; dealer.dealerScore < 16; i++) {
                  //     console.log("i is " + i)
                  //     var queryURL2 = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=1";

                  //     $.ajax({
                  //             url: queryURL4,
                  //             method: "GET"
                  //         })
                  //         .done(function(response) {
                  //             console.log(response);
                  //             var card1ImgURL = response.cards[0].image;
                  //             var card1Img = "<img src='" + card1ImgURL + "'</img>"

                  //             $("#dealerHand").append(card1Img)

                  //             //Adding cards to array with suit and card value
                  //             dealer.dealerCards.push([response.cards[0].suit, response.cards[0].value]);
                  //             console.log(dealer.dealerCards);
                  //             //how to access an array in an array (game.playerCards[0])[1]
                  //             console.log((dealer.dealerCards[0])[1]);
                  //             dealer.updateDealerScore();
                  //         });

                  // }

              // if(dealer.dealerScore<=15) {
              //   $.when(dealer.drawCard()).then(dealer.dealerTurn());
              //   // dealer.drawCard();
              //   // dealer.dealerTurn();
              // }else {
              //   $("#gameText").html("<p> Dealer is done! </p>");
              // }


          },
          dealerBust: function() {
              $("#gameText").html("<p> Dealer busted!</p>");
          }
      }

      game.dealCardsListener();