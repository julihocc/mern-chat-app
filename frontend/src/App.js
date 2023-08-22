// path: frontend\src\App.js

// Importing required dependencies, including React Router, Redux Provider, AuthProvider, and the MainRoutes component
import {BrowserRouter as Router} from 'react-router-dom';
import AuthProvider from "./AuthProvider";
import MainRoutes from "./MainRoutes"; // Import MainRoutes
import {Provider} from 'react-redux';
import store from './redux/store'; // Importing the Redux store

// Define the App component
function App() {
    return (// Div with className "App" to wrap the entire application
        <div className="App">
            <Provider store={store}>
                <AuthProvider>
                    <Router>
                        <MainRoutes/>
                    </Router>
                </AuthProvider>
            </Provider>
        </div>);
}

// Exporting the App component to be used elsewhere in the application
export default App;
