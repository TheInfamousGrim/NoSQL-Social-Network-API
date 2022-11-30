// Import data models for users, thoughts and reactions
const { User, Thought } = require('../models');

/* -------------------------------- thoughts -------------------------------- */

// GET all thoughts
function getThoughts(req, res) {
    Thought.find({})
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
}

// GET a single thought by id
function getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then((thought) =>
            !thought ? res.status(404).json({ message: 'No Thought find with this ID!' }) : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
}

// Create a thought
function createThought(req, res) {
    Thought.create(req.body)
        .then(({ _id }) => User.findOneAndUpdate({ _id: req.body.userId }, { $push: { thoughts: _id } }, { new: true }))
        .then((thought) =>
            !thought ? res.status(404).json({ message: 'There is no user with this ID!' }) : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
}

// Delete a thought
function deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought find with this ID!' })
                : User.findOneAndUpdate(
                      { thoughts: req.params.thoughtId },
                      { $pull: { thoughts: req.params.thoughtId } },
                      { new: true }
                  )
        )
        .then((user) =>
            !user
                ? res.status(404).json({ message: 'Thought deleted, but no user found' })
                : res.json({ message: 'Thought successfully deleted' })
        )
        .catch((err) => res.status(500).json(err));
}

/* -------------------------------- reactions ------------------------------- */

// Create a reaction
function createReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
    )
        .then((thought) =>
            !thought ? res.status(404).json({ message: 'No thought frind with ID!' }) : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
}

// Delete a reaction
function deleteReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
    )
        .then((thought) =>
            !thought ? res.status(404).json({ message: 'No thought find with this ID!' }) : res.json(thought)
        )
        .catch((err) => res.status(500).json(err));
}

// Export all controller functions
module.exports = { getThoughts, getThoughtById, createThought, deleteThought, createReaction, deleteReaction };
