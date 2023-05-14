import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
    typography: {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 16,
        allVariants: {
            color: 'white',
        },
        black: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 12,
            color: 'black',
        },
        h4: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 36,
            fontWeight: 'bold',
            color: 'black',
        },
        button: {
            textTransform: 'none',
            color: '#FFFFFF',
        },
        nameTag: {
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSize: 50,
            fontWeight: 'bold',
            color: 'black',
        }
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
