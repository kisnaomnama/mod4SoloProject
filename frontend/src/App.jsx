import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignupFormPage';
import Navigation from './components/Navigation/Navigation-bonus';
import * as sessionActions from './store/session';
import { Modal } from './context/Modal';

import LandingPage from './components/LandingPage';
import SpotDetailsPage from './components/SpotDetailsPage';
import CreateSpot from './components/CreateSpot';
import ManageSpots from './components/ManageSpots';
import UpdateSpot from './components/UpdateSpot';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Modal/>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '*',
        element: <h2>Page Not Found</h2>
      },
      {
        path: '/',
        element: <LandingPage />
      },
      {
        element: <SpotDetailsPage />,
        path: 'spots/:spotId'
      },
      {
        element: <CreateSpot />,
        path: 'spots/new'
      },
      {
        element: <ManageSpots />,
        path: 'spots/current'
      },
      {
        element: <UpdateSpot />,
        path: 'spots/:spotId/edit'
      }
    ]
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
