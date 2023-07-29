// path: frontend\src\App.js
import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from "./AuthProvider";
import MainRoutes from "./MainRoutes";  // Import MainRoutes

function App() {
    return (
        <div className="App">
            <AuthProvider>
                <Router>
                    <MainRoutes />
                </Router>
            </AuthProvider>
        </div>
    );
}

export default App;
