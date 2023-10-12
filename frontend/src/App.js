// path: frontend\src\App.js

// Importing required dependencies, including React Router, Redux Provider, AuthProvider, and the MainRoutes component
import { BrowserRouter as Router } from "react-router-dom";
import MainRoutes from "./MainRoutes"; // Import MainRoutes
import useInitializeAuth from "./hooks/useInitializeAuth";

// Define the App component
function App() {
  useInitializeAuth(); // Calling the useInitializeAuth hook

  return (
    // Div with className "App" to wrap the entire application
    <div className="App">
      <Router>
        <MainRoutes />
      </Router>
    </div>
  );
}

// Exporting the App component to be used elsewhere in the application
export default App;
