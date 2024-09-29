const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  name: { type: String, required: true },
  participants: { type: [String], required: true },
  totalAmount: { type: Number, required: true },
  contributions: { type: Map, of: Number, default: {} } 
});


tripSchema.methods.calculateContributions = function() {
  const totalParticipants = this.participants.length;
  const equalContribution = this.totalAmount / totalParticipants;

  this.participants.forEach(participant => {
    this.contributions.set(participant, equalContribution);
  });
};

module.exports = mongoose.model('Trip', tripSchema);
