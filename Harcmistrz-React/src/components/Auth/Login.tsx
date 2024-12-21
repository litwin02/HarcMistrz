import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Roles } from '../Models/Roles';
import { MainBox } from '../shared/main-box';
import { WhiteBoxColumn } from '../shared/white-box-column';
import { MainPageHeader } from '../shared/main-page-header';
import { WhiteBox } from '../shared/white-box';
import { FormDiv } from '../shared/form-div';
import { FormLabel } from '../shared/form-label';
import { GreenButton } from '../shared/shared-green-button';

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
        setError("Logowanie nie powiodło się. Błędny email lub hasło.");
        throw new Error("Logowanie nie powiodło się. Błędny email lub hasło.");
      }
      const data: LoginResponse = await response.json();

      if (data.token && data.id && data.role) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id.toString());
        localStorage.setItem('role', data.role.toString());
        if(data.role === Roles.ADMIN) {
          navigate('/admin');
        }
        else if(data.role === Roles.TEAM_LEADER) {
          navigate('/dashboard');
        }
        else {
          navigate('/user-dashboard');
        } 
      } 
      else {
        setError("Logowanie nie powiodło się. Błędny email lub hasło.");
        throw new Error("Logowanie nie powiodło się. Błędny email lub hasło.");
      }
    } 
    catch (e: any) {
      console.error(e);
    }
  };

  return (
    <MainBox>
      <WhiteBoxColumn>
      <MainPageHeader>Zaloguj się</MainPageHeader>
      <WhiteBox>
      <form onSubmit={handleLogin}>
        <FormDiv>
          <FormLabel>Email:</FormLabel>
          <input
            className="mt-1 p-2 rounded-md w-full border"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormDiv>
        <FormDiv>
          <FormLabel>Hasło:</FormLabel>
          <input
            className="mt-1 p-2 rounded-md w-full border"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormDiv>
        {error && <p className='mb-8 text-red-800 text-2xl'>{error}</p>}
        <GreenButton type="submit">Zaloguj się</GreenButton>
      </form>
      </WhiteBox>
      </WhiteBoxColumn>
    </MainBox>
  );
};

export default LoginForm;
