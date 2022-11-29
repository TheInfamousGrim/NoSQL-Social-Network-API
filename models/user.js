// Import modules from mongoose
const { Schema, model, Types } = require('mongoose');

// User schema for user data
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                'Please add a valid email address',
            ],
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought',
            },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

// Retrieve the length of the friends list so that the number of friends can be shown
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

// Create the User model from the userSchema
const User = model('User', userSchema);

// export the user model
module.exports = User;
