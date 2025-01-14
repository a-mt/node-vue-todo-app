<template>
  <div>
    <!-- Add a new todo -->
    <form class="flex mb-4" @submit.prevent="addTodo">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Ajouter une tâche"
        class="grow w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Ajouter
      </button>
    </form>

    <!-- Filter todos -->
    <div class="flex flex-col mb-4 rounded-md items-stretch">
      <!-- Search -->
      <form @submit.prevent="fetchTodos">
        <label
          for="default-search"
          class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >Search</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            v-model="paramsSearch"
            type="search"
            class="grow w-full px-4 py-2 ps-10 border border-gray-300 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Rechercher un titre"
          />
          <button
            type="submit"
            class="absolute text-xs end-2.5 bottom-1.5 rounded-lg px-4 py-2 bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Go
          </button>
        </div>
      </form>

      <!-- Completed -->
      <div
        class="flex flex border border-gray-300 border-t-0 rounded-b-md relative"
      >
        <label
          class="absolute h-4 text-xs p-1 pl-2 text-gray-400"
          for="paramsCompleted"
        >
          Filtrer par statut
        </label>
        <select
          v-model="paramsCompleted"
          name="paramsCompleted"
          class="text-sm grow p-2 pt-4"
          @change="fetchTodos"
        >
          <option value="">--</option>
          <option value="1">Complété</option>
          <option value="0">Non complété</option>
        </select>
      </div>

      <!-- Tags -->
      <div
        class="flex flex border border-gray-300 border-t-0 rounded-b-md relative"
      >
        <label
          class="absolute h-4 text-xs p-1 pl-2 text-gray-400"
          for="paramsCompleted"
        >
          Filtrer par tag
        </label>
        <select
          v-model="paramsTag"
          name="paramsTag"
          class="text-sm grow p-2 pt-4"
          @change="fetchTodos"
        >
          <option value="">--</option>
          <transition-group>
            <option v-for="tag in tags" :key="tag._id" :value="tag._id">
              {{ tag.title }}
            </option>
          </transition-group>
        </select>
      </div>

      <!-- Sort -->
      <div
        class="flex flex border border-gray-300 border-t-0 rounded-b-md relative"
      >
        <label
          class="absolute h-4 text-xs p-1 pl-2 text-gray-400"
          for="paramsSort"
        >
          Trier par
        </label>
        <select
          v-model="paramsSort"
          name="paramsSort"
          class="text-sm grow p-2 pt-4"
          @change="fetchTodos"
        >
          <option value="">--</option>
          <option value="-priority">Priorité (haute à basse)</option>
          <option value="priority">Priorité inverse (basse à haute)</option>
          <option value="-createdAt">De récent à ancien</option>
          <option value="createdAt">De ancien à récent</option>
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
          :class="{
            'border border-gray-300 border-dashed': todo.isOutsideOrder,
          }"
        >
          <Todo
            :todo="todo"
            :deleteTodo="deleteTodo"
            :hideReorder="hideReorder"
            @deletedTag="deletedTag"
          />
        </li>
      </transition-group>
    </div>

    <!-- Pagination -->
    <div
      v-if="pagination && pagination.totalCount > 0"
      class="mt-8 flex justify-center"
    >
      <Pagination
        :page="pagination.page"
        :pageCount="pagination.pageCount"
        :gotoPage="gotoPage"
      />
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
  components: {
    Todo,
    Pagination,
  },
  mixins: [NotificationMixin],
  provide() {
    return {
      getTagsRef: () => {
        return this.tags;
      },
      refreshTodos: () => {
        this.fetchTodos(null, this.paramsPage);
      },
    };
  },
  data() {
    return {
      todos: [],
      tags: [],
      pagination: null,
      newTodo: '',
      paramsSearch: '',
      paramsPage: '',
      paramsCompleted: '',
      paramsTag: '',
      paramsSort: '',
      hideReorder: false,  // Disable reorder when we sort the results
    };
  },
  created() {
    this.fetchTodos();
    this.fetchTags();
  },
  mounted() {
    // Initialiser Sortable
    Sortable.create(this.$refs.sortableList, {
      handle: '.handle',
      animation: 150,
      onEnd: this.onDragEnd,
    });
  },
  methods: {
    deletedTag(id) {
      if (id == this.paramsTag) {
        this.paramsTag = '';
      }
    },
    gotoPage(i) {
      this.fetchTodos(null, i);
    },
    async fetchTodos(event, page = 1) {
      try {
        const response = await axios.get('/api/todos/search', {
          params: {
            q: this.paramsSearch,
            page,
            completed: this.paramsCompleted,
            tag: this.paramsTag,
            sort: this.paramsSort,
          },
        });
        this.todos = response.data.data;
        this.pagination = response.data.meta?.pagination;
        this.paramsPage = this.pagination?.page || 1;
        this.hideReorder = this.paramsSort != '';

      } catch (error) {
        console.error(error);
        this.showError('Erreur lors de la récupération des tâches.');
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
        const response = await axios.post('/api/todos', {
          title: this.newTodo,
        });
        const todo = response.data;

        // If we add a todo to a sorted list, add it at the end regardless
        // But disable reorder and visually indicate the new todo
        if (this.paramsSort != '' || this.pagination) {
          todo.isOutsideOrder = true;
          this.hideReorder = true;
        }
        this.todos.push(todo);
        this.newTodo = '';
        this.showSuccess('Tâche ajoutée avec succès.');

      } catch (error) {
        console.error(error);
        this.showError("Erreur lors de l'ajout de la tâche.");
      }
    },
    async deleteTodo(id) {
      try {
        await axios.delete(`/api/todos/${id}`);

        const idx = this.todos.findIndex((item) => item._id == id);
        if (idx != -1) {
          this.todos.splice(idx, 1);
        }
        // The page is now empty: reload the page
        if (!this.todos.length) {
          this.gotoPage(this.paramsPage);
        }
        this.showSuccess('Tâche supprimée.');

      } catch (error) {
        console.error(error);
        this.showError('Erreur lors de la suppression de la tâche.');
      }
    },
    async onDragEnd(event) {
      const { oldIndex, newIndex } = event;

      this.todos.splice(newIndex, 0, ...this.todos.splice(oldIndex, 1));
      try {
        await axios.put('/api/todos/reorder', {
          todos: this.todos,
          positionOffset: this.pagination?.offset,
        });
        this.showSuccess('Ordre des tâches mis à jour.');

      } catch (error) {
        console.error('Error updating order:', error);
        this.showError("Erreur lors de la mise à jour de l'ordre.");
      }
    },
  },
};
</script>

<style scoped>
.handle {
  display: flex;
  align-items: center;
}
</style>
