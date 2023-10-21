import React from 'react';
import './game-end-modal.css';

const GameEndModal = ({
    isWon,
    goalWord,
    closeModal,
}: {
    isWon: boolean;
    goalWord: string;
    closeModal: () => void;
}) => {
    return (
        <>
            <div className="modal">
                <div className="body">
                    {isWon
                        ? 'You have won!'
                        : `You have lost :(\n\n The word was "${goalWord}"`}
                </div>
                <button className="button" onClick={() => closeModal()}>
                    Close
                </button>
            </div>
        </>
    );
};

export default GameEndModal;
