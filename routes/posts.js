const router = require("express").Router();

const User = require("../models/User"); // import the user schema
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

// create a new post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update the post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You are not authorized to perform this action");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json("Post has been deleted ");
      } catch (err) {
        res.status(500).json(err);
        console.log(err); 
      }
    } else {
      res.status(401).json("You are not authorized to delete this post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all post 
router.get("/", async (req, res) => {
    const username = req.query.user;  // query will look at questionmark(?) in url.
    const categoryname = req.query.category;
    try {
        let posts; 
        if (username){
            posts = await Post.find({username}); 
        }else if (categoryname){
            posts = await Post.find({categories:{
                $in:[categoryname],
            }})
        }else{
            posts = await Post.find(); 
        }
        res.status(200).json(posts)

    } catch (err) {
      res.status(500).json(err);
    }
  });

module.exports = router;
