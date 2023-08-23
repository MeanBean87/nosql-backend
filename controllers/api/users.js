const { User, Thought } = require("../../models");
const app = require("express").Router();

// GET all users
app.get("/users", async (req, res) => {
  try {
    const usersData = await User.find({});
    res.status(200).json(usersData);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// GET a single user by its _id and populated thought and friend data
app.get("/users/:id", async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.params.id })
      .populate("thoughts")
      .populate("friends");
    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// POST a new user:
app.post("/users", async (req, res) => {
  try {
    const userData = await User.create(req.body);
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// PUT to update a user by its _id
app.put("/users/:id", async (req, res) => {
  try {
    const userData = await User.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// DELETE to remove user by its _id and associated thoughts
app.delete("/users/:id", async (req, res) => {
  try {
    const userData = await User.findOneAndDelete({ _id: req.params.id });
    const thoughtData = await Thought.deleteMany({
      username: userData.username,
    });
    res.status(200).json(userData, thoughtData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// POST to add a new friend to a user's friend list
app.post("/users/:userId/friends/:friendId", async (req, res) => {
  try {
    const userData = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.params.friendId } },
      { new: true }
    );
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// DELETE to remove a friend from a user's friend list
app.delete("/users/:userId/friends/:friendId", async (req, res) => {
  try {
    const userData = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    res.status(200).json(userData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});
