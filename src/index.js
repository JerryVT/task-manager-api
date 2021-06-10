const express = require('express')

require('./db/mongoose')                // for connecting mongoose to Mongo

// loading User model
const User = require('./models/user')   
const Task = require('./models/task')


// loading router files for routing
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
const port = process.env.PORT || 3000

const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits: {
        fileSize: 10000000
    },
    fileFilter(req, file, cb) {     //req isa the req made, file is an object having data bout the file to be uplaoded and cb is the callback fn
        if (file.originalname.endsWith('.pdf')) {       //checks the end of file name
            // originalname and endWith are part of multer
            return cb(new Error('You have uplaoded a PDF'))
        }
        else if(file.originalname.match(/\.(doc|docx)$/)) { //match is used when we have to give regular expression
            return cb(new Error('You have uploaded a doc/docx file'))
        }

        cb(undefined, true)
        

        // cb(new Error('File must be a PDF'))
        // cb(undefined, true)
        // cb(undefined, false)

    }
})
// app.post('/upload',upload.single('upload'), (req,res) => {
//     res.send()
// })

// const errorMiddleware = (req, res, next) => {   //Creating our middleware
//     throw new Error('From my middleware')
// }

// app.post('/upload',errorMiddleware, (req,res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({error: error.message})
// })

app.post('/upload',upload.single('upload'), (req,res) => {
    res.send()
}, (error, req, res, next) => {         // we added another fn to the end of route handler call app.post for hadnling error
    // this fn needs to have this call signature, this set of arguments
    res.status(400).send({error: error.message})
})

// middleware functions
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET methods are disabled')
//     } else {
//         next()
//     }
// })
// middleware fiunctions have to be defined before other route fns
// Always make sure that if some route transitions has to happen, next() needs to be added. No args need to be passed

// Middleware Ex: 2
// To handle page directs which are under maintenance
// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back in sometime!!!')
// })


app.use(express.json())   //to parse json

app.use(userRouter)

app.use(taskRouter) // tells express to use router from here also. if not igven route wont work

// const router = new express.Router()     //creating new router in Express
// router.get('/test', (req, res) => {
//     res.send('Test')
// })
// app.use(router)                        // Registering the router with our app so that it will be accessible

//
// Without middleware: new request -> run route handler
//
// With middleware: new request -> do something -> run route handler


app.listen(port, () => {
    console.log('Server is up on port ' + port);
})




// const main = async () => {
//     // const task = await Task.findById('60bcd1c255d803481fa5e80e')
//     // await task.populate('owner').execPopulate()         // populate allows us to populate data from a relationship
//     // //execPopulate is used to execute the populate
//     // console.log(task.owner);

//     const user = await User.findById('60bccf8021896b475c92c75e')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks);
// }

// main()

