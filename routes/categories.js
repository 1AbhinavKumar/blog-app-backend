const router = require('express').Router();
const Category = require('../models/Category');

// post categories 
router.post("/", async(req,res)=>{
    const newCateg = new Category(req.body);
    try{
        const savedCateg = await newCateg.save();
        res.status(200).json(savedCateg);
    }catch(err){
        res.status(500).json(err);
    }
})

// get categories 
router.get("/", async(req,res)=>{
    try{
        const categ = await Category.find();
        res.status(200).json(categ);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;