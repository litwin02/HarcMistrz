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
import New_QR_Code from './components/FieldGames/New_QR_Code';
import Edit_QR_Code from './components/FieldGames/Edit_QR_Code';
import EditEvent from './components/Events/EditEvent';
import EditFieldGame from './components/FieldGames/EditFieldGame';
import UserDashboard from './components/Pages/UserDashboard';

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
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: '/user-dashboard',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT"]}>
          <UserDashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: '/create-new-team',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <CreateNewTeam />
        </ProtectedRoute>
      )
    },
    {
      path: '/join-team',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT"]}>
          <AddScoutToTeam />
        </ProtectedRoute>
      )
    },
    {
      path: 'create-new-event',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <CreateNevEvent />
        </ProtectedRoute>
      )
    },
    {
      path: '/event/:id',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <ManageEvent />
        </ProtectedRoute>
      )
    },
    {
      path: '/new-field-game/:eventId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <NewFieldGame />
        </ProtectedRoute>
      )
    },
    {
      path: '/qr-codes/:eventId/:fieldGameId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <QR_Codes />
        </ProtectedRoute>
      )
    },
    {
      path: '/new-qr-code/:eventId/:fieldGameId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <New_QR_Code />
        </ProtectedRoute>
      )
    },
    {
      path: '/edit-qr-code/:eventId/:qrCodeId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Edit_QR_Code />
        </ProtectedRoute>
      )
    },
    {
      path: '/edit-event/:id',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <EditEvent />
        </ProtectedRoute>
      )
    },
    {
      path: '/edit-field-game/:eventId/:fieldGameId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <EditFieldGame />
        </ProtectedRoute>
      )
    },

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
