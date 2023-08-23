const api = require("./api");
const app = require("express").Router();

app.use("/api", api);

app.get("/", (req, res) => {
  res.send(
    ':( 404 "You are standing in an open field west of a white house, with a boarded front door." try /api instead.'
  );
});

app.get("*", (req, res) => {
  res.send(
    ":( 404 - When they said, boldly go where no one has gone before they didnt think you would take it so literally. Try /api instead."
  );
});

module.exports = { api };
