const { Thought } = require("../models/Thought");
const { User } = require("../models/User");
const { faker } = require("@faker-js/faker");

const db = require("../config/connection");

const seedUsers = async () => {
  await User.deleteMany({});
  const users = [];
  for (let i = 0; i < 50; i++) {
    users.push({
      username: faker.internet.userName(),
      email: faker.internet.email(),
      thoughts: [],
      friends: [],
    });
  }
  await User.insertMany(users);
  console.log("Users seeded");
};

const seedThoughts = async () => {
  await Thought.deleteMany({});
  const users = await User.find();
  const thoughts = [];
  users.forEach((user) => {
    for (let i = 0; i < 5; i++) {
      thoughts.push({
        thoughtText: faker.lorem.words(Math.round(Math.random() * 20) + 1),
        username: user.username,
        createdAt: faker.date.past(),
        reactions: [],
      });
    }
  });

  const insertedThoughts = await Thought.insertMany(thoughts);

  const thoughtIdsByUser = {};
  insertedThoughts.forEach((thought) => {
    if (!thoughtIdsByUser[thought.username]) {
      thoughtIdsByUser[thought.username] = [];
    }
    thoughtIdsByUser[thought.username].push(thought._id);
  });

  for (const user of users) {
    const userThoughtIds = thoughtIdsByUser[user.username];
    await User.updateOne(
      { username: user.username },
      { $set: { thoughts: userThoughtIds } }
    );
  }
};

const seedReactions = async () => {
  await Thought.updateMany({}, { $set: { reactions: [] } });

  const users = await User.find({}, "_id username");

  const reactions = [];
  for (let i = 0; i < 100; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    reactions.push({
      reactionBody: faker.lorem.words(Math.round(Math.random() * 20) + 1),
      username: randomUser.username,
      createdAt: faker.date.past(),
    });
  }

  const thoughtIds = await Thought.find({}, "_id");
  for (const thoughtId of thoughtIds) {
    const randomReactions = reactions.slice(0, Math.floor(Math.random() * 100));
    await Thought.findByIdAndUpdate(thoughtId, {
      $set: { reactions: randomReactions },
    });
  }

  console.log("Reactions seeded");
};

const seedFriends = async () => {
  const friends = await User.find({});

  const promises = friends.map(async (friend) => {
    const friendCount = Math.min(10, friends.length - 1);

    const potentialFriends = friends.filter(
      (potentialFriend) =>
        potentialFriend._id.toString() !== friend._id.toString() &&
        !friend.friends.includes(potentialFriend._id)
    );

    const selectedFriends = potentialFriends.slice(0, friendCount);

    selectedFriends.forEach((selectedFriend) => {
      friend.friends.push(selectedFriend._id);
    });

    return friend.save();
  });

  await Promise.all(promises);
  console.log("Friendships seeded");
};

db.once("open", async () => {
  await seedUsers();
  await seedThoughts();
  await seedFriends();
  await seedReactions();
  console.log("Seeding complete!");
  process.exit(0);
});
