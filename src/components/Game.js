import React, { useState, useEffect } from 'react';
import { usePlayers } from './roomManager'; // Assuming you are using usePlayers hook
import { cardsData } from './gameManager'; // Import your card data
import '../styles/Game.css'; // General game styling
import '../styles/Card.css'; // Card-specific styling

const GameCard = ({ imageSrc, title, description }) => {
  return (
    <div className="game-card">
      {/* <img src={imageSrc} alt={title} className="card-image" /> */}
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
};

const Game = ({ roomCode, hostName, currentUser }) => {
  const { players, loading } = usePlayers(roomCode);
  const [drawnCards, setDrawnCards] = useState([]); // State to hold drawn cards

  useEffect(() => {
    if (!loading) {
      // Initialize game state based on players and initial conditions
    }
  }, [loading, players]);

  const handlePlayerAction = (action) => {
    if (action === 'draw') {
      // Randomly pick a card to draw (or handle draw logic differently)
      const randomIndex = Math.floor(Math.random() * cardsData.length);
      const newCard = cardsData[randomIndex];

      // Add the new card to the drawnCards state
      setDrawnCards((prevCards) => [...prevCards, newCard]);
    }
  };

  return (
    <div className="game-board">
      <h2>Game in Progress</h2>
      {loading ? (
        <p>Loading game...</p>
      ) : (
        <div>
          <button onClick={() => handlePlayerAction('draw')}>Draw Card</button>

          {/* Render drawn cards */}
          <div className="card-container">
            {drawnCards.map((card, index) => (
              <GameCard
                key={index}
                imageSrc={card.imageSrc}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
