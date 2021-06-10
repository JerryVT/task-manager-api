const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = mongoose.Schema({
    name: {                 // here we are creasting each item as an object which specifies type and validation rules if any
        type: String,
        required: true,  // https://mongoosejs.com/docs/validation.html#validation
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email id')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 7,
        validator(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value<0) {
                throw new Error('Age must be a positive no')
            }
        }
    }, 
    tokens: [{
        token: {
           type: String,
        required: true
        }
    }],
    avatar: {
        type: Buffer        //allow us to store binary image data in the database alongside user
        // allow us to store buffer with binary image data in the database
        // no need of validation as it is takrn care by multer

    }
}, {
    timestamps: true
})

// Each user is having their own tasks.
// In case of tokens for each login, we had use an array to hold all the token sessions
// But this cant be done in case of set of tasks assugned to them. This is because tasks are a separate collection
// hence, we use the concept called virtual property
// virtual property is not actual data stored in the database
// It is a relationship between two entities
// we arte not changing any data in virtual

userSchema.virtual('tasks', {       //we pass two args - name of virtual property and object for configuring the individual field
    ref: 'Task',            //the diff of rel here and in tasks in model is in tasks, the ref 'User' is saved in db. But here, it is not saved
    localField:'_id',          // local field is where local data is stored, ie the user ID    
    foreignField: 'owner'   //foreignField is the name of the fiels in the other thing (task class)
    // here we can summarize that a rel is created between _id of user collections and owner field of collection 'task' mentioned in ref field
})

userSchema.methods.toJSON = function() {
    const user = this       // so that we can use user instead of accessing data using 'arrow function
    const userObject = user.toObject()  //a raw object which contains only the required user profile
                        // toObject() is provided ny Mongoose

    // When res.send() is used, JSON.stringify() gets called on user
    // using toJSON, we dont have to explicitly call this snipped every time data is displayed 

    
    delete userObject.password          //deleting as not required to displayed
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

// statics methods are accessible on models and also called model methods
// our methods (like on defined below) are accessible on the instances, hence called instance methods

userSchema.methods.generateAuthToken = async function() {
    const user = this       // to use current usre considered, this can be done to use user instead of this when accessing
    const token = jwt.sign({_id: user._id.toString() }, process.env.JWT_SECRET)
        // user._id is an objewct id and jwt expects a string

    user.tokens = user.tokens.concat({token})   //short hand syntac as name is same in both
    await user.save()     
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})    //using shorthand epxression as both object field and param passed have the same name

    if(!user) {
        throw new Error('Unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new Error('Unable to login')
    }

    return user 
}

// mongoose supports what is called middleware
// this is an ex where some changes have to be made before the data can be saved to the database
// pre means to be done before an action.. simiilarly we also have post

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this   // to access the user data

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()      // next() is called once our work is done. If not given, then the program will not move further
})
// Password hashing works everytime and there is no need to call again. This is because of middleware

//when creating a model, an object havbing the properties can be passed after name or the schema
// in case of first, mongoose automatically considers the object as the schema
// in the second case, we pass the schema after declaring as a paramerter to the model

// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
     await Task.deleteMany({ owner : user._id})
    next()
})

const User = mongoose.model('User', userSchema)  // creates a model on what all fields are there in the table, simialr to create table command in sql
    

// const me = new User({       // creating a constructor to pass the values. User is a fn which acceots the value to store
    //     name: 'Jerry',
    //     age: 26
    // })
    
    // const me = new User({
    //     name: '   Adnan',
    //     email: 'Adnan@Mail.com',
    //     password: '   Password123  ',
    //     age: 25
    // })
    
    // me.save().then(() => {       // save is used to add the content in table. then and catch are promises to handle success or failure
    //     console.log(me);
    // }).catch((error) => {
    //     console.log('Error', error); // when collection is created, a __v fiels is also created which tells the version
    // })
    

module.exports = User