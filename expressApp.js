const express = require('express');
const app = express();

app.use(express.json());

require('./Server/db/mongoose');  // connect to the database.

const userRouter = require('./Server/routes/users')
    , tasksRouter = require('./Server/routes/tasks')

app.use('/server/uploads' , express.static(__dirname +'/Server/profileImages/'));
app.use(userRouter);
app.use(tasksRouter);

module.exports = app