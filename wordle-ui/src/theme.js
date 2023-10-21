import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
    typography: {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 16,
        allVariants: {
            color: '#555555',
        },
        body2: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 14,
            color: '#404040',
        },
        h4: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 36,
            fontWeight: 'bold',
            color: '404040',
        },
        button: {
            textTransform: 'none',
            color: '#FFFFFF',
        },
    },
    palette: {
        primary: {
            main: '#6aaa64;',
        },
        secondary: {
            main: '#c9b458',
        },
        error: {
            main: red.A400,
        },
    },
});

export default theme;
