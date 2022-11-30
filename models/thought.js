const { Schema, model, Types } = require('mongoose');

// Import day.js module to format timestamps for when thoughts and reactions are instantiated
const dayjs = require('dayjs');

// Date and Time formatting function
function dateTimeFormat(createdAt) {
    dayjs(createdAt).format('MMM DD, YYYY [at] HH:MM');
}

// Reaction schema
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateTimeFormat(createdAtVal),
        },
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

// Thought schema
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (createdAtVal) => dateTimeFormat(createdAtVal),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false,
    }
);

// Get total number of reactions that user has
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

// Create the Thought model using the thoughtSchema and reactionSchema
const Thought = model('Thought', thoughtSchema);

// Export the Thought model
module.exports = Thought;
