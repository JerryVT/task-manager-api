const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')

const User = require('../models/user')

// Loading middleware file into the projrct
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
  
    try {                         // try and catch is used to handle error as when we are using async fns, promises are involved
      await user.save()

      sendWelcomeEmail(user.email, user.name)   //calls fn to send welcome mail to new joiners

      const token = user.generateAuthToken() //creating token
      res.status(201).send({user, token})
    } catch(e) {
      res.status(400).send(e)
    }
  
   
  
  //   user.save().then((user) => {
  //         res.status(201).send(user)
  //   }).catch((e) => {
  //         //res.status(400)     //set 400
  //         //res.send(e)
  //         res.status(400).send(e) //chaining above statements
  //   }) 
    
  })

  // While adding middleware to specific route habdler, the middleware fn needs to be added as second argument in routers's path 
  router.get('/users/me', auth, async (req, res) => {
  
  
    //   try {
    //       const users =  await User.find({})
    //       res.send(users)
  
    //   } catch(e) {
    //       res.status(500).send()
    //   }
  
    //   User.find({}).then((users) => {         //Model.find() where here User is the model
    //       res.send(users)
    //   }).catch((e) => {
    //       res.status(500).send()
    //   })
      
      res.send(req.user)
  })

  // For logging out one session
  router.post('/users/logout', auth , async(req, res) => {   //passing auth as users have to be authenticarted for logout

    try {
        // we have to remove the token from token array
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
    } catch (e) {
        res.status(500).send()
    }
  })

  // Logging out all the sessions of the profile
  router.post('/users/logoutAll', auth, async(req, res) => {
      try {
        req.user.tokens = []        // assigning it to empty array so all sessions have to be deleted
        await req.user.save()       // now saving the changes done
        res.send()
      } catch(e) {
          res.status(500).send()

      }
  })
  
 // No longer required as we have users/me 
//   router.get('/users/:id', async (req,  res) => {           //express has router handlers
//       //mongoose converts string ids to Object IDs
//       // after implementing await and async to commented below
//       const _id = req.params.id
//       try {
//           const user = await User.findById(_id)
          
//           if(!user) {         //in case of empty user
//               return res.status(404).send()
//           }
  
//           res.send(user)  // in case of non empty
//       } catch(e) {
//           res.status(500).send()
//       }
  
  
      // const _id = req.params.id
      // User.findById(_id).then((user) => {
      //     if(!user) {
      //         return res.status(404).send()
      //     }
      //     res.send(user)
      // }).catch((e) => {
      //     res.status(500).send()
      // })
      
// })

  // Logging in 
  router.post('/users/login', async (req, res)=> {
      try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // await for async operation
        // it eill retrive the user
        //findByCredential is not a built in fn but user defined
        // User is used as we are working on a collection of data

        const token = await user.generateAuthToken()
        // here we are giving user and not User as we are working on a specific instance (one user)
        // generateAuthToken is a user defined fn

        res.send({user: user, token})
      } catch (e) {
            res.status(400).send()
      }
  })
  
  router.patch('/users/me',auth, async (req, res) => {
      // the below lines is to check if the update given is for a porperty which is not present
      const allowedUpdates = ['name', 'email', 'password', 'age']
      const updates = Object.keys(req.body)        // to convert from object to array of properties
      const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
  
      if(!isValidOperation) {
          return res.status(400).send('Error: Invalid Update')
          // since return is added, no need for else statement
      }
  
      try {

        // const user = await User.findById(req.params.id)
        
        updates.forEach((update) => req.user[update] = req.body[update]) 
        await req.user.save()

        // if we are using the statement commented below, it will also perform the same operation
        // the diff is that the below stmnt directly updates the database and hence mongoose wont work
        // Hence we have given the above code so that middleware can work


        //   const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
         
        //   if(!user) {                    // no need as we know user is logged in
        //       res.status(404).send()
        //   }
          res.send(req.user)
      } catch(e) {
          res.status(400).send(e)
      }
  })
  
  router.delete('/users/me', auth, async (req, res) =>{
      try {
        //   const user = await User.findByIdAndDelete(req.user._id)   //since we are passing auth, we can access user._id
  
        //   if(!user) {
        //       return res.status(404).send()
        //   }
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
          res.send(req.user)
      } catch(e) {
          res.status(500).send(e)
  
      }
  })

  const upload = multer({
   // dest: 'avatars',     // definesa where the file has to be stored
    limits: {
      fileSize: 1000000
    },
    fileFilter( req, file, callback) {
      if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return callback(new Error('Please return an image'))
    }

    callback(undefined, true)
  }
  })

  router.post('/users/me/avatar', auth, upload.single('avatar'),async (req, res) => { //auth before upload as it has to be authenticated first
    // both auth and upload which is part of multer are middleware
    // (req, res) wont have to access to file as multer runs first
    // removing entry dest which specifies where data need to be stored makes the file passed accessbile
    // so multer livb wont be saving the file in folder avatar
   // req.user.avatar = req.file.buffer //Commenting as now data comes from sharp

   const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()

   req.user.avatar = buffer
    await req.user.save()   // saving the content in db
    res.send()
  }, (error, req, res, next) => {                 //fn to handle error
    res.status(400).send({error: error.message})  // message displayed whioch is coming on error object
})

//Route to handle deleting the avatar
router.delete('/users/me/avatar', auth, async(req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if(!user || !user.avatar) {
      throw new Error()
    }

    res.set('Content-Type', 'image/png')   //setting resposne header
    // it requires key value pair
    res.send(user.avatar)

  } catch (e) {
    res.status(404).send()
  }
})

module.exports = router