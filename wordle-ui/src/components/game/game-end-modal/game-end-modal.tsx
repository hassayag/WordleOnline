import React from 'react';
import './game-end-modal.css';

const GameEndModal = (props) => {
    const { isWon, goalWord, closeModal } = props;

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
