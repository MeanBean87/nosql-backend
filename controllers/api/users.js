const { User, Thought } = require("../../models");
const router = require("express").Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const usersData = await User.find({});
    if (usersData) {
      res.status(200).json(usersData);
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// GET a single user by its _id and populated thought and friend data
router.get("/:id", async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.params.id })
      .populate("thoughts")
      .populate("friends");
    if (!userData) {
      res.status(404).json({ message: "No user found with this id!" });
      return;
    }
    res.status(200).json({ message: "User found!", userData });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// POST a new user:
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);
    if (!userData) {
      res
        .status(404)
        .json({ message: "User creation failed check the request body." });
      return;
    }
    res.status(200).json({ message: "User created!", userData });
  } catch (err) {
    console.log(err)
    if (err.code === 11000) {
      const key = Object.keys(err.keyValue)[0];
      const value = Object.values(err.keyValue)[0];
      res.status(400).json({
        message: `${value} is already taken. Please use another ${key}.`,
      });
      return;
    }
    res.status(400).json(err);
  }
});

// PUT to update a user by its _id
router.put("/:id", async (req, res) => {
  try {
    const userData = await User.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!userData) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "User updated!", userData });
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// DELETE to remove user by its _id and associated thoughts
router.delete("/:id", async (req, res) => {
  try {
    const userData = await User.findOneAndDelete({ _id: req.params.id });
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }
    const thoughtData = await Thought.deleteMany({
      username: userData.username,
    });
    res.status(200).json({ message: "User deleted", userData, thoughtData });
  } catch (err) {
    res.status(500).json({ message: "An error occurred", error: err.message });
    console.error(err);
  }
});

// POST to add a new friend to a user's friend list
router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const userData = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: { friends: req.params.friendId } },
      { new: true }
    );
    if (!userData) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "Friend added!", userData });
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// DELETE to remove a friend from a user's friend list
router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const userData = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
    );
    if (!userData) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    for (const friend of userData.friends) {
      if (friend._id == req.params.friendId) {
        res.status(200).json({ message: "Friend removed!", userData });
        return;
      } else if(friend._id != req.params.friendId) {
        res.status(404).json({ message: "Friend already removed." });
        return;
      }
    }
    res.status(404).json({ message: "Friend not found" });
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

module.exports = router;
