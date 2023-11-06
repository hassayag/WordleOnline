import React from 'react';
import { PlayerState } from '../types';
import { Board } from '../board/board';
import { Box, Paper, Typography } from '@mui/material';

interface Props {
    playerState: PlayerState;
    isOpponent: boolean;
}

const PlayerBoard = ({ playerState, isOpponent }: Props) => {
    return (
        <Paper
            elevation={10}
            sx={{
                paddingTop: 2,
                paddingBottom: 5,
                paddingLeft: 5,
                paddingRight: 5,
                margin: 10,
                marginBottom: 1,
                marginTop: 5,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                <Typography>{playerState.player.name}</Typography>
                <Typography>{12345}</Typography>
            </Box>
            <Box
                sx={{
                    marginTop: 2,
                    display: 'flex',
                    gap: '8px',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Board playerState={playerState} isOpponent={isOpponent} hideLetters={isOpponent} />
            </Box>
        </Paper>
    );
};

export { PlayerBoard };
