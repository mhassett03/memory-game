// Set-up of the symbols list, etc.
let symbols = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o', 'bolt', 'bolt', 'cube', 'cube', 'anchor', 'anchor', 'bicycle', 'bicycle', 'bomb', 'bomb', 'leaf', 'leaf'],
	opened = [],  // Array of Card
	match = 0, // varaible Initialization for match
	moves = 0, // variable Initialization  for move
	clicks = 0, // variable Initialization for Clicks
	$deck = jQuery('.deck'),  // get html and pass it to Javascript
	$scorePanel = $('#score-panel'),  // get html and pass it to Javascript scorepanel
	$moveNum = $('.moves'), // same for moves
	$starScore = $('i'),
	$restart = $('.restart'), // same for restart button
	timer;


// Game-timer installation
let gameTimer = () => {
	let startTime = new Date().getTime();   // get the current time from the system

	// Update the timer every second
	timer = setInterval(() => {

		let now = new Date().getTime();

		// Find the time elapsed between now and start
		let elapsed = now - startTime;

		// Calculates minutes and seconds
		let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

		// Add starting '0' if seconds < 10
		if (seconds < 10) {
			seconds = "0" + seconds;
		}

		let currentTime = minutes + ':' + seconds; // Current Time in the form of 10:00

		// Update clock on game screen and modal
		$(".clock").text(currentTime);
	}, 750);
};


// "Test Your Memory" Game Engine with shuffled symbols
let startGame = ()=> {

	let cards = shuffle(symbols); // call the function and everything gets shuffled.
  $deck.empty();
  match = 0;
  moves = 0;
  $moveNum.text('0');
  $starScore.removeClass('fa-star-o').addClass('fa-star'); // It removes some static html and put a dynamic one after shuffling cards
	for (let i = 0; i < cards.length; i++) {
		$deck.append($('<li class="card"><i class="fa fa-' + cards[i] + '"></i></li>'))
	}
	addClkListener(); // Click function started
	$(".clock").text("0:00");
};


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

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
let setRating =(moves)=> {
	let score = 3;
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



let addClkListener = ()=> {
	// Card click listener for flipping card
	$deck.find('.card:not(".match, .open")').bind('click' , function() {
		clicks++ ; // Increment in Click
		clicks == 1 ? gameTimer() :''; // Timer starts on first click
		// Check for call to happen before dom update
		if($('.show').length > 1) { return true; };
		let $this = $(this), card = $this.context.innerHTML;
		// Check if the player has clicked the same card
		if ($this.hasClass('open')) { return true; };  // the player has clicked the same card
	  $this.addClass('open show');
		opened.push(card); // should add in a array where we can keep track of all elements that has been matched in the game
		// Check the card
		// Add and remove appropriate CSS animation classes
	  if (opened.length > 1) {
	    if (card === opened[0]) { // Yes
	      $deck.find('.open').addClass('match animated infinite rubberBand'); // add the class of rubberBand that show static Layout for matched
	      setTimeout(()=> {
	        $deck.find('.match').removeClass('open show animated infinite rubberBand'); // remove class
	      }, 500);
	      match++; // Increment in match
	    } else {
	      $deck.find('.open').addClass('notmatch animated infinite wobble'); // if not matched add notmached wooble clas that wobble for a second
				setTimeout(()=> {
					$deck.find('.open').removeClass('animated infinite wobble'); // remove previous class
				}, 500 / 1.5);
	      setTimeout(()=> {
	        $deck.find('.open').removeClass('open show notmatch animated infinite wobble');
	      }, 500);
	    }
	    opened = [];
			moves++;
			setRating(moves); // function call for moves
			$moveNum.html(moves); // put into the html to show on client side
	  }
		// If all cards are matching (8 matches) will end the "Test Your Memory" Game
		if (match === 8) {
			setRating(moves);
			let score = setRating(moves).score;
			setTimeout(()=> {
				endGame(moves, score); // end game get moves and score
			}, 800);
	  }
	});
};


/*
	Ends the "Test Your Memory" Game
	Open popup window with final score and 'play again' option
*/
let endGame = (moves, score) => {

  var Total_Time =  $(".clock").text(); // get time from timer
	let numberOfStars = score == 1 ? score + ' star.' :score +' stars.';
	// SweetAlerts from https://limonte.github.io/sweetalert2/
	swal({
		allowEscapeKey: false,
		allowOutsideClick: false,
		title: 'You did it!',
		text: 'In ' + Total_Time + ' and ' + numberOfStars + ' Great Job!', // text to show on congrats
		type: 'success',
		confirmButtonColor: '#79CCF6',
		confirmButtonText: 'Do it again!'
	}).then((isConfirm)=> { // click on play once again
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
