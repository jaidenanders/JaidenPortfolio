let targetWords = [];
let validWords = [];
let targetWord = "";

// Clear wins, losses, and win streak counters on page load
localStorage.clear(); // Clear all local storage data

// Initialize stats from local storage, defaulting to 0 after clearing
let wins = 0;
let losses = 0;
let winStreak = 0;

// Display initial scoreboard values
document.getElementById("wins").textContent = wins;
document.getElementById("losses").textContent = losses;
document.getElementById("winstreak").textContent = winStreak;


async function loadWordLists() {
    const targetResponse = await fetch("target-words.txt");
    const targetText = await targetResponse.text();
    targetWords = targetText.split("\n").map(word => word.trim().toLowerCase());
  
    const validResponse = await fetch("valid-words.txt");
    const validText = await validResponse.text();
    validWords = validText.split("\n").map(word => word.trim().toLowerCase());
  
    resetGame()
}

function resetGame() {
    targetWord = targetWords[Math.floor(Math.random() * targetWords.length)];
    currentGuess = "";
    currentRow = 0;
    currentLetterIndex = 0;
  
    for (let i = 0; i < 30; i++) {
      const cell = grid.children[i];
      cell.textContent = "";
      cell.className = "cell";
    }
  
    message.textContent = "";
    playAgainButton.style.display = "none"; // Hide play-again button for new game
    submitButton.disabled = false; // Re-enable submit button
    document.addEventListener("keydown", handleKeyInput); // Re-enable typing for new game
    console.log("Game has been reset. New target word:", targetWord); // Debugging
  }
  
  loadWordLists();
  
  let currentGuess = "";
  let currentRow = 0;
  let currentLetterIndex = 0;
  
  const grid = document.getElementById("wordle-grid");
  const message = document.getElementById("message");
  const submitButton = document.getElementById("submit-guess");
  const playAgainButton = document.getElementById("play-again");
  
  // Initialize the grid with empty divs
  for (let i = 0; i < 30; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
  }
  
  // Function to handle keyboard input for direct typing into the grid
  function handleKeyInput(event) {
    const key = event.key.toLowerCase();
    const rowStartIndex = currentRow * 5;
    
    if (/^[a-z]$/.test(key) && currentLetterIndex < 5) {
      // Enter letter in current cell
      grid.children[rowStartIndex + currentLetterIndex].textContent = key.toUpperCase();
      currentGuess += key;
      currentLetterIndex++;
    } else if (key === "backspace" && currentLetterIndex > 0) {
      // Handle backspace
      currentLetterIndex--;
      currentGuess = currentGuess.slice(0, -1);
      grid.children[rowStartIndex + currentLetterIndex].textContent = "";
    } else if (key === "enter" && currentLetterIndex === 5) {
      // Submit guess if row is complete
      submitGuess();
    }
  }
  
  // Function to handle guess submission
  function submitGuess() {
    if (currentGuess.length !== 5) return; // Ensure guess is complete
  
    // Check if the guessed word is valid
    if (!targetWords.includes(currentGuess) && !validWords.includes(currentGuess)) {
      displayMessage("Invalid word. Please try another word.", "shake");
      return;
    }
  
    // Temporarily disable input to avoid rapid submissions
    document.removeEventListener("keydown", handleKeyInput);
    submitButton.disabled = true; // Disable the submit button after a valid guess submission
  
    if (currentRow < 6) {
      checkGuess();
    }
  }
  
  // Check the guess and update the grid with colors for feedback
  function checkGuess() {
    const rowStartIndex = currentRow * 5;
    let delay = 0;
  
    const guessStatus = Array(5).fill("");
    const targetLetterCounts = {};
  
    for (const letter of targetWord) {
      targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
    }
  
    for (let i = 0; i < 5; i++) {
      const guessLetter = currentGuess[i];
      if (guessLetter === targetWord[i]) {
        guessStatus[i] = "correct";
        targetLetterCounts[guessLetter] -= 1;
      }
    }
  
    for (let i = 0; i < 5; i++) {
      const guessLetter = currentGuess[i];
      if (guessStatus[i] === "" && targetLetterCounts[guessLetter] > 0) {
        guessStatus[i] = "present";
        targetLetterCounts[guessLetter] -= 1;
      } else if (guessStatus[i] === "") {
        guessStatus[i] = "absent";
      }
    }
  
    for (let i = 0; i < 5; i++) {
      const cell = grid.children[rowStartIndex + i];
      const letter = currentGuess[i].toUpperCase();
  
      setTimeout(() => {
        cell.textContent = letter;
        cell.classList.add(guessStatus[i]);
      }, delay);
      delay += 300;
    }
  
    setTimeout(() => {
      if (currentGuess === targetWord) {
        updateStats("win");
        displayWinAnimation(rowStartIndex);
        displayMessage("Congratulations! You've guessed the word!", "fade-in");
        endGame(true);  // End game immediately on win, passing true as the argument
      } else if (currentRow === 5) { // Ends the game after the sixth row if incorrect
        updateStats("loss");
        displayMessage(`Game Over! The word was ${targetWord.toUpperCase()}.`, "fade-in");
        endGame(false);  // End game on sixth incorrect guess, passing false as the argument
      } else {
        currentRow++;
        currentLetterIndex = 0;
        currentGuess = "";
        document.addEventListener("keydown", handleKeyInput); // Re-enable typing
        submitButton.disabled = false; // Re-enable the submit button
      }
    }, delay + 300);
  }
  
  // End the game and show the play-again button
  function endGame(isWin) {
    playAgainButton.style.display = "block"; // Show play-again button
    submitButton.disabled = true; // Disable the submit button to prevent additional submissions
    document.removeEventListener("keydown", handleKeyInput); // Disable typing after game ends
    console.log("Game has ended. Play Again button is now visible."); // Debugging
  
    // Log for checking whether the game ended due to a win or loss
    console.log(isWin ? "The game ended with a win." : "The game ended with a loss.");
  }
  
  // Display message with animation
  function displayMessage(text, animationClass) {
    message.textContent = text;
    message.classList.remove("fade-in", "shake");
    void message.offsetWidth;
    message.classList.add(animationClass);
  }
  // Function to animate the winning row with a bounce effect
function displayWinAnimation(rowStartIndex) {
    for (let i = 0; i < 5; i++) {
      const cell = grid.children[rowStartIndex + i];
      cell.classList.add("bounce"); // Add a bounce animation class to each cell
  
      // Remove the animation class after it's done to reset
      setTimeout(() => {
        cell.classList.remove("bounce");
      }, 1000);
    }
  }
  // Update stats in local storage and on the scoreboard
  function updateStats(result) {
    if (result === "win") {
      wins++;
      winStreak++;
    } else {
      losses++;
      winStreak = 0;
    }
  
    localStorage.setItem("wins", wins);
    localStorage.setItem("losses", losses);
    localStorage.setItem("winStreak", winStreak);
  
    document.getElementById("wins").textContent = wins;
    document.getElementById("losses").textContent = losses;
    document.getElementById("winstreak").textContent = winStreak;
  }
  
  // Event listeners for submit and play-again buttons
  submitButton.addEventListener("click", () => {
    if (currentLetterIndex === 5) {
      submitGuess();
    }
  });
  
  playAgainButton.addEventListener("click", resetGame);