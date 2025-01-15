import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { AuthProvider } from '@components/AuthProvider';
import NavBar from '@components/NavBar';

import { getRoutes } from '@libs/utils/helpers';

import { Error, ProtectedRoute } from './pages';

const App = () => {
  const routes = getRoutes();

  return (
    <AuthProvider>
      <Router>
        <NavBar title="NitFlex" />
        <div className="h-[calc(100dvh-4.25rem)]">
          <Routes>
            {routes.public.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.main />}
              />
            ))}
            {routes.private.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute>
                    <route.main />
                  </ProtectedRoute>
                }
              />
            ))}
            <Route path="/error" element={<Error status={503} message="You don't have permission to view." />} />
            <Route path="*" element={<Error status={404} message="Page not found." />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer
        toastClassName="has-corners"
        position="top-right"
      />
    </AuthProvider>
  );
};

export default App;