<template>
    <div>
      <form @submit.prevent="addTodo">
        <input v-model="newTodo" placeholder="Ajouter une tâche" />
        <button type="submit">Ajouter</button>
      </form>
      <ul>
        <li v-for="todo in todos" :key="todo._id">
          <input type="checkbox" v-model="todo.completed" @change="updateTodo(todo)" />
          <span :style="{ textDecoration: todo.completed ? 'line-through' : 'none' }">
            {{ todo.title }}
          </span>
          <button @click="deleteTodo(todo._id)">Supprimer</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'TodoList',
    data() {
      return {
        todos: [],
        newTodo: ''
      };
    },
    methods: {
      async fetchTodos() {
        try {
          const response = await axios.get('/api/todos');
          this.todos = response.data;
        } catch (error) {
          console.error(error);
        }
      },
      async addTodo() {
        if (this.newTodo.trim() === '') return;
        try {
          const response = await axios.post('/api/todos', { title: this.newTodo });
          this.todos.push(response.data);
          this.newTodo = '';
        } catch (error) {
          console.error(error);
        }
      },
      async updateTodo(todo) {
        try {
          await axios.patch(`/api/todos/${todo._id}`, { completed: todo.completed });
        } catch (error) {
          console.error(error);
        }
      },
      async deleteTodo(id) {
        try {
          await axios.delete(`/api/todos/${id}`);
          this.todos = this.todos.filter(todo => todo._id !== id);
        } catch (error) {
          console.error(error);
        }
      }
    },
    mounted() {
      this.fetchTodos();
    }
  };
  </script>
  
  <style scoped>
  form {
    margin-bottom: 20px;
  }
  input[type="text"] {
    padding: 8px;
    width: 200px;
  }
  button {
    padding: 8px 12px;
    margin-left: 10px;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    margin: 10px 0;
  }
  </style>  