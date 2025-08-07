import type { JSX } from 'react';
import { useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Footer, Header } from './components';
import { privateRoutes, publicRoutes } from "./routes";
import { getAuth, onAuthStateChanged } from "firebase/auth";


function PrivateRoute({ children }: { children: JSX.Element }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Rotas públicas */}
          {publicRoutes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}

          {/* Rotas privadas */}
          {privateRoutes.map(route => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <>
                  <Header />
                  <PrivateRoute>{route.element}</PrivateRoute>
                </>
              }
            />
          ))}
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
