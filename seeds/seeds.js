const { Thought } = require("../models/Thought");
const { User } = require("../models/User");
const { faker } = require('@faker-js/faker');

const db = require("../config/connection");

const seedUsers = async () => {
  // await User.deleteMany({});
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
  // await Thought.deleteMany({});
  const thoughts = [];
  for (let i = 0; i < 100; i++) {
    thoughts.push({
      thoughtText: faker.lorem.words(Math.round(Math.random() * 20) + 1),
      username: faker.internet.userName(),
      createdAt: faker.date.past(),
    });
  }
  await Thought.insertMany(thoughts);
  console.log("Thoughts seeded");
};

const seedReactions = async () => {
  await Thought.updateMany({}, { $set: { reactions: [] } });
  const reactions = [];
  for (let i = 0; i < 100; i++) {
    reactions.push({
      reactionBody: faker.lorem.words(Math.round(Math.random() * 20) + 1),
      username: faker.internet.userName(),
      createdAt: faker.date.past(),
    });
  }
  await Thought.updateMany({}, { $set: { reactions: reactions } });
  console.log("Reactions seeded");
};

const seedFriends = async () => {
  const friends = await User.find({});
  friends.forEach(async (friend) => {
    const friendCount = Math.floor(Math.random() * 10);
    for (let i = 0; i < friendCount; i++) {
      const newFriend = friends[Math.floor(Math.random() * friends.length)];
      if (
        newFriend._id !== friend._id &&
        !friend.friends.includes(newFriend._id)
      ) {
        friend.friends.push(newFriend._id);
      }
    }
    await friend.save();
  });
};

db.once("open", async () => {
  await seedUsers();
  await seedThoughts();
  await seedReactions();
  await seedFriends();
  console.log("Seeding complete!");
  process.exit(0);
});
