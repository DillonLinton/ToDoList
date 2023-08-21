const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the in-memory SQLite database.');
});

db.serialize(() => {
  db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT)");
});

app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      console.error(err.message);
    }
    res.json(rows);
  });
});

app.post('/tasks', (req, res) => {
  const task = req.body.task;
  db.run("INSERT INTO tasks (text) VALUES (?)", [task], function(err) {
    if (err) {
      console.error(err.message);
    }
    const taskId = this.lastID;
    res.json({ id: taskId, text: task });
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});