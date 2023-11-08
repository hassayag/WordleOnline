import React from 'react';
import './game-end-modal.css';
import { Modal, Box, Typography, Button } from '@mui/material';

const GameEndModal = ({
    isWon,
    isOpen,
    goalWord,
    closeModal,
    restartGame
}: {
    isWon: boolean;
    isOpen: boolean;
    goalWord: string;
    closeModal: () => void;
    restartGame: () => void
}) => {
    return (
        <Modal
            open={isOpen}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'gray',
                    border: '2px',
                    boxShadow: 24,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    outline: 0,
                }}
            >
                <Typography id="modal-modal-title">
                    {isWon
                        ? 'You have won!'
                        : `You have lost :(      The word was "${goalWord}"`}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {/* Play again? */}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2,
                    }}
                >
                    <Button
                        sx={{
                            position: 'absolute',
                            bottom: 4,
                            left: 4,
                        }}
                        variant="contained"
                        color="secondary"
                        onClick={closeModal}
                    >
                        Close
                    </Button>
                    <Button
                        sx={{
                            position: 'absolute',
                            bottom: 4,
                            right: 4,
                        }}
                        variant="contained"
                        color="primary"
                        onClick={restartGame}
                    >
                        Play Again
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default GameEndModal;
