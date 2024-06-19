const router = require("express").Router();

const User = require("../models/User"); // import the user schema
const Post = require('../models/Post');
const bcrypt = require("bcrypt");

// Updating the account

router.put("/:id", async (req, res) => {
  // using the user id to find the user
  if (req.body.userId === req.params.id) {
    // if userId equals params id i.e url_id then update the user info else return error message
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body, // set all the values in the body
        },
        { new: true }
      ); // if you want to see updated version after sending the req or else it will show the previous val but the data will be updated on the db so if we need to see the curr changes use new true
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can only update your account !!");
  }
});

// Delete the account
router.delete("/:id", async (req, res) => {
  // using the user id to find the user
  if (req.body.userId === req.params.id) {
    // if userId equals params id i.e url_id then update the user info else return error message
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({username:user.username}) // we need to delete all the post by that user also . 
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found ");
    }
  } else {
    res.status(401).json("You can only update your account !!");
  }
});

// Get user 
router.get("/:id", async(req,res)=>{
    try{
        const user=await User.findById(req.params.id); 
        const {password, ...others} = user._doc;
        res.status(200).json(others); 
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
