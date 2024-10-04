import React, { useState } from 'react';
import './App.css'; // Assuming you have some CSS for styling

// Sample clues and answers
const clues = [
  "What year was Google founded? (Use Google Search)",
  "What is Google's parent company called? (click on the logo).",
  "Solve the puzzle to reveal the clue!",
];

const answers = [
  "1998", // Correct answer for the first clue
];

// Sample images for the second clue
const alphabetLogo = '/alphabet_logo.png'; // Add the correct path to your logo
const googleLogo = '/google_logo.png'; // Add the correct path to your logo
const youtubeLogo = '/youtube_logo.png'; // Add the correct path to your logo

// Function to create puzzle pieces
const createPuzzlePieces = () => {
  const rows = 4; // 3 rows
  const columns = 4; // 3 columns
  const pieces = [];

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < columns; j++) {
      pieces.push({
        src: require(`./images/piece_row${i}_column${j}.png`), // Dynamic import for image
        position: i * columns + j, // Calculate position based on row and column
        rotation: Math.floor(Math.random() * 4) * 90, // Random initial rotation (0, 90, 180, or 270 degrees)
      });
    }
  }

  return pieces;
};

// Puzzle component
const Puzzle = ({ onPuzzleComplete }) => {
  const pieceSize = 100; // Size of each puzzle piece
  const [pieces, setPieces] = useState(() => createPuzzlePieces()); // 3x3 grid of pieces
  const [feedback, setFeedback] = useState('');
  const [checkButtonVisible, setCheckButtonVisible] = useState(false); // Control visibility of check button

  const handleRotate = (index) => {
    const newPieces = [...pieces];
    newPieces[index].rotation = (newPieces[index].rotation + 90) % 360; // Rotate the piece
    setPieces(newPieces);
    setCheckButtonVisible(true); // Show check button after rotation
  };

  const checkPuzzleCompletion = () => {
    // Check if all pieces are in their correct position and orientation
    const isCompleted = pieces.every((piece, index) => {
      const correctRotation = 0; // All pieces should be in 0 rotation
      const correctPosition = index; // Each piece's position should match its index
      return piece.position === correctPosition && piece.rotation === correctRotation;
    });

    if (isCompleted) {
      onPuzzleComplete(); // Trigger completion function
      setFeedback('Congratulations! You have solved the puzzle!'); // Feedback for solving
    } else {
      setFeedback("Try again!"); // Feedback for incorrect completion
    }
  };

  return (
    <div className="puzzle-container">
      {pieces.map((piece, index) => (
        <div
          key={index}
          className="puzzle-piece"
          style={{
            backgroundImage: `url(${piece.src})`,
            transform: `rotate(${piece.rotation}deg)`,
            width: `${pieceSize}px`,
            height: `${pieceSize}px`,
            left: `${(index % 3) * pieceSize}px`, // Calculate X position in a 3x3 grid
            top: `${Math.floor(index / 3) * pieceSize}px`, // Calculate Y position in a 3x3 grid
          }}
          onClick={() => handleRotate(index)}
        />
      ))}
      {checkButtonVisible && <button onClick={checkPuzzleCompletion}>Check Puzzle</button>}
      <p>{feedback}</p>
    </div>
  );
};

function App() {
  const [currentClue, setCurrentClue] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false); // State for next button visibility

  const handleAnswerSubmit = () => {
    if (userAnswer.trim().toLowerCase() === answers[currentClue].toLowerCase()) {
      setFeedback('Correct!');
      setShowNextButton(true); // Show next button
    } else {
      setFeedback('Incorrect, try again!'); // Show 'Try again' if incorrect
      setShowNextButton(false); // Hide next button on incorrect answer
    }
  };

  const handleImageClick = (isCorrect) => {
    if (isCorrect) {
      setFeedback('Correct!');
      setShowNextButton(true); // Show next button
    } else {
      setFeedback('Incorrect choice! Try again.'); // Show 'Try again' on incorrect choice
      setShowNextButton(false); // Hide next button on incorrect choice
    }
  };

  const handlePuzzleComplete = () => {
    setFeedback('Congratulations! You have solved the puzzle!'); // Feedback message for solving puzzle
    setShowNextButton(true); // Show next button after solving the puzzle
  };

  const handleNextQuestion = () => {
    setShowNextButton(false); // Hide next button after moving to next clue
    setUserAnswer(''); // Reset user answer
    setFeedback(''); // Reset feedback

    if (currentClue < clues.length - 1) {
      setCurrentClue(currentClue + 1);
    } else {
      setIsCompleted(true); // Mark game as completed if all clues are done
    }
  };

  return (
    <div className="game-container">
      <h1>GDG ON Campus Treasure Hunt</h1>

      {/* Show the congratulatory message if the game is completed */}
      {isCompleted ? (
        <div className="congratulations-message">
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You have successfully completed the GDG on campus Treasure Hunt!</p>
        </div>
      ) : (
        <>
          {/* First Question */}
          {currentClue === 0 && (
            <>
              <p>{`Clue 1: ${clues[currentClue]}`}</p>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
              />
              <button onClick={handleAnswerSubmit}>Submit Answer</button>
              <p>{feedback}</p> {/* Feedback for incorrect answer */}
              {showNextButton && (
                <button onClick={handleNextQuestion}>Next Question</button> 
              )}
            </>
          )}

          {/* Second Question with Images */}
          {currentClue === 1 && (
            <>
              <p>{`Clue 2: ${clues[currentClue]}`}</p>
              <div className="image-options">
                <h3>Choose the correct image:</h3>
                <div className="image-container">
                  <img
                    src={alphabetLogo}
                    alt="Alphabet logo"
                    onClick={() => handleImageClick(true)} // Correct choice
                    className="logo-image"
                  />
                  <img
                    src={googleLogo}
                    alt="Google logo"
                    onClick={() => handleImageClick(false)} // Incorrect choice
                    className="logo-image"
                  />
                  <img
                    src={youtubeLogo}
                    alt="YouTube logo"
                    onClick={() => handleImageClick(false)} // Incorrect choice
                    className="logo-image"
                  />
                </div>
              </div>
              <p>{feedback}</p> {/* Feedback for incorrect choice */}
              {showNextButton && (
                <button onClick={handleNextQuestion}>Next Question</button> 
              )}
            </>
          )}

          {/* Puzzle Section for the Last Clue */}
          {currentClue === 2 && (
            <>
              <p>{`Clue 3: ${clues[currentClue]}`}</p>
              <Puzzle onPuzzleComplete={handlePuzzleComplete} />
              <p>{feedback}</p> {/* Feedback for solving the puzzle */}
              {showNextButton && (
                <button onClick={handleNextQuestion}>Next Question</button> 
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
