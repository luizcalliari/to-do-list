// Define the TodoList class

class TodoList {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.todoListElement = document.getElementById('todoList');
    this.addTodoForm = document.getElementById('addTodoForm');
    this.todoInput = document.getElementById('todoInput');

    this.addTodoForm.addEventListener('submit', this.handleAddTodo.bind(this));

    this.fetchTodos();
  }

  async fetchTodos() {
    try {
      const response = await fetch(this.apiUrl);
      const todos = await response.json();
      this.renderTodos(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  }

  async addTodo(title) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, completed: false }),
      });
      const newTodo = await response.json();
      this.renderTodoItem(newTodo);
      this.todoInput.value = '';
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }

  async handleAddTodo(event) {
    event.preventDefault();
    const title = this.todoInput.value.trim();
    if (title) {
      await this.addTodo(title);
    }
  }

  renderTodos(todos) {
    this.todoListElement.innerHTML = '';
    todos.forEach(todo => {
      this.renderTodoItem(todo);
    });
  }

  renderTodoItem(todo) {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => this.updateTodoCompletion(todo));
    const title = document.createElement('span');
    title.textContent = todo.title;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', () => this.deleteTodoItem(todo.id));
    li.appendChild(checkbox);
    li.appendChild(title);
    li.appendChild(deleteButton);
    this.todoListElement.appendChild(li);
  }

  async updateTodoCompletion(todo) {
    try {
      const response = await fetch(`${this.apiUrl}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...todo, completed: !todo.completed }),
      });
      const updatedTodo = await response.json();
      todo.completed = updatedTodo.completed;
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }

  async deleteTodoItem(todoId) {
    try {
      const response = await fetch(`${this.apiUrl}/${todoId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const li = document.querySelector(`li[data-id="${todoId}"]`);
        li.remove();
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }
}

// Usage example
const apiBaseUrl = 'https://api.example.com/todos';
const todoList = new TodoList(apiBaseUrl);

