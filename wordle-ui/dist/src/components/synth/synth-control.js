import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Slider, Box } from '@mui/material';
import { useState } from 'react';
import synthService from '../../services/synth-service';
const SynthControl = () => {
    const [attack, setAttack] = useState(0);
    const [decay, setDecay] = useState(0);
    const [sustain, setSustain] = useState(0);
    const [release, setRelease] = useState(0);
    const handleChange = (setX) => (event, newVal) => {
        setX(newVal.toFixed(4));
        synthService.setEnvelope({ attack, decay, sustain, release });
    };
    const slider = (x, setX) => {
        return _jsx(Slider, { valueLabelDisplay: "auto", defaultValue: 0, min: 0, max: 1, value: x, step: 0.000001, onChange: handleChange(setX) });
    };
    return (_jsxs(Box, { sx: {
            width: 500,
            height: 500,
            marginTop: 8,
            display: 'flex',
            gap: '8px',
            flexDirection: 'column',
            alignItems: 'center',
        }, children: [slider(attack, setAttack), slider(decay, setDecay), slider(release, setRelease), slider(sustain, setSustain)] }));
};
export default SynthControl;
//# sourceMappingURL=synth-control.js.map