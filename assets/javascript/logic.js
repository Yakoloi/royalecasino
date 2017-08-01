      var deckID = "";
      var queryURL = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";

      $.ajax({
              url: queryURL,
              method: "GET"
          })
          .done(function(response) {
              deckID = response.deck_id;
          });




      // $("#dealCards").on("click", function() {

      //   var queryURL2 = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=2";

      //   $.ajax({
      //       url: queryURL2,
      //       method: "GET"
      //     })
      //     .done(function(response) {
      //       var card1ImgURL = response.cards[0].image;
      //       var card1Img = "<img src='" + card1ImgURL + "'</img>"
      //       $("#handView").append(card1Img) 
      //       });

      //     });

      var game = {
          arrayhand: {},
          buttonChoice: "",

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
                      var card1ImgURL = response.cards[0].image;
                      var card1Img = "<img src='" + card1ImgURL + "'</img>"
                      $("#handView").append(card1Img)
                      var card2ImgURL = response.cards[1].image;
                      var card2Img = "<img src='" + card2ImgURL + "'</img>"
                      $("#handView").append(card2Img)
                  });
              game.playerChoices();

          },
          playerChoices: function() {
              game.buttonAuction = "";
              $("#buttonView").html("");
              $("#buttonView").append("<button class='playerChoiceButtons' data-choice='hit' id='hit' type='button' class='btn btn-outline-primary'>Hit</button>");
              $("#buttonView").append("<button class='playerChoiceButtons' data-choice='stand' id='stand' type='button' class='btn btn-outline-primary'>Stand</button>");
              $("#buttonView").append("<button class='playerChoiceButtons' data-choice='doubleDown' id='doubleDown' type='button' class='btn btn-outline-primary'>Double Down</button>");

              $(".playerChoiceButtons").one('click', game.buttonAction);

          },
          buttonAction: function() {
              game.buttonAction = $(this).attr('data-choice');
              switch (game.buttonAction) {
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
                          });
                          game.playerChoices();

                      break;
                  case 'stand':


                      console.log("You selected stand!");

                      break;
                  case 'doubleDown':

                      break;
              }
          }


      }

      game.dealCardsListener();