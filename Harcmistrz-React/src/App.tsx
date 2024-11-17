import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './components/Auth/Login';
import MainPage from './components/Pages/MainPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Pages/Dashboard';
import Register from './components/Auth/Register';
import Logout from './components/Auth/Logout';
import CreateNewTeam from './components/Team/CreateNewTeam'
import AddScoutToTeam from './components/Team/AddScoutToTeam';
import CreateNevEvent from './components/Events/CreateNewEvent'
import { ApiProvider } from './ApiContext';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainPage />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: 'logout',
      element: <Logout />
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: '/create-new-team',
      element: (
        <ProtectedRoute>
          <CreateNewTeam />
        </ProtectedRoute>
      )
    },
    {
      path: '/join-team',
      element: (
        <ProtectedRoute>
          <AddScoutToTeam />
        </ProtectedRoute>
      )
    },
    {
      path: 'create-new-event',
      element: (
        <ProtectedRoute>
          <CreateNevEvent />
        </ProtectedRoute>
      )
    },
  ]);

  return (
    <div className='app font-poppins'>
      <ApiProvider baseUrl='http://localhost:8080/api/v1'>
        <RouterProvider router={router} />
      </ApiProvider>
    </div>
  );
}

export default App;
