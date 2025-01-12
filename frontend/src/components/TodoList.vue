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

    <div ref="sortableList" class="space-y-2">
      <transition-group>
        <li
          v-for="todo in todos"
          :key="todo._id"
          class="flex flex-col p-2 bg-gray-50 rounded-md shadow-sm"
        >
          <Todo :todo="todo" :deleteTodo="deleteTodo" />
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Sortable from 'sortablejs';
  import Todo from './Todo.vue';
  import NotificationMixin from '../mixins/NotificationMixin.js';

  export default {
    name: 'TodoList',
    mixins: [
      NotificationMixin,
    ],
    components: {
      Todo,
    },
    data() {
      return {
        todos: [],
        tags: [],
        pagination: null,
        newTodo: '',
      };
    },
    provide() {
      return {
        getTags: () => {
          return this.tags;
        },
      }
    },
    methods: {
      async fetchTodos() {
        try {
          const response = await axios.get('/api/todos/search');
          this.todos = response.data.data;
          this.pagination = response.data.meta?.pagination;
        } catch (error) {
          console.error(error);
          this.showSuccess('Erreur lors de la récupération des tâches.');
        }
      },
      async fetchTags() {
        try {
          const response = await axios.get('/api/tags');
          this.tags = response.data;
        } catch (error) {
          console.error(error);
          this.showError('Erreur lors de la récupération des tags.');
        }
      },
      async addTodo() {
        if (this.newTodo.trim() === '') return;
        try {
          const response = await axios.post('/api/todos', { title: this.newTodo });
          this.todos.push(response.data);
          this.newTodo = '';
          this.showSuccess('Tâche ajoutée avec succès.');
        } catch (error) {
          console.error(error);
          this.showError('Erreur lors de l\'ajout de la tâche.');
        }
      },
      async deleteTodo(id) {
        try {
          await axios.delete(`/api/todos/${id}`);
          this.todos = this.todos.filter(todo => todo._id !== id);
          this.showSuccess('Tâche supprimée.');
        } catch (error) {
          console.error(error);
          this.showError('Erreur lors de la suppression de la tâche.');
        }
      },
      async onDragEnd(event) {
        const { oldIndex, newIndex } = event;

        const todos = [...this.todos];
        todos.splice(newIndex, 0, ...todos.splice(oldIndex, 1));
        this.todos = todos;

        try {
          await axios.put('/api/todos/reorder', { todos: this.todos });
          this.showSuccess('Ordre des tâches mis à jour.');
        } catch (error) {
          console.error('Error updating order:', error);
          this.showError('Erreur lors de la mise à jour de l\'ordre.');
        }
      },
    },
    mounted() {
      this.fetchTodos();
      this.fetchTags();

      // Initialiser Sortable
      Sortable.create(this.$refs.sortableList, {
        handle: '.handle',
        animation: 150,
        onEnd: this.onDragEnd,
      });
    }
  };
</script>

<style scoped>
.handle {
  display: flex;
  align-items: center;
}
</style>
