//CRUD Create Read Update Delete

// const mongodb = require('mongodb')

// monogodb is an object
// const MongoClient = mongodb.MongoClient         //gives access to mongodb fn which is required to do CRUD operations
// const ObjectID = mongodb.ObjectID

const {MongoClient, ObjectID} = require('mongodb')

//we have to define connection url and database we are going to connect to
const connectionUrl = 'mongodb://127.0.0.1:27017'       // provided by mongodb
const databaseName = 'task-manager'

// const id = new ObjectID()
// console.log(id.id.length);
// console.log(id.toHexString().length);

MongoClient.connect(connectionUrl, {useNewUrlParser: true}, (error, client) => { // useNewUrlParser set as true is required for the url given above to be parsed correctly
    //the callback fn which is going to be defined here is called once it is connected to db
    // error -> when error occurs in connecting
    if(error) {
        return console.log('Unable to connect to database!!!');
    }
        // console.log('Connected to database');
        // when checking logs of mongodb it can be seen that more no of connections are open even though only one connect was specified
        // this helps nodejs to communicate quickly with mongodb when it is trying to perform a lot of operations at the same time

        const db = client.db(databaseName)      //this call returns a reference of the database which can be used to manipulate the db

        // db.collection('users').insertOne({
        //     name: 'Jerry',
        //     age: 26
        // }, (error, result) => {     // this is the callback to get executed
        //     if(error) {
        //         return console.log('Unable to insert');
        //     }

        //     console.log(result.ops);        //ops is an array of documents and we are dumping it into console for now

        // })

        // db.collection('users').insertOne({
        //     name: 'Vikram',
        //     age: 26
        // }, (error, result) => {     // this is the callback to get executed
        //     if(error) {
        //         return console.log('Unable to insert');
        //     }

        //     console.log(result.ops);        //ops is an array of documents and we are dumping it into console for now

        // })

        // db.collection('users').insertMany([
        //     {
        //          name: 'Jess',
        //         age: 25
        //     }, {
        //         name: 'Adnan',
        //         age: 26
        //     }
        // ], (error, result) => {
        //     if(error) {
        //         return console.log('Unable to insert');
        //     }
        //     console.log(result.ops);
        // })

        // db.collection('tasks').insertMany([
        //     {
        //         description: 'Water Plants',
        //         completed: false
        //     },
        //     {
        //         description: 'Wash clothes',
        //         completed: true
        //     },
        //     {
        //         description: 'Clean room',
        //         completed: false
        //     }
        // ], (error, result) => {
        //     if (error) {
        //         return console.log('Unable to insert')
        //     }

        //     console.log(result.ops);
        // })

        
        // Fetching data
        // db.collection('users').findOne({name: 'Adnan' }, (error, user) => { 
        // // findOne accepts two required arguments. First one is the object which is used to specify our search criteria
        // // second is a callback function which is executed once the criteria is met
        //     if(error) {
        //         return console.log('Unable to Fetch')
        //     }

        //     console.log(user)
        //     // returns n ull if no entry is found
        // })

        // // When the search criteria is an object id
        // db.collection('users').findOne({_id: new ObjectID("6069fd8a6225c153784fbc81") }, (error, user) => { 
        //     // _id is required as it is how it is saved in mongodb
        //     // to provide Object ID in a valid way, we need to call function ObjectID which is the basic way
        //     // if not passed like above, it will result in result as null

        //         if(error) {
        //             return console.log('Unable to Fetch')
        //         }
    
        //         console.log(user)
        //         // returns n ull if no entry is found
        // })


        // // retrieving multiple items
        // db.collection('users').find({age: 26}).toArray((error, user) => { 
        // // here 'find' doesnt take any callback method as argument unlike in findOne,insert
        // // what we get back as a return value is actually a cursor and cursor is not the data we asked for
        // // but cursor is a pointer to the data we are looking for
        // // on this cursor, differentfunctions can be performed such as counting the no of documents, finding min or max, converting the data of documents to array 
        // if(error) {
        //     return console.log('Unable to Fetch')
        // }

        // console.log(user)
        // // returns n ull if no entry is found
        
        // })

        // db.collection('users').find({age: 26}).count((error, finalCount) => {
        //     // to count no of documents matching query...no need to fetch them into a variable
        //     console.log(finalCount);
        
        // }) 

        // db.collection('tasks').find({completed: false}).toArray((error, tasks) => {
        //     console.log(tasks);
        
        // })

        // Updating the data
        //  Updating a single collection
        // db.collection('tasks').updateOne({
        //     _id: new ObjectID("6069ff135571c1540842f073")
        // }, {
        //     $set: {                                         //https://docs.mongodb.com/manual/reference/operator/update/
        //         description: "Water the Plants"
        //     }
        // }).then((result) => {
        //     console.log(result);
        // }).catch((error) => {
        //     console.log(error);
        // })

        // Updating multiple collections
        // db.collection('tasks').updateMany({
        //     completed: false
        // }, {
        //     $set: {
        //         completed: true
        //     }
        // }).then((result) => {
        //     console.log(result);
        // }).catch((error) => {
        //     console.log(error);
        // })

        // Deleting the data
            // Deleting mulltiple items
        // db.collection('users').deleteMany({
        //     age: 24
        // }).then((result) => {
        //     console.log(result);
        // }).catch((error) => {
        //     console.log(error);
        // })

            //delete single item
        db.collection('tasks').deleteOne({
            description: "Clean room"
        }).then((result) => {
            console.log(result);
        }).catch((error) => {
            console.log(error);
        })


})



