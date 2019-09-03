const express = require("express");

const Posts = require("./data/db.js");

const server = express();

server.use(express.json()); // teaches express to parse JSON body

//make sure server is up
server.get("/", (req, res) => {
  res.status(200).json({ api: "up..." });
});

server.post("/api/posts", (req, res) => {
  const post = req.body;

  if (post.title && post.contents) {
    Posts.insert(post)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(error => {
        res.status(500).json({
          errorMessage:
            "There was an error while saving the post to the database"
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

server.post("/api/posts/:id/comments", (req, res) => {
  const postId = req.params.id;
  const comment = req.body;

  if (!postId) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  }
  if (!comment.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
  Posts.insertComment(comment)
    .then(comment => res.status(201).json(comment))
    .catch(error =>
      res.status(500).json({
        error: "There was an error while saving the comment to the database"
      })
    );
});

server.get("/api/posts", (req, res) => {
  Posts.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

server.get("/api/posts/:id", (req, res) => {
  const postId = req.params.id;

  if (!postId) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else {
    Posts.findById(postId)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(error => {
        res
          .status(500)
          .json({ error: "The post information could not be retrieved." });
      });
  }
});

server.get("/api/posts/:id/comments", (req, res) => {
  const postId = req.params.id;

  if (!postId) {
    res
      .status(404)
      .json({ message: "The post with the specified ID does not exist." });
  } else {
    Posts.findPostComments(postId)
      .then(comments => {
        res.status(200).json(comments);
      })
      .catch(error => {
        res
          .status(500)
          .json({ error: "The comments information could not be retrieved." });
      });
  }
});

module.exports = server;
