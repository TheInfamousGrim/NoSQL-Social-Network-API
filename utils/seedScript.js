const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker/locale/en');
const connection = require('../config/connection');
const { User, Thought } = require('../models');

// Set up environment variables
dotenv.config({ path: 'variables.env' });

/* ----------------------------- fake user data ----------------------------- */

// Create 20 iterations of fake user data
function createFakeUsers() {
    const users = [];

    // Create new users
    for (let i = 0; i < 20; i++) {
        users.push(
            new User({
                username: faker.internet.userName(),
                email: faker.internet.email(),
            })
        );
    }
    return users;
}

// Select a random friend from the existing users
function generateFakeFriends(users, currentUserIndex) {
    for (let j = 0; j < 3; j++) {
        const randUserIndex = Math.floor(Math.random() * users.length);
        if (
            // Checks to make sure the random friend isn't the same as the current user
            users[randUserIndex]._id === users[currentUserIndex]._id &&
            // Checks to make sure we aren't adding duplicate friends
            users[randUserIndex].friends.some((friend) => users[currentUserIndex].friends.indexOf(friend) >= 0)
        ) {
            return generateFakeFriends(users, currentUserIndex);
        }
        users[currentUserIndex].friends.push(users[randUserIndex]._id);
    }
    return users;
}

function createFakeFriendsList(users) {
    for (let i = 0; i < users.length; i++) {
        generateFakeFriends(users, i);
    }
}

// Select a random user
function selectRandomUser(users, currentUser) {
    const randUserIndex = Math.floor(Math.random() * users.length);
    return users[randUserIndex]._id === currentUser._id ? selectRandomUser(users, currentUser) : currentUser.username;
}

/* --------------------- fake thought and reaction data --------------------- */

// Generate reactions for a single thought
function generateFakeReaction(users, currentUser, reactionsArr) {
    // Create 3 fake reactions
    for (let k = 0; k < 3; k++) {
        // Create a single fake reaction
        reactionsArr.push({
            reactionBody: faker.lorem.sentence(),
            username: selectRandomUser(users, currentUser),
            createdAt: faker.date.past(),
        });
    }
    return reactionsArr;
}

// Generate thoughts for a single user
function generateFakeThought(users, currentUser, thoughtsArray) {
    // Create 3 fake thoughts
    for (let j = 0; j < 3; j++) {
        // Create a single fake thought
        const currentThought = new Thought({
            thoughtText: faker.lorem.sentence(),
            createdAt: faker.date.past(),
            username: currentUser.username,
        });
        // Generate the reactions for the thought
        currentThought.reactions = generateFakeReaction(users, currentUser, currentThought.reactions);
        // Push this new thought data to the array of thoughts
        thoughtsArray.push(currentThought);
        // Push the current thought id to the current users thought list
        currentUser.thoughts.push(currentThought._id);
    }
}

// Generate random thoughts
function createFakeThoughts(users) {
    const thoughtsArray = [];

    // create new thoughts
    for (let i = 0; i < users.length; i++) {
        generateFakeThought(users, users[i], thoughtsArray);
    }
    return thoughtsArray;
}

/* ---------------------------- connect to the db --------------------------- */

// Connection
connection.on('error', (err) => err);

connection.once('open', async () => {
    console.log('😲🙌 CONNECTED TO THE DATABASE BBY 😲🙌');

    // Drop existing user data
    await User.deleteMany({});
    // Drop existing thought data
    await Thought.deleteMany({});

    // Create fake users
    const fakeUsers = createFakeUsers();
    // Create fake friends list
    createFakeFriendsList(fakeUsers);

    // create fake thoughts and reactions
    const fakeThoughts = createFakeThoughts(fakeUsers);

    // Add the users to the collection and await the results
    await User.collection.insertMany(fakeUsers);

    // Add the thoughts and reactions to the collection and await the results
    await Thought.collection.insertMany(fakeThoughts);

    // Log out the seed data to indicate what should appear in the database
    console.table(fakeUsers);
    console.info('🌱 SEEDING COMPLETE 🌱');
    process.exit(0);
});
