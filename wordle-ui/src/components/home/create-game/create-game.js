import React, { useState } from 'react';
import './create-game.css';
import { GameService } from 'services/game-service'


const CreateGame = () => {
    const [name, setName] = useState('');

    const _initGame = () => {
        console.log(`creating game for ${name}`)
    }
    
    const _handleInput = (event) => {
        setName(event.target.value);
    }

    return (
        <div class='container'>
            <label id='name-input'>
                Enter Name:
                <input type='text' onChange={_handleInput}/>

            </label>
            <button id='body' onClick={() => _initGame()}>
                Create game
            </button>
        </div>
    )
}

export default CreateGame;