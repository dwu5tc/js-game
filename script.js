// add multiplier visibility
// add UX for the info window
// fix window layouts; redo css overall 
// balance the difficulty
// "+x" show up after click?
// cat/dog approach same colour? svg it
// fix responsive
// add sounds? sound icon to toggle
// OVERHAUL WHOLE DESIGN LAKSGJLALSKJGLASKG
// player cannot proceed without picking an animal
// game over window gives player information
// best practice w/ myApp.addListener etc.

$(function() {
	$(".game-over__window").css("display", "none");
	$(".info-window").css("display", "none");
	$(".player-combo").css("visibility", "hidden");

	var choiceOnePath = "images/dog-small.png";
	var choiceTwoPath = "images/cat-small.png";
	var extraLifePath = "images/heart.png";
	var multiplierPath = "images/multiplier.png";
	var bgColour = "#fff9d8";
	var deathColour = "#a01010";

	var imageSize = 80;
	var userChoice = null;
	var playerScore = 0;
	var playerLives = 3;
	var lifeTimeAnimal = 7000;
	var lifeTimeOther = 3000;

	var spawnAnimalMin = 250;
	var spawnAnimalAdd = 750;
	var spawnOtherMin = 30000;
	var spawnOtherAdd = 30000;

	var multiplier = 1;
	var difficulty = 1;
	var difficultyThreshold = 100;
	var comboMeter = 0;
	var comboMultiplier = 1;
	var translateOn = false; // use this 
	var translationModifier = 0;

	$(".animal-choice__one").on("click touchstart", function() {
		userChoice = "choice--one";
		$(this).addClass("choice-selected");
		if ($(".animal-choice__two").hasClass("choice-selected")) {
			$(".animal-choice__two").removeClass("choice-selected");
		}
	});

	$(".animal-choice__two").on("click touchstart", function() {
		userChoice = "choice--two";
		$(this).addClass("choice-selected");
		if ($(".animal-choice__one").hasClass("choice-selected")) {
			$(".animal-choice__one").removeClass("choice-selected");
		}
	});

	$(".start-button").on("click touchstart", function() {
		$(".info-window").css("display", "block");
		$(".footer").hide();
		$(".start-window").hide();
		setTimeout(function() {
			generateAnimals();
			generateLife();
			generateMultiplier();
		}, generateRandomTime());
	});

	function generateAnimals() {
		if (playerLives <= 0) {
			return;
		}
		if (userChoice == "choice--one") {
			var generateUserChoice = generateChoiceOne;
			var generateNonChoice = generateChoiceTwo;
		}
		else {
			var generateUserChoice = generateChoiceTwo;
			var generateNonChoice = generateChoiceOne;
		}
		for (var i = 0; i < difficulty/2; i++) {
			generateNonChoice();
		}
		generateUserChoice();
		setTimeout(function() { 
			generateAnimals();
		}, generateRandomTime(spawnAnimalMin, spawnAnimalAdd));
	}

	function generateRandomTime(minTime, additionalTime) {
		return minTime + (Math.floor(Math.random() * additionalTime));
	}

	function generateAnimalID() {
		return Math.floor(Math.random() * 100000);
	}

	function generatePosition() {
		var xVal = (Math.random() * 100).toFixed(2);
		var yVal = (Math.random() * 100).toFixed(2);
		var position = {
			x: xVal,
			y: yVal
		};
		return position;
	}

	function withinBounds(a) {
		return a.x >= 10 && a.x <= 90 && a.y >= 10 && a.y <= 90;
	}

	function collisionCheck(a, b) {
		var aObj = a.getBoundingClientRect();
		var bObj = b.getBoundingClientRect();
		return false;
	}

	function outsideInfoWindow(a) {
		var vpWidth = $(window).width();
		var vpHeight = $(window).height();
		var infoWindow = $(".info-window")[0].getBoundingClientRect();
		var checkHorizontal = (a.x/100)*vpWidth < infoWindow.right+(imageSize/2);
		var checkVertical = (a.y/100)*vpHeight < infoWindow.bottom+(imageSize/2);
		if (checkHorizontal && checkVertical) { 
			return false; 
		}
		return true;
	}

	function generateChoiceOne() {
		while (true) {
			var position = generatePosition();
			if (withinBounds(position) && outsideInfoWindow(position)) {
				break; 
			}
		}
		var temporaryID = generateAnimalID();
		$(".wrapper").append(`<img src="${choiceOnePath}" alt="animal choice one" style="left: ${position.x}%; top: ${position.y}%" class="animal-image choice--one" id="${temporaryID}">`);
		
		var xRate = Math.random()*translationModifier;
		var yRate = Math.random()*translationModifier;
		if (Math.random() < 0.5) {
			xRate *= -1;
		}
		if (Math.random() < 0.5) {
			yRate *= -1;
		}
		translate("#"+temporaryID, xRate, yRate);

		setTimeout(function() {
			$("#"+temporaryID).remove();
		}, lifeTimeAnimal);
	}

	function generateChoiceTwo() {
		while (true) {
			var position = generatePosition();
			if (withinBounds(position) && outsideInfoWindow(position)) {
				break; 
			}
		}
		var temporaryID = generateAnimalID();
		$(".wrapper").append(`<img src="${choiceTwoPath}" alt="animal choice two" style="left: ${position.x}%; top: ${position.y}%" class="animal-image choice--two" id="${temporaryID}">`);
		
		var xRate = Math.random()*translationModifier;
		var yRate = Math.random()*translationModifier;
		if (Math.random() < 0.5) {
			xRate *= -1;
		}
		if (Math.random() < 0.5) {
			yRate *= -1;
		}
		translate("#"+temporaryID, xRate, yRate);

		setTimeout(function() {
			$("#"+temporaryID).remove();
		}, lifeTimeAnimal);
	}

	$(".wrapper").on("click touchstart", ".animal-image", function() {
		if ($(this).hasClass(userChoice)) {
			switch (comboMeter) {
				case 15:
					comboMultiplier = 2;
					$(".player-combo").css("visibility", "visible");
					break;
				case 25:
					comboMultiplier = 3;
					break;
				case 50:
					comboMultiplier = 4;
					break;
				case 100:
					comboMultiplier = 5;
					break;
			}
			playerScore = playerScore + (5*multiplier*comboMultiplier);
			comboMeter = comboMeter + 1;
			$(".player-combo__value").html(comboMeter);
		}
		else {
			playerLives = playerLives - 1;
			$("body").css("background", deathColour);
			setTimeout(function() {
				$("body").css("background", bgColour);
			}, 50);
			comboMeter = 0;
			comboMultiplier = 1;
			$(".player-combo").css("visibility", "hidden");
		}
		$(".player-score").html(playerScore);
		$(".player-lives").html(playerLives);
		if (playerLives <= 0) {
			$(".animal-image").remove();
			$(".extra-life").remove();
			$(".game-over__window").css("display", "flex");
		}
		if  (playerScore > difficultyThreshold) {
			difficulty += 1;
			console.log(playerScore, difficulty);
			translationModifier += 0.25;
			difficultyThreshold *= 2;
		}
		this.remove();
	});

	$(".wrapper").on("click touchstart", ".extra-life", function() {
		playerLives = playerLives + 1;
		$(".player-lives").html(playerLives);
		$(".extra-life").remove();
	});

	$(".wrapper").on("click touchstart", ".multiplier", function() {
		multiplier = 2;
		setTimeout(function() {
			multiplier = 1;
		}, 10000);
		$(".multiplier").remove();
	});

	function generateLife() {
		setTimeout(function() { 
			while (true) {
				var position = generatePosition();
				if (withinBounds(position) && outsideInfoWindow(position)) {
					break; 
				}
			}
			if (playerLives <= 0) {
				return;
			}
			$(".wrapper").append(`<img src="${extraLifePath}" alt="heart" style="left: ${position.x}%; top: ${position.y}%" class="extra-life">`);
			
			var xRate = Math.random()*translationModifier;
			var yRate = Math.random()*translationModifier;
			if (Math.random() < 0.5) {
				xRate *= -1;
			}
			if (Math.random() < 0.5) {
				yRate *= -1;
			}
			translate(".extra-life", xRate, yRate);

			setTimeout(function() {
				$(".extra-life").remove();
			}, lifeTimeOther);
			generateLife();
		}, generateRandomTime(spawnOtherMin, spawnOtherAdd));
	}

	function generateMultiplier() {
		setTimeout(function() { 
			while (true) {
				var position = generatePosition();
				if (withinBounds(position) && outsideInfoWindow(position)) {
					break; 
				}
			}
			if (playerLives <= 0) {
				return;
			}
			$(".wrapper").append(`<img src="${multiplierPath}" alt="x2 multiplier" style="left: ${position.x}%; top: ${position.y}%" class="multiplier">`);
			
			var xRate = Math.random()*translationModifier;
			var yRate = Math.random()*translationModifier;
			if (Math.random() < 0.5) {
				xRate *= -1;
			}
			if (Math.random() < 0.5) {
				yRate *= -1;
			}
			translate(".multiplier", xRate, yRate);

			setTimeout(function() {
				$(".multiplier").remove();
			}, lifeTimeOther);
			generateMultiplier();
		}, generateRandomTime(spawnOtherMin, spawnOtherAdd));
	}

	function infoWindowCollision(a) {
		var vpWidth = $(window).width();
		var vpHeight = $(window).height();
		var infoWindow = $(".info-window")[0].getBoundingClientRect();
		var checkHorizontal = (a.style.left/100)*vpWidth < infoWindow.right+(imageSize);
		var checkVertical = (a.style.top/100)*vpHeight < infoWindow.bottom+(imageSize);
		if (checkHorizontal && checkVertical) { 
			return true; 
		}
		return false;
	}

	function translate(target, xRate, yRate) {
		var curr = $(target); 
		setInterval(function() {
			xCurr = parseFloat(curr[0].style.left);
			if (xCurr <= 10 || xCurr >= 90 || infoWindowCollision(curr[0])) {
				xRate *= -1;
			}
			xNew = ""+(xCurr+xRate)+"%";
			curr.css("left", xNew);
		}, 50);
		setInterval(function() {
			yCurr = parseFloat(curr[0].style.top);
			if (yCurr <= 10 || yCurr >= 90 || infoWindowCollision(curr[0])) {
				yRate *= -1;
			}
			yNew = ""+(yCurr+yRate)+"%";
			curr.css("top", yNew);
		}, 50);
	}
});