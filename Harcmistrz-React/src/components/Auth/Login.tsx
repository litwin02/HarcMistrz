import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Partials/Header';
import { Roles } from '../Models/Roles';

interface LoginResponse {
  id?: number;
  role?: Roles;
  token?: string;
  message?: string;
}

const LoginForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
    
      if (!response.ok) {
        throw new Error("Logowanie nie powiodło się. Błędny email lub hasło.");
      }
      const data: LoginResponse = await response.json();

      if (data.token && data.id && data.role) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id.toString());
        localStorage.setItem('role', data.role.toString());
        navigate('/dashboard');
      } 
      else {
        throw new Error("Logowanie nie powiodło się. Błędny email lub hasło.");
      }
    } 
    catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <>
    <Header />
    <div className='pt-10 bg-p_green text-white flex-col grid justify-center'>
      <h2 className='text-3xl mb-5'>Zaloguj się</h2>
      <form onSubmit={handleLogin}>
        <div className='text-2xl mb-5'>
          <label className='mr-5'>Email:</label>
          <input
            className='text-black'
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='text-2xl mb-8'>
          <label className='mr-5'>Hasło:</label>
          <input
            className='text-black'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className='mb-8 text-red-800 text-2xl'>{error}</p>}
        <button className='bg-a_yellow p-3 text-2xl mb-10 rounded hover:text-s_brown' type="submit">Zaloguj się</button>
      </form>
    </div>
    </>
  );
};

export default LoginForm;
