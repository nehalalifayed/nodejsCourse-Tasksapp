const  Task = require('../models/task')
    , express = require('express')
    , tasksRouter = new express.Router()
    , auth = require('../middlewares/auth')


tasksRouter.post('/tasks' , auth , async (req , res) => {
    const newTask = new Task({... req.body , author: req.user._id});
    try
    {
        await  newTask.save();
        return res.status(201).send(newTask);
    }
    catch(error)
    {
        return res.status(500).send("Error creating the task.." + error);
    }
});

tasksRouter.get('/tasks' , auth , async (req , res) => {

    try
    {
        const tasks = await Task.find({author: req.user._id});
        return res.status(200).send(tasks);
    }catch(error)
    {
        return  res.status(500).send("Error getting the tasks from the db.");
    }
});

tasksRouter.get('/tasks/:id' , auth , async (req , res) => {
    const taskID = req.params.id;
    try
    {
       const task = await Task.findOne({_id: taskID , author: req.user._id});
        return res.status(200).send(task);
    }
    catch(error)
    {
        return res.status(500).send("Error getting that task from the database.");
    }
});

tasksRouter.post('/update-tasks/:id' , auth , async (req , res) => {
    try
    {
        const task = await Task.findOne({ _id: req.params.id , author: req.user._id});

        if(!task)  return res.status(404).send();


        const updates = Object.keys(req.body);
        const validKeys = ['description' , 'completed' ];
        const isValidOp = updates.every((update) => { return validKeys.includes(update) });

        if(!isValidOp)  return res.status(400).send('Invalid updates');
        
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        return res.status(200).send(task);
    }catch (e) {
        return res.status(400).send(e.toString());

    }
});

tasksRouter.delete('/tasks/:id' , auth ,   async (req , res) => {
    try
    {
        const  DeletedTask = await Task.findOneAndDelete({ _id: req.params.id, author: req.user._id});
        if(!DeletedTask)     return res.status(404).send();
        return res.status(200).send(DeletedTask);
    }
    catch(e)
    {
        return res.status(500).send();
    }
});

module.exports = tasksRouter;