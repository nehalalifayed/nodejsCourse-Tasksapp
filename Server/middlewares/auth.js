const User = require('../models/user')
, jwt = require('jsonwebtoken')

 const auth  = async (req , res , next)  => {
        try
        {
            const token = req.headers['authorization'];
            const decodedToken = await jwt.verify(token, process.env.JWT_SECRETKEY);
            const user = await User.findOne({_id: decodedToken._id , 'tokens.token': token});
        
            if(!user) throw new Error();
            req.user = user;
            req.token = token;
            next();
        }catch(e)
        {
            return res.status(500).send('Missing token')
        }
        }
        



module.exports = auth