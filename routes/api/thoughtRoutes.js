const router = require('express').Router();

const {
    getThoughts,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction,
} = require('../../controllers/thoughtController');

/* -------------------------------------------------------------------------- */
/*                               thought routes                               */
/* -------------------------------------------------------------------------- */

/* ------------------------- /api/thoughts/ endpoint ------------------------ */
// GET all thoughts
router.route('/').get(getThoughts);
// POST a new thought
router.route('/').post(createThought);

/* -------------------- /api/thoughts/:thoughtid endpoint ------------------- */
// GET a single thought by its Id
router.route('/:thoughtId').get(getThoughtById);
// PUT an existing thought by its Id
router.route('/:thoughtId').put(updateThought);
// DELETE an existing thought by its Id
router.route('/:thoughtId').delete(deleteThought);

/* -------------------------------------------------------------------------- */
/*                               reaction routes                              */
/* -------------------------------------------------------------------------- */

/* --------------- /api/thoughts/:thoughtId/reactions endpoint -------------- */
// POST a new reaction
router.route('/:thoughtId/reactions').post(createReaction);

/* --------- /api/thoughts/:thoughtId/reactions/:reactionId endpoint -------- */
// DELETE a reaction by its id
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

module.exports = router;
