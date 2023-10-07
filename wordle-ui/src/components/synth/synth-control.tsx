import React from 'react';
import {Slider, Box} from '@mui/material'
import {useState} from 'react'

import synthService from '../../services/synth-service'

const SynthControl = () => {
    const [attack, setAttack] = useState<number>(0);
    const [decay, setDecay] = useState<number>(0);
    const [sustain, setSustain] = useState<number>(0);
    const [release, setRelease] = useState<number>(0);

    const handleChange = (setX: React.Dispatch<any>) => (event: number, newVal: number) => {
        setX(newVal.toFixed(4));
        synthService.setEnvelope({attack, decay, sustain, release})
    }

    const slider = (x: number, setX: React.Dispatch<any>) => {
        return <Slider valueLabelDisplay="auto" defaultValue={0} min={0} max={1} value={x} step={0.000001} onChange={handleChange(setX) as any} />     
    }

    return (
        <Box sx={{
            width: 500,
            height: 500,
            marginTop: 8,
            display: 'flex',
            gap: '8px',
            flexDirection: 'column',
            alignItems: 'center',
        }}>       
              {slider(attack, setAttack)}
              {slider(decay, setDecay)}
              {slider(release, setRelease)}
              {slider(sustain, setSustain)}
        </Box>
    )
}

export default SynthControl;