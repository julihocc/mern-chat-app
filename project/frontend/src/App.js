// path: frontend\src\App.js

import { BrowserRouter as Router } from "react-router-dom";
import MainRoutes from "./MainRoutes"; // Import MainRoutes
import useInitializeAuth from "./hooks/useInitializeAuth";
import { ApolloProvider } from "@apollo/client";
import { backendApolloClient } from "./apolloClient";

function App() {

  useInitializeAuth();

  return (
    <div className="App">
      <Router>
        <MainRoutes />
      </Router>
    </div>
  );
}

export default App;
