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
import { QueryClient, QueryClientProvider } from 'react-query';
import ManageEvent from './components/Events/ManageEvent';
import NewFieldGame from './components/FieldGames/CreateFieldGame';
import { ApiProvider } from './ApiContext';
import QR_Codes from './components/FieldGames/QR_Codes';

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
    {
      path: '/event/:id',
      element: (
        <ProtectedRoute>
          <ManageEvent />
        </ProtectedRoute>
      )
    },
    {
      path: '/new-field-game/:eventId',
      element: (
        <ProtectedRoute>
          <NewFieldGame />
        </ProtectedRoute>
      )
    },
    {
      path: '/qr-codes/:fieldGameId',
      element: (
        <ProtectedRoute>
          <QR_Codes />
        </ProtectedRoute>
      )
    }

  ]);

  const queryClient = new QueryClient();
  queryClient.setDefaultOptions({
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  });

  return (
    <div className='app font-poppins'>
      <QueryClientProvider client={queryClient}>
        <ApiProvider baseUrl='http://localhost:8080/api/v1'>
          <RouterProvider router={router} />
        </ApiProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
