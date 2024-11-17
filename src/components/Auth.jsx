import React, { useState } from 'react';

    function Auth() {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [isRegister, setIsRegister] = useState(false);

      const handleSubmit = (e) => {
        e.preventDefault();
        const url = isRegister ? '/api/register' : '/api/login';
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        })
          .then(response => response.json())
          .then(result => {
            if (result.token) {
              localStorage.setItem('token', result.token);
              window.location.reload();
            } else {
              alert(result.message);
            }
          });
      };

      return (
        <div className="Auth">
          <h2>{isRegister ? 'Register' : 'Login'}</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
          </form>
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </button>
        </div>
      );
    }

    export default Auth;
