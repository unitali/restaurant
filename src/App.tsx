import type { JSX } from 'react';
import { useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes";


const useAuth = () => {
  // Troque por sua lógica real de autenticação
  const [isAuthenticated] = useState(false);
  return { isAuthenticated };
};

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}




function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        {publicRoutes.map(route => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Rotas privadas */}
        {privateRoutes.map(route => (
          <Route key={route.path} path={route.path} element={<PrivateRoute>{route.element}</PrivateRoute>} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
