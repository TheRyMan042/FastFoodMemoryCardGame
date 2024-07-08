const gameContainer = document.getElementById("game"); //where the game is contained

//Directory to all the image files
const imgDirectory = 'FastFoodImages/'; /*Had to change filepath to work on GitHub; July 8, 2024*/
const backCard = 'BackOfRedPlayingCard.jpg';
const IMAGES = [
  'Burger-King_Logo.png',
  'Chick-fil-A_Logo.svg.png',
  'Dominos-logo.png',
  'dunkin-donuts-logo.jpg',
  'Jack-in-the-Box-Logo.png',
  'Kfc_logo.png',
  'Logo-chipotle.jpg',
  "McDonald's_logo.svg.png",
  'Panda-Express-Logo.png',
  'Pizza_Hut_classic_logo.svg.png',
  'sonic-logo.png',
  'starbucks-logo1.jpg',
  'Subway_2016_logo.svg.png',
  'Taco-Bell-Logo.png',
  'Wendys-Logo.webp'
];

//The variables
let cardCount = 0; //Keeps track of picked cards
const twoCardsOnly = 2; //A matched pair of cards
let card1sClass; //Saves first card user picks
let matchState = false; //Keeps state when user picks two cards
let totalCardMatches; //Tracks how many matching cards in the game
let score = 0; //Keeps a score of all players guesses
let hasGameStarted = false; //Loads the start menu
let greaterThanFour = true; //if user entered four or more cards
let gameEnded = false; //if the game is over (pressing enter button)
let inProgress = false; //makes sure not to restart during the game
const myScore = document.querySelector('.players-score');
const highScore = document.querySelector('.high-score');
const numberOfCards = document.createElement('input');
let roundCards; //rounding up odd numbers

//Creates a new form for the user to enter the amount of cards to play
function askForPlayingCards() {
  //makes a new form and adds it to the page
  const newForm = document.createElement('form');
  newForm.classList.add('cards-menu');
  document.body.appendChild(newForm);

  //creates the label and the input for the form
  const numofCardsText = document.createElement('label');
  numofCardsText.innerText = 'How many cards do you want to play with? (Min: 4 Cards; Even Numbers Only)';
  numofCardsText.setAttribute('for', 'number-cards');
  newForm.appendChild(numofCardsText);

  //input field for card count
  numberOfCards.id = 'number-cards';
  numberOfCards.type = 'number';
  numberOfCards.required = true;
  newForm.appendChild(numberOfCards);
  return newForm;
}


//Shuffles the random array of images
// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function pickRandomImages(userCardCount, array) {
  let counter = userCardCount;
  //two arrays for making a pair of cards
  const randomImagesArray = [];
  const addArray1 = [];

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * array.length);

    // Decrease counter by 1
    counter--;

    //push random image into two separate arrays
    randomImagesArray.push(array[index]);
    addArray1.push(array[index]);
  }
  //combines into one array for pair 
  const newRandomImagesArray = randomImagesArray.concat(addArray1);
  return newRandomImagesArray;
}

//Shuffles the randomly selected images
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}


//Creates the start up menu
retrieveHighscore();
const playerForm = askForPlayingCards();
const startButton = document.createElement('button');
startButton.classList.add('start-button');
startButton.innerText = 'Start Game';
startButton.addEventListener('click', startGame);
document.body.appendChild(startButton);
createClearHighScoreButton();

//Starts or Resets the game using the Enter button
document.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    //Makes sure to reload only when the game is done
    if (inProgress === false) {
      greaterThanFour = oddOrEvenNumberCards();
      //check if minimum card count is met
      if (!greaterThanFour) {
        return; //gets user to redo the card count
      }
      event.preventDefault();

      //Checks if the game has ended 
      if (gameEnded) {
        resettingGame(event);
      } else {
        startGame();
      }
    }
  }
});

//checks the number the user entered is either even, odd, or even a number
function oddOrEvenNumberCards() {
  const input = document.querySelector('#number-cards');
  roundCards = Math.floor(parseInt(numberOfCards.value)); //rounds up odd numbers and makes them an integer

  //checks if the minimum card count is met
  if (roundCards < 4 || numberOfCards.value === "") {
    alert('Enter a even number of cards that greater than or equal to 4.');
    input.value = ''; //removes value from card count
    return false;
  }
  //rounds the odd numbers
  if (roundCards % 2 === 1) {
    alert('Rounding up to next highest even number');
    numberOfCards.value++;
  }
  return true;
}

//Starts the memory game
function startGame() {
  const clearHighScoreButton = document.querySelector('.clear-highscore-button');

  //checks if the card count has been met
  greaterThanFour = oddOrEvenNumberCards();
  if (!greaterThanFour) {
    return;
  }

  //changes game states
  gameEnded = false;
  inProgress = true;

  let maxCards = roundCards / 2; //number of cards (no pairs)
  hasGameStarted = true;
  myScore.innerText = `Current Score \n ${score}`;
  //removes elements from start menu
  startButton.remove();
  clearHighScoreButton.remove();
  playerForm.remove();

  //begins to randomize the images and shuffles them
  let randomImages = pickRandomImages(maxCards, IMAGES);
  let shuffledImages = shuffle(randomImages);
  totalCardMatches = shuffledImages.length / twoCardsOnly; //get total amount of  matches from shuffled array
  createClickableImages(shuffledImages); //adds the shguffled images to the screen
}

