const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Load todos from file
const todosFilePath = path.join(__dirname, '../data/todos.json');
const loadTodos = () => {
  const data = fs.readFileSync(todosFilePath, 'utf-8');
  return JSON.parse(data);
};

// Save todos to file
const saveTodos = (todos) => {
  fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
};

// GET all todos
router.get('/', (req, res) => {
  const todos = loadTodos();
  res.json(todos);
});

// POST new todo
router.post('/', (req, res) => {
  const newTodo = req.body;
  const todos = loadTodos();
  todos.push(newTodo);
  saveTodos(todos);
  res.status(201).json(newTodo);
});

// DELETE todo by id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const todos = loadTodos();
  const updatedTodos = todos.filter(todo => todo.id !== id);
  saveTodos(updatedTodos);
  res.status(200).json({ message: 'Todo deleted' });
});

module.exports = router;
