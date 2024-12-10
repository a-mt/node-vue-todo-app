<template>
  <div>
    <form @submit.prevent="addTodo" class="flex mb-4">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Ajouter une tâche"
        class="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Ajouter
      </button>
    </form>
    <ul>
      <li
        v-for="todo in todos"
        :key="todo._id"
        class="flex items-center justify-between mb-2 p-2 bg-gray-50 rounded-md shadow-sm"
      >
        <div class="flex items-center">
          <input
            type="checkbox"
            v-model="todo.completed"
            @change="updateTodo(todo)"
            class="form-checkbox h-5 w-5 text-blue-600"
          />
          <span
            :class="{
              'line-through text-gray-500': todo.completed,
              'text-gray-900': !todo.completed
            }"
            class="ml-2"
          >
            {{ todo.title }}
          </span>
        </div>
        <button
          @click="deleteTodo(todo._id)"
          class="text-red-500 hover:text-red-700 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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
/* Ajoutez des styles supplémentaires si nécessaire */
</style>
