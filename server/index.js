const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/bill-splitting', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  participants: { type: [String], required: true, validate: (value) => value.length > 0 },
  date: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true, min: 0 },
});

const Trip = mongoose.model('Trip', tripSchema);

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to my backend server!');
});

// API routes for trips
app.get('/api/trips', async (req, res) => {
  try {
    const trips = await Trip.find();
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
});

app.post('/api/trips', async (req, res) => {
  const newTrip = new Trip(req.body);
  try {
    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ message: 'Error creating trip', error: error.message });
  }
});

app.delete('/api/trips/:id', async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(deletedTrip);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting trip', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});