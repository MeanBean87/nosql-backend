const apiRoutes = require("./api");
const router = require("express").Router();

router.use("/api", apiRoutes);

router.get("*", (req, res) => {
  res.send(
    ":( 404 - When they said, boldly go where no one has gone before they didnt think you would take it so literally. Try /api instead."
  );
});

module.exports = router;
