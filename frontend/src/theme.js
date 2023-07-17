// frontend\src\theme.js

// import { createTheme } from '@mui/material/styles';
//
// const theme = createTheme();
//
// export default theme;

// frontend\src\theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3f51b5', // Your primary color
        },
        secondary: {
            main: '#f50057', // Your secondary color
        },
        error: {
            main: '#f44336', // Your error color
        },
        background: {
            default: '#f5f5f5', // Your background color
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif', // Your font family
        fontSize: 14, // Your base font size
        button: {
            textTransform: 'none' // This can make your buttons use normal casing rather than uppercase
        }
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default theme;
