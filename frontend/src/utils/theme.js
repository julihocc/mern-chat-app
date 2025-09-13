// frontend\src\theme.js
import {createTheme} from "@mui/material/styles";

const theme = createTheme({
	palette: {
		mode: "light", primary: {
			main: "#075E54",
		}, secondary: {
			main: "#128C7E",
		}, error: {
			main: "#d80000",
		}, background: {
			default: "#ECE5DD",
		},
	}, typography: {
		fontFamily: '"Helvetica Neue", Arial, sans-serif', fontSize: 14, button: {
			textTransform: "none",
		},
	}, breakpoints: {
		values: {
			xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536,
		},
	},
});

export default theme;
