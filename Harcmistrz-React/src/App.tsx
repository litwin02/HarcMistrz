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
import FieldGameResult from './components/FieldGames/FieldGameResult';
import UserProfile from './components/UserProfile/UserProfile';
import EditUserProfile from './components/UserProfile/EditUserProfile';
import EditPassword from './components/UserProfile/EditPassword';
import AdminDashboard from './components/Admin/admin-dashboard';
import ManageUsers from './components/Admin/manage-users';
import ManageTeams from './components/Admin/manage-teams';
import ManageEvents from './components/Admin/manage-events';
import ChatComponent from './Messages/ChatComponent';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Layout>
          <MainPage />
        </Layout>
      ),
    },
    {
      path: '/login',
      element: (
        <Layout>
          <Login />
        </Layout>
      ),
    },
    {
      path: '/register',
      element: (
        <Layout>
          <Register />
        </Layout>
      )
    },
    {
      path: 'logout',
      element: <Logout />
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/user-dashboard',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT", "ADMIN"]}>
          <Layout>
            <UserDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: '/create-new-team',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <CreateNewTeam />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/join-team',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT", "ADMIN"]}>
          <Layout>
            <AddScoutToTeam />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: 'create-new-event',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <CreateNevEvent />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/event/:id',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <ManageEvent />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/new-field-game/:eventId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <NewFieldGame />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/qr-codes/:eventId/:fieldGameId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <QR_Codes />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/new-qr-code/:eventId/:fieldGameId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <New_QR_Code />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/edit-qr-code/:eventId/:fieldGameId/:qrCodeId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <Edit_QR_Code />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/edit-event/:id',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <EditEvent />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/edit-field-game/:eventId/:fieldGameId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <EditFieldGame />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/available-events/:teamId',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT", "ADMIN"]}>
          <Layout>
            <AvaliableEvents />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/manage-team/:teamId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <ManageTeam />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/edit-team/:teamId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <EditTeam />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/event-details/:eventId',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT", "ADMIN"]}>
          <Layout>
            <EventDetails />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/play-field-game/:eventId/:fieldGameId',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT", "ADMIN"]}>
          <Layout>
            <PlayFieldGame />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/field-game-results/:eventId/:fieldGameId',
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <FieldGameResult />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/user-profile',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT", "TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <UserProfile />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/edit-profile/:id',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT", "TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <EditUserProfile />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: '/change-password',
      element: (
        <ProtectedRoute allowedRoles={["SCOUT", "TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <EditPassword />
          </Layout>
        </ProtectedRoute>
      )
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/manage-users",
      element: (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <Layout>
            <ManageUsers />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/manage-teams",
      element: (
        <ProtectedRoute allowedRoles={["ADMIN"]}>
          <Layout>
            <ManageTeams />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/manage-events/:teamId",
      element: (
        <ProtectedRoute allowedRoles={["TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <ManageEvents />
          </Layout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/messages",
      element: (
        <ProtectedRoute allowedRoles={["SCOUT", "TEAM_LEADER", "ADMIN"]}>
          <Layout>
            <ChatComponent />
          </Layout>
        </ProtectedRoute>
      ),
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
