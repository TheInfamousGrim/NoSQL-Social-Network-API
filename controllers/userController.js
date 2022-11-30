// Import User and Thought models
const { User, Thought } = require('../models');

/* ---------------------------- user controllers ---------------------------- */
// GET all users
function getAllUsers(req, res) {
    User.find({})
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
}

// Get a user by Id
function getUserById(req, res) {
    User.findOne({ _id: req.params.userId })
        .populate('thoughts')
        .populate('friends')
        .select('-__v')
        .then((user) =>
            !user ? res.status(404).json({ message: 'No such user exists with this ID 😭' }) : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
}

// Create a user
function createUser(req, res) {
    User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
}

// Update a users information
function updateUser(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $set: req.body }, { runValidators: true, new: true })
        .then((user) =>
            !user ? res.status(404).json({ message: 'No such user exists with this ID 😭' }) : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
}

// Delete a user and its associated thoughts
function deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'No such user exists with this ID 😭' })
                : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: '🙌 User and Thought deleted! 🙌' }))
        .catch((err) => res.status(500).json(err));
}

/* --------------------------- friend controllers --------------------------- */

// Add a friend and associate it with a user
function addFriend(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
    )
        .then((user) =>
            !user ? res.status(404).json({ message: 'No such user exists with this ID 😭' }) : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
}

// Delete a friend
function deleteFriendById(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true })
        .then((user) => (!user ? res.status(404).json({ message: 'No User find with this ID!' }) : res.json(user)))
        .catch((err) => res.status(500).json(err));
}

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser, addFriend, deleteFriendById };
