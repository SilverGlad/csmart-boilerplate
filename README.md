# Electron + React + Vite Boilerplate

This is a boilerplate project for creating an Electron application with React and Vite.

Este é um projeto boilerplate para criar uma aplicação Electron com React e Vite.

## Installation / Instalação

1. **Clone the repository / Clone o repositório**

    ```bash
    git clone https://github.com/yourusername/csmart-boilerplate.git
    cd csmart-boilerplate
    ```

2. **Install dependencies / Instale as dependências**

    ```bash
    npm install
    ```

3. **Run the application / Execute a aplicação**

    ```bash
    npm run dev
    ```

## Build the application / Construa a aplicação

To build the Electron application, run:

Para construir a aplicação Electron, execute:

```bash
npm run build
npm run electron:build
```

## Add and Configure SQLite / Adicionar e Configurar SQLite

1. **Install SQLite and sqlite3 / Instalar SQLite e sqlite3**

```bash
npm install sqlite3
```

2. **Configure SQLite in Electron / Configurar SQLite no Electron**
```bash
const sqlite3 = require('sqlite3').verbose();
app.on('ready', () => {
  createWindow();
  const db = new sqlite3.Database('./database.db');
  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INT, name TEXT)");
  });
  ipcMain.on('fetch-users', (event, arg) => {
    db.all("SELECT id, name FROM users", [], (err, rows) => {
      if (err) {
        throw err;
      }
      event.reply('fetch-users-reply', rows);
    });
  });
});
```

3. **Access SQLite in React / Acessar SQLite no React**
```bash
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
```