import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import './App.css';
import AuthenticatedApp from './components/authenticatedApp';


// App component
function App() {
  return (
    <Auth0Provider
      domain="dev-a85mbvrupb7ey7lv.us.auth0.com"
      clientId="Bm9yP3O3kHPyuu0OarB8ZsHlkZmg3XTs"
      redirectUri={'http://localhost:3000'}
      onRedirectCallback={(appState) => {
        // After login, redirect to the originally requested page
        window.history.replaceState({}, document.title, appState?.returnTo || window.location.pathname);
      }}
      useRefreshTokens={true} // Enable refresh tokens
      cacheLocation="localstorage" // Store tokens in local storage
      sessionCheckExpiryDays={2} // Check session every 2 days
    >
      <AuthenticatedApp />
    </Auth0Provider>
  );
}

export default App;
