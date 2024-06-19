const router = require("express").Router();

const User = require("../models/User");
const bcrypt = require('bcrypt');

// Register

router.post("/register", async (req, res) => {
  // async func i.e we are using try and catch
  try {
    const salt = await bcrypt.genSalt(10);  // used for encrypting the password . 
    const hashedPass = await bcrypt.hash(req.body.password,salt);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    });

    const user = await newUser.save(); 
    res.status(200).json(user); 
  } catch (err) {
    res.status(500).json(err); // res -> responese the status error
  }
});

// Login 

router.post("/login", async(req,res)=>{
  try {
    const user = await User.findOne({ username: req.body.username });
    // console.log(user)
    if (!user) {
        return res.status(400).json("wrong Username");
      }

      // !user && res.status(400).json("wrong credentials");   here as we are not returning that's why it is throwing error 'ERR_HTTP_HEADERS_SENT'


    const validate = await bcrypt.compare(req.body.password, user.password);
    // console.log(validate)
    if (!validate) {
      return res.status(400).json("Invalid Password");
    }
    
    const {password,  ...others} = user._doc;  // this line is used to hide the password from the database . all the informations are in user._doc itself user contains lot of other informations that we don't need . 

    res.status(200).json(others)
  } catch(err){
    res.status(500).json(err);
  }
});


module.exports = router ;