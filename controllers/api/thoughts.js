const { User, Thought } = require("../../models");
const router = require("express").Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const thoughtData = await Thought.find({});
    res.status(200).json(thoughtData);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// GET a single thought by its _id
router.get("/:id", async (req, res) => {
  try {
    const thoughtData = await Thought.findOne({ _id: req.params.id });
    res.status(200).json(thoughtData);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//POST to create a new thought (dont forget to push the created thought's _id to the associated users thoughts array field)
router.post("/", async (req, res) => {
  try {
    const thoughtData = await Thought.create(req.body);
    const userData = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { $push: { thoughts: thoughtData._id } },
      { new: true }
    );
    res.status(200).json(thoughtData, userData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// PUT to update a thought by its _id
router.put("/:id", async (req, res) => {
  try {
    const thoughtData = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    res.status(200).json(thoughtData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// DELETE to remove a thought by its _id
router.delete("/:id", async (req, res) => {
  try {
    const thoughtData = await Thought.findOneAndDelete({ _id: req.params.id });
    res.status(200).json(thoughtData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post("/:id/reactions", async (req, res) => {
  try {
    const thoughtData = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { reactions: req.body } },
      { new: true }
    );
    res.status(200).json(thoughtData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

// DELETE to pull and remove a reaction by the reactions reactionId value
router.delete("/:id/reactions/:reactionId", async (req, res) => {
  try {
    const thoughtData = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    );
    res.status(200).json(thoughtData);
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
});

module.exports = router;