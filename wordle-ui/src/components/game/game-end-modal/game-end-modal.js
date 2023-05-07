import './game-end-modal.css';

const GameEndModal = (props) => {
    const { isWon, goalWord, closeModal } = props;

    return (
        <>
            <div class="modal">
                <div class="body">
                    {isWon
                        ? 'You have won!'
                        : `You have lost :(\n\n The word was "${goalWord}"`}
                </div>
                <button class="button" onClick={() => closeModal()}>
                    Close
                </button>
            </div>
        </>
    );
};

export default GameEndModal;
