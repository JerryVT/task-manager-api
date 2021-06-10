const mongoose = require('mongoose')
const validator = require('validator')

const TaskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
       
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,       // As we are going to pass the id of the owner of users. hencew we are using type ObjectID
        default: true,
        ref: 'User'     //ref is reference used to provide a ref from this field to another model
                        // the name we give as ref should be the name provided in mongoose.model() which is the model name
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task',  TaskSchema        //automatically change Task to tasks or User to users
    
)


// const task = new Task({
//     description: 'Learn Piano'
// })
// task.save().then(() => {
//     console.log(task);
// }).catch((error) => {
//     console.log('Error',error);
// })

module.exports = Task