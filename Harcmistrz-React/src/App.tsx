import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import About from './components/Pages/About';
import Login from './components/Auth/Login';
import MainPage from './components/Pages/MainPage';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Pages/Dashboard';

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
      path: '/o-nas',
      element: <About />,
    },
    {
      path: '/dashboard',
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <div className='app font-poppins'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
