import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Footer } from './components';
import { privateRoutes, publicRoutes } from "./routes";


function PrivateRoute({ children }: { children: React.ReactElement }) {
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
    <BrowserRouter>
      <div className="w-full mx-auto min-h-screen flex flex-col max-w-full lg:max-w-6xl">
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
                <PrivateRoute>{route.element}</PrivateRoute>
              }
            />
          ))}
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
