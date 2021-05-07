const User = require('../models/user')
    , express = require('express')
    , userrouter = new express.Router()
    , bcrypt = require('bcryptjs')


userrouter.post('/users' , async (req , res) => {
    var newuser = new User(req.body);
    try
    {
        await newuser.save();
        return res.status(201).send(newuser);
    }catch (e) {
        return  res.status(500).send("Error creating the user.." + e);
    }
});

userrouter.post('/logIn' , async (req , res) => {
    try
    {
        const user = await User.findOne({ email: req.body.email});
        if(!user) throw new Error ("Error in Logging in....")

        const isValid = bcrypt.compare(req.body.password , user.password);
        if(isValid) return res.status(200).send(user);
        throw new Error("Error in Logging in")
    }catch (e) {
        return  res.status(500).send(e.toString());
    }
});

userrouter.get('/users' , async (req , res) => {
    try
    {
        const usrs  =await User.find({})
        return res.status(200).send(usrs);
    }
    catch(error){
        res.status(500).send("Error getting the list of the users from the database");
    }
});

userrouter.get('/users/:id' , async (req , res) => {
    const userID = req.params.id;
    try
    {
        const user = await User.findById(userID);
        return res.status(200).send(user);
    }
    catch(error){
        return  res.status(500).send("Error getting that user from the database");
    }
});

userrouter.post('/update-users/:id' , async (req , res) => {
    try
    {
        const updates = Object.keys(req.body);

        const validKeys = ['name' , 'email' , 'password' , 'age'];
        const isValidOp = updates.every((update) => { return validKeys.includes(update) });

        if(!isValidOp)  return res.status(400).send('Invalid updates');

        const user = await User.findById(req.params.id);
        if(!user)  return res.status(404).send();
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();

        return res.status(200).send(user);
    }catch (e) {
        return res.status(400).send(e.toString());

    }
});

userrouter.delete('/users/:id' ,  async (req , res) => {
    try
    {
        const  DeletedUSer = await User.findByIdAndDelete(req.params.id);
        if(!DeletedUSer)     return res.status(404).send();
        return res.status(200).send(DeletedUSer);
    }
    catch(e)
    {
        return res.status(500).send();
    }
});

module.exports = userrouter;