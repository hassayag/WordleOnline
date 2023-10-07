import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import './game-end-modal.css';
const GameEndModal = (props) => {
    const { isWon, goalWord, closeModal } = props;
    return (_jsx(_Fragment, { children: _jsxs("div", { className: "modal", children: [_jsx("div", { className: "body", children: isWon
                        ? 'You have won!'
                        : `You have lost :(\n\n The word was "${goalWord}"` }), _jsx("button", { className: "button", onClick: () => closeModal(), children: "Close" })] }) }));
};
export default GameEndModal;
//# sourceMappingURL=game-end-modal.js.map