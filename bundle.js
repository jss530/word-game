(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  const WORD_API_URL = 'http://app.linkedin-reach.io/words';
  const maxTries = 6;
  let guessedLetters = [];
  let guessingWord = [];
  let currentWordIndex;
  let remainingGuesses = 0;
  let gameStarted = false;
  let hasFinished = false;
  let wins = 0;

  //need to call the API and store it in a variable, call variable throughout functions.

  function get(url) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();
      req.open('GET ALL', url);

      req.onload = function() {
        if (req.status == 200) {
          resolve(req.response);
        }
        else {
          reject(Error(req.statusText));
        }
      };
      req.onerror = function() {
        reject(Error("Network Error"));
      };
      req.send();
    });
  }

  function getWord() {
    get(WORD_API_URL)
    .then(function(response) {

      console.log(response);
    }, function(error) {
      console.error("Failed!", error);
    })
  }

  function resetGame() {
    //note - may need to update this later if you want to clear out more things to reset the game
      remainingGuesses = maxTries;
      gameStarted = false;

      guessedLetters = [];
      guessingWord = [];

      document.getElementById("hangman-image").src = "";

      document.getElementById("you-lose").style.display = "none";
      document.getElementById("you-win").style.display = "none";

      updateDisplay();
  };

  function updateDisplay() {

      document.getElementById("total-wins").innerText = wins;
      document.getElementById("current-word").innerText = "";

      for (var i = 0; i < guessingWord.length; i++) {
          document.getElementById("current-word").innerText += guessingWord[i];
      }

      document.getElementById("guesses-remaining").innerText = remainingGuesses;
      document.getElementById("wrong-guesses").innerText = guessedLetters;

      if(remainingGuesses <= 0) {
          document.getElementById("you-lose").style.cssText = "display: block";
          hasFinished = true;
      }
  };

  function updateImage() {
      document.getElementById("hangman-image").src = "/img/sad-dog-" + (maxTries - remainingGuesses) + ".jpg";
  };

  document.onkeydown = function(event) {
      if(hasFinished) {
          resetGame();
          hasFinished = false;
      } else {
          if(event.keyCode >= 65 && event.keyCode <= 90) {
              makeGuess(event.key.toLowerCase());
          }
      }
  };

  function makeGuess(letter) {
      if (remainingGuesses > 0) {
          if (!gameStarted) {
              gameStarted = true;
          }

          if (guessedLetters.indexOf(letter) === -1) {
              guessedLetters.push(letter);
              evaluateGuess(letter);
          }
      }

      updateDisplay();
      checkWin();
  };

  function evaluateGuess(letter) {
      var positions = [];

      // Loop through word finding all instances of guessed letter, store the indicies in an array.
      for (var i = 0; i < selectableWords[currentWordIndex].length; i++) {
          if(selectableWords[currentWordIndex][i] === letter) {
              positions.push(i);
          }
      }

      if (positions.length <= 0) {
          remainingGuesses--;
          updateImage();
      } else {
          for(var i = 0; i < positions.length; i++) {
              guessingWord[positions[i]] = letter;
          }
      }
  };

  function checkWin() {
      if(guessingWord.indexOf("_") === -1) {
          document.getElementById("you-win").style.cssText = "display: block";
          document.getElementById("play-again").style.cssText= "display: block";
          wins++;
          hasFinished = true;
      }
  };


},{}]},{},[1]);
