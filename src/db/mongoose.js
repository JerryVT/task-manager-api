const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
// mongoose.connect is similar to MongoClient.connect
// some differences are, in the url itself, we specify the database name
// after db name, within { } we will specify the properties
// useCreateIndex is for creating index values

