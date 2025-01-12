<template>
  <div>
    <!-- Add a new todo -->
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

    <!-- Filter todos -->
    <div class="flex flex-col mb-4 rounded-md  items-stretch">

      <!-- Search -->
      <form @submit.prevent="fetchTodos">
        <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
          <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input
            v-model="paramsSearch"
            type="search"
            class="grow block w-full px-4 py-2 ps-10 border border-gray-300 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rechercher un titre"
          />
          <button
            type="submit"
            class="absolute text-xs end-2.5 bottom-1.5 rounded-lg px-4 py-2 bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Go
          </button>
        </div>
      </form>

      <!-- Completed -->
      <div class="flex flex border border-gray-300 border-t-0 rounded-b-md relative">
        <label class="absolute h-4 text-xs p-1 pl-2 text-gray-400" for="paramsCompleted">
          Filtrer par statut
        </label>
        <select name="paramsCompleted" class="text-sm grow p-2 pt-4" v-model="paramsCompleted" @change="fetchTodos">
          <option value="">Tout</option>
          <option value="1">Complété</option>
          <option value="0">Non complété</option>
        </select>
      </div>
    </div>

    <!-- List of todos -->
    <div ref="sortableList" class="mt-8 space-y-2">
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

    <!-- Pagination -->
    <div class="mt-8 flex justify-center" v-if="pagination && pagination.pageCount > 1">
      <Pagination :page="pagination.page" :pageCount="pagination.pageCount" :gotoPage="gotoPage" />
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Sortable from 'sortablejs';
  import Todo from './Todo.vue';
  import Pagination from './Pagination.vue';
  import NotificationMixin from '../mixins/NotificationMixin.js';

  export default {
    name: 'TodoList',
    mixins: [
      NotificationMixin,
    ],
    components: {
      Todo,
      Pagination,
    },
    data() {
      return {
        todos: [],
        tags: [],
        pagination: null,
        newTodo: '',
        paramsSearch: '',
        paramsPage: null,
        paramsCompleted: '',

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
      gotoPage(i) {
        if (i == this.paramsSearch) {
          return;
        }
        this.paramsPage = i;
        this.fetchTodos();
      },
      async fetchTodos() {
        try {
          const response = await axios.get('/api/todos/search', {
            params: {
              q: this.paramsSearch,
              page: this.paramsPage,
              completed: this.paramsCompleted,
            }
          });
          this.todos = response.data.data;
          this.pagination = response.data.meta?.pagination;
          this.paramsPage = this.pagination.page || 1;

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
