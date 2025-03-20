const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json()); // For parsing JSON data

const uri = 'mongodb://localhost:27017'; // MongoDB connection string
const dbName = 'mydb'; // Database name
let db;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log('MongoDB connection successful');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js CRUD app with MongoDB!');
});

// Create a user (POST)
app.post('/users', (req, res) => {
  const user = req.body;
  const collection = db.collection('users');

  collection.insertOne(user)
    .then(result => {
      res.status(201).send(`User added: ${result.insertedId}`);
    })
    .catch(error => {
      res.status(500).send('An error ocurred:', error);
    })
});

// Get all users (GET)
app.get('/users', (req, res) => {
  const collection = db.collection('users');

  collection.find().toArray()
    .then(users => {
      res.json(users); // Sending users as JSON
    })
    .catch(error => {
      res.status(500).send('An error ocurred:', error);
    });
})

// Get a user by ID (GET)
app.get('/users/:id', (req, res) => {
  const { id } = req.params; // Getting the user ID from params
  const collection = db.collection('users');

  collection.findOne({ _id: new ObjectId(id) })
    .then(user => {
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
      res.json(user); // Sending user as JSON
    })
    .catch(error => {
      res.status(500).send('An error ocurred:', error);
    });
});

// Update a user by ID (PUT)
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  const collection= db.collection('users');

  collection.updateOne(
    { _id: new ObjectId(id) }, // Finding the user
    { $set: updatedUser } // Updating the user
  )
    .then(result => {
      if (result.matchedCount === 0) {
        res.status(404).send('User not found');
        return;
      }
      res.send(`User updated: ${id}`);
    })
    .catch( error => {
      res.status(500).send('An error ocurred:', error);
    });
});

// Delete a user (DELETE)
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const collection = db.collection('users');

  collection.deleteOne({ _id: new ObjectId(id) })
    .then(result => {
      if (result.deletedCount === 0) {
        res.status(404).send('User not found');
        return;
      }
      res.send(`User deleted: ${id}`);
    })
    .catch(error => {
      res.status(500).send('An error ocurred:', error);
    })
})

// Star the Server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


