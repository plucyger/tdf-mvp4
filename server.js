const express = require('express');
    const sqlite3 = require('sqlite3').verbose();
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const app = express();
    const port = 3000;

    app.use(express.json());

    const db = new sqlite3.Database(':memory:');

    db.serialize(() => {
      db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
      db.run("CREATE TABLE jobs (id INTEGER PRIMARY KEY, title TEXT, description TEXT)");
      db.run("CREATE TABLE grants (id INTEGER PRIMARY KEY, title TEXT, description TEXT)");
      db.run("CREATE TABLE donors (id INTEGER PRIMARY KEY, name TEXT, description TEXT)");
      db.run("CREATE TABLE posts (id INTEGER PRIMARY KEY, userId INTEGER, content TEXT)");
      db.run("CREATE TABLE notifications (id INTEGER PRIMARY KEY, userId INTEGER, message TEXT)");
    });

    const SECRET_KEY = 'your-secret-key';

    app.post('/api/register', async (req, res) => {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], function(err) {
        if (err) return res.status(500).json({ message: 'Registration failed' });
        const token = jwt.sign({ id: this.lastID }, SECRET_KEY);
        res.json({ token });
      });
    });

    app.post('/api/login', async (req, res) => {
      const { username, password } = req.body;
      db.get("SELECT * FROM users WHERE username = ?", [username], async (err, row) => {
        if (err || !row || !await bcrypt.compare(password, row.password)) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: row.id }, SECRET_KEY);
        res.json({ token });
      });
    });

    app.get('/api/intelligence-data', (req, res) => {
      db.all("SELECT * FROM jobs", (err, jobs) => {
        db.all("SELECT * FROM grants", (err, grants) => {
          db.all("SELECT * FROM donors", (err, donors) => {
            res.json({ jobs, grants, donors });
          });
        });
      });
    });

    app.post('/api/submit-data', (req, res) => {
      const { type, data } = req.body;
      const table = type === 'job' ? 'jobs' : type === 'grant' ? 'grants' : 'donors';
      db.run(`INSERT INTO ${table} (title, description) VALUES (?, ?)`, [data.title, data.description], function(err) {
        if (err) return res.status(500).json({ message: 'Data submission failed' });
        db.all("SELECT * FROM users", (err, users) => {
          users.forEach(user => {
            db.run("INSERT INTO notifications (userId, message) VALUES (?, ?)", [user.id, `New ${type} added: ${data.title}`]);
          });
        });
        res.json({ message: 'Data submitted successfully' });
      });
    });

    app.get('/api/social-data', (req, res) => {
      db.all("SELECT * FROM users", (err, users) => {
        db.all("SELECT * FROM posts", (err, posts) => {
          users.forEach(user => {
            user.posts = posts.filter(post => post.userId === user.id);
          });
          res.json({ users });
        });
      });
    });

    app.post('/api/submit-post', (req, res) => {
      const { userId, post } = req.body;
      db.run("INSERT INTO posts (userId, content) VALUES (?, ?)", [userId, post.content], function(err) {
        if (err) return res.status(500).json({ message: 'Post submission failed' });
        db.all("SELECT * FROM users", (err, users) => {
          users.forEach(user => {
            db.run("INSERT INTO notifications (userId, message) VALUES (?, ?)", [user.id, `New post by ${user.username}: ${post.content}`]);
          });
        });
        res.json({ message: 'Post submitted successfully' });
      });
    });

    app.get('/api/notifications', (req, res) => {
      const userId = req.query.userId;
      db.all("SELECT * FROM notifications WHERE userId = ?", [userId], (err, notifications) => {
        res.json({ notifications });
      });
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
