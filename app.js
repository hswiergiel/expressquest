require("dotenv").config();
const express = require("express");

const app = express();

const port = process.env.APP_PORT ?? 5000;

app.use(express.json());

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const validator = require("./validator");
const {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyId,
} = require("./auth.js");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);

app.post(
  "/api/users",
  validator.validateUser,
  hashPassword,
  userHandlers.postUser
);
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

app.use(verifyToken);
app.post("/api/movies", validator.validateMovie, movieHandlers.postMovie);
app.put("/api/movies/:id", validator.validateMovie, movieHandlers.putMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);

app.use(verifyId);
app.put(
  "/api/users/:id",
  validator.validateUser,
  hashPassword,
  userHandlers.putUser
);
app.delete("/api/users/:id", userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
