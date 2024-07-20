import React, { useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

const App = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    ipcRenderer.send('fetch-users');
    ipcRenderer.on('fetch-users-reply', (event, data) => {
      setUsers(data);
    });

    return () => {
      ipcRenderer.removeAllListeners('fetch-users-reply');
    };
  }, []);

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.name}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
