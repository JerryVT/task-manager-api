const jwt = require('jsonwebtoken')
const User = require('../models/user')      //need access to model where user data is present

// Authorization is going to be handled with the help of Headers -> Authorization Headers where we will be passing the token key after 'Bearer'

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')        //to remobe Bearer part
        console.log(token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded);
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
        // first part is to fetch data if present and second is for comparison
        if(!user) {
            throw new Error()
        }

        req.user = user
        next()
        // next is only required here if authnetication is successful

    } catch(e) {
        res.status(401).send({error: 'Please Authenticate.'})
        // here next() is not required as authentcation failed0
    }

}

module.exports = auth