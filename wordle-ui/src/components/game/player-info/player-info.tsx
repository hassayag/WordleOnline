import React from 'react';
import { PlayerState } from '../types';
import { Board } from '../board/board';
import { Box, Container, Paper, Typography } from '@mui/material';

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
                    marginTop: 8,
                    display: 'flex',
                    gap: '8px',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Board playerState={playerState} hideLetters={isOpponent} />
            </Box>
        </Paper>
    );
};

export { PlayerBoard };
