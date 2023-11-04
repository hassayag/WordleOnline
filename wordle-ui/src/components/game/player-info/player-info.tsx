import React from 'react'
import { PlayerState } from "../types"
import OppponentBoard from '../board/opponent-board';
import { Board } from '../board/board';

interface Props {
    playerState: PlayerState; 
    isOpponent: boolean;
}

const PlayerInfo = ({playerState, isOpponent}: Props) => {
    const board = isOpponent ? <OppponentBoard playerState={playerState}/> : <Board playerState={playerState}/>

    return (<>
        {board}
        </>
    )
}

export {PlayerInfo}
