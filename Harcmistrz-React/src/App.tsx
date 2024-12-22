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
import Layout from './Layout';
import AvaliableEvents from './components/Events/AvaliableEvents';
import ManageTeam from './components/Team/ManageTeam';
import EditTeam from './components/Team/EditTeam';
import EventDetails from './components/Events/EventDetails';
import PlayFieldGame from './components/FieldGames/PlayFieldGame';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (<Layout>
        <MainPage />
      </Layout>),
    },
    {
      path: '/login',
      element: (<Layout>
        <Login />
      </Layout>),
    },
    {
      path: '/register',
      element: (<Layout>
        <Register />
      </Layout>)
    },
    {
      path: 'logout',
      element: <Logout />
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/user-dashboard',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT"]}>
          <Layout>
            <UserDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/create-new-team',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Layout>
            <CreateNewTeam />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/join-team',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT"]}>
          <Layout>
            <AddScoutToTeam />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: 'create-new-event',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Layout>
            <CreateNevEvent />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/event/:id',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Layout>
            <ManageEvent />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/new-field-game/:eventId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Layout>
            <NewFieldGame />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/qr-codes/:eventId/:fieldGameId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Layout>
            <QR_Codes />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/new-qr-code/:eventId/:fieldGameId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Layout>
            <New_QR_Code />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/edit-qr-code/:eventId/:fieldGameId/:qrCodeId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Layout>
            <Edit_QR_Code />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/edit-event/:id',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Layout>
            <EditEvent />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/edit-field-game/:eventId/:fieldGameId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Layout>
            <EditFieldGame />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/available-events/:teamId',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT"]}>
          <Layout>
            <AvaliableEvents />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/manage-team/:teamId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Layout>
            <ManageTeam />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/edit-team',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER"]}>
          <Layout>
            <EditTeam />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/event-details/:eventId',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT"]}>
          <Layout>
            <EventDetails />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/play-field-game/:eventId/:fieldGameId',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT"]}>
          <Layout>
            <PlayFieldGame />
          </Layout>
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
