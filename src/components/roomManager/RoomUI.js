import React from 'react';

export const PlayerList = ({ players }) => (
  <ul>
    {players.map((player, index) => (
      <li key={index}>
        {player.username} ({player.role})
      </li>
    ))}
  </ul>
  );