import React from 'react';
import { PlayerState } from '../types';
import { Board } from '../board/board';
import { Box, Paper, Typography } from '@mui/material';

interface Props {
    playerState: PlayerState;
    isOpponent: boolean;
}

const PlayerBoard = ({ playerState, isOpponent }: Props) => {
    const shadowColor = isOpponent ? '000000' : '#779f74';
    return (
        <Paper
            elevation={isOpponent ? 4: 10}
            sx={{   
                border: isOpponent ? `none` : `3px solid ${shadowColor}a0;`,
                boxShadow: `0px 6px 6px -3px ${shadowColor}33,0px 10px 14px 1px ${shadowColor}4e,0px 4px 18px 3px ${shadowColor}4e;`,
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
