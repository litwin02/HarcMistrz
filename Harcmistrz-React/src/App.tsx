import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import About from './components/About';
import Login from './components/Auth/Login';
import MainPage from './components/MainPage';

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
      element: <About />
    },
  ]);

  return (
    <div className='app font-poppins'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
