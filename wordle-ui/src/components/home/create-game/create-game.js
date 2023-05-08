import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './create-game.css';
import { GameService } from 'services/game-service';

const CreateGame = ({ setGameIds }) => {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [gameId, setGameId] = useState('');

    const _initGame = () => {
        GameService.createGame(name)
            .then((response) => setGameId(response.uuid))
            .catch((err) => console.error(err));
    };

    const _handleInput = (event) => {
        setName(event.target.value);
    };

    if (gameId) {
        // update game ids so Home component can rerender with the new game route
        setGameIds((ids) => [ids, gameId]);

        navigate(`/game/${gameId}`);
    }

    return (
        <div class="container">
            <label id="name-input">
                Enter Name:
                <input type="text" onChange={_handleInput} />
            </label>
            <button id="body" onClick={() => _initGame()}>
                Create game
            </button>
        </div>
    );
};

export default CreateGame;
