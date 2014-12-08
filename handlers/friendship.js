var User = require('./../models/user');
var Friendship = require('./../models/friendship');

function request(req, res, next) {
  var senderId = req.user._id;
  var receiverId = req.params.user_id;

  User.findById(receiverId, function(err, user) {
    if (err)
      next(err);

    if (!user) {
      res.status(422).json({ error: 'Receiving user not found' });
      return;
    }

    Friendship.findOne(
      { senderId: senderId, receiverId: receiverId },
      function(err, friendship) {
        if (err)
          return next(err);

        if (friendship) {
          res.status(422).json({ error: 'Friendship already exists' });
          return;
        }

        var newFriendship = new Friendship({
          senderId: senderId,
          receiverId: receiverId,
          accepted: false
        });

        newFriendship.save(function(err) {
          return err ? next(err) : res.json({
            _id: newFriendship._id,
            senderId: newFriendship.senderId,
            receiverId: newFriendship.receiverId,
            accepted: newFriendship.accepted
          });
        });
      });
  });
}

function accept(req, res, next) {
  var friendshipId = req.params.friendship_id;

  Friendship.findById(friendshipId, function(err, friendship) {
    if (err)
      return next(err);

    if (!friendship) {
      res.status(422).json({ error: 'Friendship not found' });
      return;
    }

    friendship.accepted = true;
    friendship.save(function(err) {
      return err ? next(err) : res.json({
          _id: friendship._id,
          senderId: friendship.senderId,
          receiverId: friendship.receiverId,
          accepted: newFriendship.accepted
        });
    });
  });
}

function decline(req, res, next) {
  var friendshipId = req.params.friendship_id;

  Friendship.findById(friendshipId, function(err, friendship) {
    if (err)
      return next(err);

    if (!friendship) {
      res.status(422).json({ error: 'Friendship not found' });
      return;
    }

    friendship.remove(function(err) {
      return err ? next(err) : res.send();
    });
  });
}

module.exports = {
  request: request,
  accept: accept,
  decline: decline
};