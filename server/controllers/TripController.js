const Trip = require('../models/Trip');

exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.status(200).json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trips' });
  }
};

exports.createTrip = async (req, res) => {
  const { name, participants, totalAmount, contributions } = req.body;

  try {
    const newTrip = new Trip({
      name,
      participants,
      totalAmount,
      contributions
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (err) {
    res.status(500).json({ message: 'Error creating trip', error: err.message });
  }
};

exports.updateTrip = async (req, res) => {
  const { name, participants, totalAmount, contributions } = req.body;

  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      {
        name,
        participants,
        totalAmount,
        contributions
      },
      { new: true }
    );

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json(updatedTrip);
  } catch (err) {
    res.status(500).json({ message: 'Error updating trip', error: err.message });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting trip', error: err.message });
  }
};
