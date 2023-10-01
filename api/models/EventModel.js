const mongoose = require('mongoose');
const {Schema,model} = mongoose;
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  time: String,
  image: String,
  location: String,
  clubname: String,

  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User' // Reference the User model
  // }
  createdBy:{type:Schema.Types.ObjectId, ref:'User'},
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
