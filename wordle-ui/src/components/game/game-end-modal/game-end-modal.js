import Button from '@mui/material/Button';
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
                
                <Button variant="contained" onClick={() => closeModal()}>
                    Close
                </Button>
            </div>
        </>
    );
};

export default GameEndModal;
