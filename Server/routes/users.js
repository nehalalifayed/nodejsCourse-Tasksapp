const User = require('../models/user')
    , express = require('express')
    , userrouter = new express.Router()
    , bcrypt = require('bcryptjs')
    , auth = require('../middlewares/auth')


userrouter.post('/users' , async (req , res) => {
    var newuser = new User(req.body);
    try
    {
        await newuser.save();
        const token = await newuser.generateToken();

        newuser= newuser.toObject();
        delete newuser['tokens'];
        delete newuser.password;

        return res.status(201).send({newuser , token});
    }catch (e) {

        return  res.status(500).send("Error creating the user.." + e);
    }
});

userrouter.post('/users/logIn' , async (req , res) => {
    try
    {
        let user = await User.findOne({ email: req.body.email});
        if(!user) throw new Error ("Error in Logging in....")

        const isValid = bcrypt.compare(req.body.password , user.password);
        if(isValid)
        {
          
            const token = await user.generateToken();
            user= user.toObject();
            delete user['tokens'];
            delete user.password;
          
            return res.status(200).send({user , token});
        }
        throw new Error("Error in Logging in")
    }catch (e) {
        return  res.status(400).send(e.toString());
    }
});

userrouter.post('/users/logout', auth ,  async (req , res) => {
    try
    {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        return res.status(200).send("logged out successfully");
    }catch(e)
    {
        return res.status(500).send("something went wrong");
    }
 });

 userrouter.post('/users/logoutAll', auth ,  async (req , res) => {
    try
    {
        req.user.tokens = [];
        await req.user.save();
        return res.status(200).send("logged out successfully from all sessions.");
    }catch(e)
    {
        return res.status(500).send("something went wrong");
    }
 });

userrouter.get('/users/me', auth ,  async (req , res) => {
   return res.status(200).send(req.user);
});


userrouter.post('/update-users/me' , auth, async (req , res) => {
    try
    {
        const updates = Object.keys(req.body);

        const validKeys = ['name' , 'email' , 'password' , 'age'];
        const isValidOp = updates.every((update) => { return validKeys.includes(update) });

        if(!isValidOp)  return res.status(400).send('Invalid updates');

        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();

        return res.status(200).send(req.user);
    }catch (e) {
        return res.status(400).send(e.toString());

    }
});

userrouter.delete('/users/me' , auth,  async (req , res) => {
    try
    {
        const  DeletedUSer = await User.findByIdAndDelete(req.user._id);
        if(!DeletedUSer)     return res.status(404).send();
        return res.status(200).send(DeletedUSer);
    }
    catch(e)
    {
        return res.status(500).send();
    }
});

module.exports = userrouter;