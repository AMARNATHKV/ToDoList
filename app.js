const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let tasks = [];


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.get('/tasks', (req, res) => {
  res.json(tasks);
});


app.post('/tasks', (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ message: 'Task field is required' });
  }

  const newTask = {
    id: tasks.length + 1,
    task,
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    tasks[index].task = req.body.task; // Update task text
    res.json(tasks[index]);
  } else {
    res.status(404).json({ message: `Task with ID ${id} not found` });
  }
});


// Route to delete a task (DELETE)
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(task => task.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    res.sendStatus(204); // No content
  } else {
    res.status(404).json({ message: `Task with ID ${id} not found` });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
