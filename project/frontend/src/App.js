// path: frontend\src\App.js

import {BrowserRouter as Router} from "react-router-dom";
import MainRoutes from "./MainRoutes";
import useInitializeAuth from "./hooks/useInitializeAuth";

function App() {

	useInitializeAuth();

	return (<div className="App">
			<Router>
				<MainRoutes/>
			</Router>
		</div>);
}

export default App;
