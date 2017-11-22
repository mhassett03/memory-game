// Set-up of the symbols list, etc.
var symbols = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'cube', 'cube', 'anchor', 'anchor', 'bicycle', 'bicycle', 'bomb', 'bomb', 'leaf', 'leaf'],
	opened = [],
	match = 0,
	moves = 0,
	clicks = 0,
	$deck = jQuery('.deck'),
	$scorePanel = $('#score-panel'),
	$moveNum = $('.moves'),
	$starScore = $('i'),
	$restart = $('.restart'),
	timer;


// Game-timer installation
var gameTimer = () => {
	var startTime = new Date().getTime();

	// Update the timer every second
	timer = setInterval(() => {

		var now = new Date().getTime();

		// Find the time elapsed between now and start
		var elapsed = now - startTime;

		// Calculates minutes and seconds
		var minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

		// Add starting '0' if seconds < 10
		if (seconds < 10) {
			seconds = "0" + seconds;
		}

		var currentTime = minutes + ':' + seconds;

		// Update clock on game screen and modal
		$(".clock").text(currentTime);
	}, 750);
};


// "Test Your Memory" Game Engine with shuffled symbols
var startGame = ()=> {
  var cards = shuffle(symbols);
  $deck.empty();
  match = 0;
  moves = 0;
  $moveNum.text('0');
  $starScore.removeClass('fa-star-o').addClass('fa-star');
	for (var i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
	}
	addClkListener();
	$(".clock").text("0:00");
};


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
	Gives star-rating based on number of tries to complete the game by removing stars
	Displays the number of tries it took to complete the game
*/
var setRating =(moves)=> {
	var score = 3;
	if(moves <= 12) {
		$starScore.eq(3).removeClass('fa-star').addClass('fa-star-o');
		score = 3;
	} else if (moves > 12 && moves <= 16) {
		$starScore.eq(2).removeClass('fa-star').addClass('fa-star-o');
		score = 2;
	} else if (moves > 16) {
		$starScore.eq(1).removeClass('fa-star').addClass('fa-star-o');
		score = 1;
	}
	return { score };
};



var addClkListener = ()=> {
	// Card click listener for flipping card
	$deck.find('.card:not(".match, .open")').bind('click' , function() {
		clicks++ ;
		clicks == 1 ? gameTimer() :'';
		// Check for call to happen before all dom update
		if($('.show').length > 1) { return true; };
		var $this = $(this), card = $this.context.innerHTML;
		// Check if the player has clicked the same card
		if($this.hasClass('open')){ return true;};
	  $this.addClass('open show');
		opened.push(card);
		// Check the card
		// Add/remove appropriate CSS animation classes
	  if (opened.length > 1) {
	    if (card === opened[0]) {
	      $deck.find('.open').addClass('match animated infinite rubberBand');
	      setTimeout(()=> {
	        $deck.find('.match').removeClass('open show animated infinite rubberBand');
	      }, 500);
	      match++;
	    } else {
	      $deck.find('.open').addClass('notmatch animated infinite wobble');
				setTimeout(()=> {
					$deck.find('.open').removeClass('animated infinite wobble');
				}, 500 / 1.5);
	      setTimeout(()=> {
	        $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
	      }, 500);
	    }
	    opened = [];
			moves++;
			setRating(moves);
			$moveNum.html(moves);
	  }
		// If all cards are matching (8 matches) will end the "Test Your Memory" Game
		if (match === 8) {
			setRating(moves);
			var score = setRating(moves).score;
			setTimeout(()=> {
				endGame(moves, score);
			}, 800);
	  }
	});
};


/*
	Ends the "Test Your Memory" Game
	Open popup window with final score and 'play again' option
*/
var endGame = (moves, score) => {
	var numberOfStars = score == 1 ? score + ' star.' :score +' stars.';
	// SweetAlerts from https://limonte.github.io/sweetalert2/
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'You did it!',
		text: 'In ' + moves + ' tries and ' + numberOfStars + '\n Great Job!',
		type: 'success',
		confirmButtonColor: '#79CCF6',
		confirmButtonText: 'Do it again!'
	}).then((isConfirm)=> {
		if (isConfirm) {
			clicks = 0;
			clearInterval(timer);
			startGame();
		}
	})
}


/*
	Restarts the "Test Your Memory" Game
	Open popup window with 'restart' confirmation
*/
$restart.bind('click', ()=> {
	// SweetAlerts from https://limonte.github.io/sweetalert2/
	swal({
    allowEscapeKey: false,
    allowOutsideClick: false,
    title: 'Are you sure?',
    text: "This decision is final!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#79CCF6',
    cancelButtonColor: '#3981A5',
    confirmButtonText: 'Yes, restart game!'
  }).then((isConfirm)=> {
    if (isConfirm) {
			clicks = 0;
			clearInterval(timer);
      startGame();
    }
  })
});


// Runs the "Test Your Memory" Game
startGame();
