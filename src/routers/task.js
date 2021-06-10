const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    
    const task = new Task({
        ...req.body,                //ES6 operator - fills first two variables with data passed from req
        owner: req.user._id         // to get user id, we can get it from token passed
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch(e) {
        res.status(400).send(e)
    }

    // task.save().then((task) => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})


// GET /tasks?completed=true
// limit  skip -> for Pagination
// GET /tasks?limit=10&skip=1
// limit can be used to limit the no of search results to be dsiplayed in one page
// skip is used to skip that many search results and display from the next search result
// i.e for ex if skip is 2, then 2 search items are ignored, and it will display from 3rd
// GET /tasks?sortBy=
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
       // const tasks = await Task.find({ owner: req.user._id})   // here we are retreiving all the tasks of a particular user. Hence searching for user id
        await req.user.populate({
            path: 'tasks',
            match: {                
                completed: match.completed
            },
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort: {
                    completed: -1
                }
            }
        }).execPopulate() // this is another way of retreivung all the tasks of the user
        res.send(req.user.tasks)

    } catch(e) {
        res.status(500).send()
    }

    // Task.find({}).then((tasks) => {
    //     res.send(tasks)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.get('/tasks/:id', auth,  async (req, res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner: req.user._id })
        // here in findOne, we pass the args which has to be matched for retrieving tasks
        // first arg is task id should be the one we pass in url. Since our var name taking task id from url and task id in model is same,
        // we simply mention _id instead of _id: _id (short hand expression)
        // 2nd arg is the user id as we only have to find those tasks which are owned by currently logged in user

        if(!task) {
            res.status(404).send
        }
        res.send(task)

    } catch(e) {
        res.status(500).send()
    }

    // Task.findById(_id).then((task) => {
    //     if(!task) {
    //         res.status(404).send
    //     }
    //     res.send(task)
    // }).catch(() => {
    //     res.status(500).send()
    // })
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send('Error: Invalid Update')
    }
    try {

        const task = await Task.findOne({ _id: req.params.id, owner : req.user._id})
       

        if(!task) {
            return res.status(404).send()
        }   
        
        updates.forEach((update) => {
            task[update] = req.body[update]
        })

        await task.save()

       // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        
        res.send(task)

    } catch(e) {
        res.status(400).send(e)
    }

})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)

    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = router