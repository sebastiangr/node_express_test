const express = require('express');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.json());

// Mock data
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Janet Doe', email: 'janet@example.com' },
]

// 1. Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// 2. Get a user by ID
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found.' });
  }
});

// 3. Create a new user
app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.mail,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// 4. Update a user
app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (user) {
    user.name = req.body.name;
    user.email = req.body.email;
    res.json(user);
  } else {
    res.status(404).json({ message: ' User not found.'});
  }
})

// 5. Delete a user
app.delete('/api/users/:id', (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.status(204).send();
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})