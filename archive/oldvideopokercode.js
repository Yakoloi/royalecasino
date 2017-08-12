// $(document).on("click", ".holdButton.btn-transparent", function(){
//             game.holdIndex = $(this).attr('data-index');
//             game.isClicked = $(this).attr('data-isClicked');

//             game.currentholdCard = $(this);
//             game.indexOfHoldCards.sort();
//             counter +=1;
//             // game.indexOfHoldCards.push(game.holdIndex);
//             // if ($.inArray(a.toString(), game.indexOfHoldCards) === -1) {
//             var alreadyClicked2 = $.inArray(game.holdIndex, game.indexOfHoldCards);
//             if (alreadyClicked2 ===-1) {
//                 game.indexOfHoldCards.push(game.holdIndex);
//                 $(this).attr("data-isClicked", true);
//             } else {
//                 var alreadyClicked = $.inArray(game.holdIndex, game.indexOfHoldCards);
//                 while (alreadyClicked !== -1) {
//                     game.indexOfHoldCards.splice(alreadyClicked, 1);
//                     // for(i=0; i<game.indexOfHoldCards.length; i++){
//                     //     if(game.indexOfHoldCards[i]===game.indexOfHoldCards[i+1]
//                     // }
//                     alreadyClicked = $.inArray(game.holdIndex, game.indexOfHoldCards);
//                 }

//                 // while (previousClick !== -1) {
//                 //     game.indexOfHoldCards.splice(previousClick, 1);
//                 //     previousClick = game.indexOfHoldCards.indexOf(game.holdIndex);
//                 // }
//                 $(this).attr("data-isClicked", false);
//             }
//             // game.holdCards();

//             // var holdCardId = $(this).attr('id');
//             // var holdCardIdNum = parseInt(holdCardId.substring(4, 5));
//             // var evalCardImage = eval("card" + holdCardIdNum + "Img");
//             // var cardDiv = "#holdCard" + holdCardIdNum;
//             // $(cardDiv).html("");
//             // $(cardDiv).html("<div class='row'> " + evalCardImage + " </div>" + "<div class='row'>" + "<button id='card'" + holdCardIdNum + " type='button' class='holdButton btn-transparent'>Hold</button></div>");
//             // $("#" + holdCardId).attr("data-index", holdCardIdNum);

// });