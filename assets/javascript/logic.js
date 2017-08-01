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

          dealCardsListener: function() {
              $("#buttonView").append("<button id='dealCards' type='button' class='btn btn-outline-primary'>Deal Cards</button>");
              $(document).one('click', game.dealCards);
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
        $("#buttonView").html("");
        $("#buttonView").append("<button id='dealCards' type='button' class='btn btn-outline-primary'>Hit</button>");
        $("#buttonView").append("<button id='dealCards' type='button' class='btn btn-outline-primary'>Stand</button>");
        $("#buttonView").append("<button id='dealCards' type='button' class='btn btn-outline-primary'>Double Down</button>");
      }


      }

      game.dealCardsListener();