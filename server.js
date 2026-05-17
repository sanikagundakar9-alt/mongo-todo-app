require('dotenv').config(); // Environment variables load karne
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

// 1. DATABASE CONNECTION (.env madhun link ghet ahot)
const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI)
    .then(() => console.log("Success: MongoDB Cloud sobat connect jhala! 🚀"))
    .catch((err) => console.log("Database connection error: ", err));

// 2. DATABASE SCHEMA
const todoSchema = new mongoose.Schema({
    taskName: String
});
const Todo = mongoose.model('Todo', todoSchema);

// 3. HOME PAGE (Frontend + Styles)
app.get('/', async (req, res) => {
    try {
        const allTasks = await Todo.find({});
        let listItems = '';
        allTasks.forEach((task) => {
            listItems += `
                <div class="task-item">
                    <span>${task.taskName}</span>
                    <form action="/delete-todo" method="POST" style="margin:0;">
                        <input type="hidden" name="taskId" value="${task._id}">
                        <button type="submit" class="delete-btn">Remove</button>
                    </form>
                </div>`;
        });

        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>My Smart Todo</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; margin: 0; display: flex; justify-content: center; align-items: center; }
                    .container { background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 400px; box-shadow: 0px 10px 30px rgba(0,0,0,0.3); }
                    h2 { color: #333; text-align: center; }
                    .input-box { display: flex; gap: 10px; margin-bottom: 25px; }
                    input[type="text"] { flex: 1; padding: 12px; border: 2px solid #eee; border-radius: 8px; font-size: 16px; }
                    .add-btn { background: #667eea; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
                    .task-list { max-height: 350px; overflow-y: auto; }
                    .task-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px; border-left: 5px solid #667eea; }
                    .delete-btn { background: #ff8787; color: white; padding: 6px 12px; border: none; border-radius: 5px; cursor: pointer; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2>📝 My Tasks</h2>
                    <form action="/add-todo" method="POST" class="input-box">
                        <input type="text" name="todoItem" placeholder="What needs to be done?" required>
                        <button type="submit" class="add-btn">Add</button>
                    </form>
                    <div class="task-list">${allTasks.length === 0 ? '<p style="text-align:center; color:#888;">No tasks left!</p>' : listItems}</div>
                </div>
            </body>
            </html>
        `);
    } catch (err) { res.status(500).send("Error!"); }
});

app.post('/add-todo', async (req, res) => {
    const newTodo = new Todo({ taskName: req.body.todoItem });
    await newTodo.save();
    res.redirect('/');
});

app.post('/delete-todo', async (req, res) => {
    await Todo.findByIdAndDelete(req.body.taskId);
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Server: http://localhost:${PORT}`));