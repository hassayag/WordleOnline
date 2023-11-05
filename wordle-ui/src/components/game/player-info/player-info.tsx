import React from 'react'
import { PlayerState } from "../types"
import { Board } from '../board/board';

interface Props {
    playerState: PlayerState; 
    isOpponent: boolean;
}

const PlayerInfo = ({playerState, isOpponent}: Props) => {
    return (
        <Board playerState={playerState} hideLetters={isOpponent}/>
    )
}

export {PlayerInfo}
