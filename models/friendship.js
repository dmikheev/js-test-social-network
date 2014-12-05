var mongoose = require('mongoose');

// TODO: add validation
var friendshipSchema = mongoose.Schema({
  senderId: { type: ObjectId, required: true },
  receiverId: { type: ObjectId, required: true },
  accepted: { type: Boolean, required: true }
});
friendshipSchema.index({ senderId: 1 });
friendshipSchema.index({ receiverId: 1 });

module.exports = mongoose.model('Friendship', friendshipSchema);