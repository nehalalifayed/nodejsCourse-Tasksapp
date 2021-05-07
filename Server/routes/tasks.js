const  Task = require('../models/task')
    , express = require('express')
    , tasksRouter = new express.Router()


tasksRouter.post('/tasks' , async (req , res) => {
    var newTask = new Task(req.body);
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

tasksRouter.get('/tasks' , async (req , res) => {

    try
    {
        const tasks = await Task.find({});
        return res.status(200).send(tasks);
    }catch(error)
    {
        return  res.status(500).send("Error getting the tasks from the db.");
    }
});

tasksRouter.get('/tasks/:id' , async (req , res) => {
    const taskID = req.params.id;
    try
    {
        const task = await Task.findById(taskID);
        return res.status(200).send(task);
    }
    catch(error)
    {
        return res.status(500).send("Error getting that task from the database.");
    }
});

tasksRouter.post('/update-tasks/:id' , async (req , res) => {
    try
    {
        const updates = Object.keys(req.body);

        const validKeys = ['description' , 'completed' ];
        const isValidOp = updates.every((update) => { return validKeys.includes(update) });

        if(!isValidOp)  return res.status(400).send('Invalid updates');
        const task = await Task.findById(req.params.id);
        if(!task)  return res.status(404).send();
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        return res.status(200).send(task);
    }catch (e) {
        return res.status(400).send(e.toString());

    }
});

tasksRouter.delete('/tasks/:id' ,  async (req , res) => {
    try
    {
        const  DeletedTask = await Task.findByIdAndDelete(req.params.id);
        if(!DeletedTask)     return res.status(404).send();
        return res.status(200).send(DeletedTask);
    }
    catch(e)
    {
        return res.status(500).send();
    }
});

module.exports = tasksRouter;