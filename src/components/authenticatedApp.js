import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../App.css';
import Chat from './chat';

// AuthenticatedApp component
function AuthenticatedApp() {
  const { isLoading, isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="authenticated-app">
      {isAuthenticated ? (
        <>
          <header className="header">
            <img src={user.picture} alt={user.name} className="avatar" />
            <div className="user-info">
              <h2>Welcome, {user.name}</h2>
              <p>Email: {user.email}</p>
            </div>
            <button className="logout-button" onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
          </header>
          <Chat />
        </>
      ) : (
        <div className="login-container">
          <p>Please log in to access the app.</p>
          <button className="login-button" onClick={() => loginWithRedirect()}>Log In</button>
        </div>
      )}
    </div>
  );
}

export default AuthenticatedApp;