// this function loops over the array of images
// it gives a class with the value of the image source
// it also adds an event listener for a click for each card
function createClickableImages(imageArray) {
  for (let image of imageArray) {
    //Create a new image element
    const newImage = document.createElement('img');

    // give it a class attributes for the value we are looping over
    newImage.classList.add(image); //image source
    newImage.classList.add('back'); //back of card
    newImage.src = imgDirectory + backCard; //loads the image source

    // call a function handleCardClick when a image is clicked on
    newImage.addEventListener("click", handleCardClick);

    // append the newImage to the element with an id of game
    gameContainer.append(newImage);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  // console.log("you just clicked", event.target);
  // console.log("class = ", event.target.className);

  //if true, it won't pick any more cards until its done checking for a match
  if (!matchState) {

    //Flip card to the picture
    event.target.classList.toggle('back');
    const imageSrc = event.target.className; //Saves img source to show
    if (event.target.classList.toggle('front')) {
      event.target.src = imgDirectory + imageSrc;
    }

    cardCount++; //Adds number of cards picked
    score++; //Adds to score
    myScore.innerText = `Current Score \n ${score}`; //Displays user score

    //Checks if player has pick two cards
    if (cardCount >= twoCardsOnly) {
      matchState = true; //check cards state
      checkForMatch(event, card1sClass);
      cardCount = 0;//Resets card count for next pair
      return;
    }
    card1sClass = event.target.className;
    event.target.classList.toggle('first-card');
  }
}

//checks the two cards to see if its a match or not
function checkForMatch(event, firstCard) {
  let Card1 = document.querySelector('.first-card');
  // console.log('First:', Card1);
  // console.log('Second:', event.target);

  //checks if the two cards match
  if (firstCard === event.target.className) {
    // console.log('Congrats, you found a match');
    Card1.classList.toggle('first-card'); //removes first card class
    matchState = false; //reset for new cards

    //Make matched cards not clickable
    Card1.removeEventListener('click', handleCardClick);
    event.target.removeEventListener('click', handleCardClick);
    isGameOver(); //check if game has ended
  } else {
    // console.log('Sorry, no match found');

    //Show the card for one second before flipping the card back
    setTimeout(function () {
      matchState = false; //reset for new cards

      //flip the card back over
      Card1.classList.toggle('front');
      Card1.classList.toggle('back');
      Card1.src = imgDirectory + backCard; //adds image source of back card
      Card1.classList.toggle('first-card'); //removes first card class

      //Second card
      event.target.classList.toggle('front');
      event.target.classList.toggle('back');
      event.target.src = imgDirectory + backCard;//adds image source of back card
    }, 1000);
  }
}

//checks if the all the cards have been matched
function isGameOver() {
  totalCardMatches--; //subtract total card amount when a match is found

  //if all cards are found, the game ends
  if (totalCardMatches === 0) {
    //Adds the "You Win" text
    const winnerText = document.createElement('p');
    winnerText.classList.add('end-of-game');
    winnerText.innerText = 'You win';

    //creates the play again button
    const playAgainButton = document.createElement('button');
    playAgainButton.innerText = 'Play Again';
    playAgainButton.classList.add('play-again-button');
    playAgainButton.addEventListener('click', resettingGame);

    //makes the card count form again
    document.body.appendChild(winnerText);
    askForPlayingCards();
    //playerForm.appendChild(playAgainButton);
    document.body.appendChild(playAgainButton);
    createClearHighScoreButton(); //makes a clear highscore button

    const myHighscore = localStorage.getItem('highScore');

    //Replace highscore if the score is lower
    if (score < myHighscore || myHighscore === null || myHighscore === '0') {
      localStorage.setItem('highScore', score);
    }

    //Change game states
    inProgress = false;
    gameEnded = true;
  }
}

//This resets the game 
function resettingGame(event) {
  const resetDiv = document.querySelector('#game');
  const againButton = document.querySelector('.play-again-button');
  const winText = document.querySelector('.end-of-game');
  const numCardsText = document.querySelector('.cards-menu');

  //checks if the card count has been met
  let greaterThanFour = oddOrEvenNumberCards();
  if (!greaterThanFour) {
    return;
  }

  //Clearing the cards from the game board
  resetDiv.innerHTML = '';
  //Clear buttons and other elements
  winText.remove();
  againButton.remove();
  numCardsText.remove();
  //Check score from localStorage
  score = 0; //reset score for next game
  //Clears the scores from the screen
  myScore.innerText = '';
  highScore.innerText = '';

  startGame(); //Starts another game
  retrieveHighscore(); //gets the highscore 
}

//gets the highscore and displays it onscreen 
function retrieveHighscore() {
  if (hasGameStarted === true) myScore.innerText = `Current Score \n ${score}`;
  //Show the highscore if it exists already
  if (localStorage.getItem('highScore') !== null) {
    highScore.innerText = `High Score \n ${localStorage.getItem('highScore')}`;
  } else {
    highScore.innerText = `High Score \n ${score}`;
  }
}

//creates a clear highscore button
function createClearHighScoreButton() {
  const clearHighScoreButton = document.createElement('button');
  clearHighScoreButton.innerText = 'Clear Highscore';
  clearHighScoreButton.classList.add('clear-highscore-button');
  clearHighScoreButton.addEventListener('click', function () {
    localStorage.setItem('highScore', 0); //resets the score to zero
    retrieveHighscore();
  });
  document.body.appendChild(clearHighScoreButton); //displays button onscreen
}

