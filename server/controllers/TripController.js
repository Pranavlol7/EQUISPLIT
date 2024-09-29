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
  const { name, participants, totalAmount } = req.body;
  const contributions = new Map();
  participants.forEach(participant => {
    contributions.set(participant, 0);
  });

  const newTrip = new Trip({
    name,
    participants,
    totalAmount,
    contributions
  });

  try {
    await newTrip.save();
    res.status(200).json(newTrip);
  } catch (err) {
    res.status(500).json({ message: 'Error creating trip' });
  }
};

exports.updateTrip = async (req, res) => {
  const { name, participants, totalAmount } = req.body;
  const contributions = new Map();
  const equalContribution = totalAmount / participants.length;

  participants.forEach(participant => {
    contributions.set(participant, equalContribution);
  });

  try {
    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      { name, participants, totalAmount, contributions },
      { new: true, useFindAndModify: false }
    );
    
    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.status(200).json(updatedTrip);
  } catch (err) {
    res.status(500).json({ message: 'Error updating trip' });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting trip' });
  }
};
