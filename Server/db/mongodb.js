const {MongoClient , MongoID} = require ('mongodb');

var connectionURL = "mongodb://127.0.0.1:27017"
var database = 'task-app';

MongoClient.connect(connectionURL ,{useNewUrlParser: true} ,(error , client)=>{
    if(error)  return console.log(error)
    
    const db = client.db(database);

    // db.collection('users').insertOne({
    //     name:"nehal" , age:24
    // } , (error , result) => 
    // {
    //     if (error) return console.log(error);
    //     console.log(result.ops)  // array of documents that got inserted;
    // });

    db.collection('users').findOne({age:24} , (error , userDoc) => 
    {
        if(error) return console.log(error);

        console.log(userDoc);
    });


})