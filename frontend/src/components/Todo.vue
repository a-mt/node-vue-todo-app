<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center">

      <!-- Drag handle -->
      <span class="handle cursor-move mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 8h16M4 16h16" />
        </svg>
      </span>

      <!-- Checkbox -->
      <input
        type="checkbox"
        v-model="todo.completed"
        @change="updateTodo(todo)"
        class="form-checkbox h-5 w-5 shrink-0 text-blue-600"
      />

      <!-- Title -->
      <div class="flex flex-col self-baseline">
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
    </div>

    <!-- Action buttons -->
    <div class="flex">
      <button
        @click="this.showTagsDialog = true"
        class="text-grey-500 hover:text-grey-700 focus:outline-none pr-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 8v4.172a2 2 0 0 0 .586 1.414l5.71 5.71a2.41 2.41 0 0 0 3.408 0l3.592 -3.592a2.41 2.41 0 0 0 0 -3.408l-5.71 -5.71a2 2 0 0 0 -1.414 -.586h-4.172a2 2 0 0 0 -2 2z"></path>
          <path d="M18 19l1.592 -1.592a4.82 4.82 0 0 0 0 -6.816l-4.592 -4.592"></path>
          <path d="M7 10h-.01"></path>
        </svg>
      </button>

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
    </div>
  </div>

  <ul class="flex flex-wrap ml-4 pl-10 mt-1">
    <li v-for="tag in this.todo.tags">
        <span class="text-xs rounded-full font-medium me-2 px-2.5 py-0.5 rounded border"
              :class="['bg-blue-100', 'text-blue-800', 'dark:bg-blue-900', 'dark:text-blue-30']">
            {{ tag._id }} {{ tag.color }} {{ tag.title }}
        </span>
    </li>
  </ul>

  <div v-if="showTagsDialog">
    <div class="fixed inset-0 z-50" @click="showTagsDialog = null">
      <div class="bg-black opacity-50"></div>
      <div class="flex justify-center">
        <div class="bg-white p-6 rounded shadow-lg" @click.stop="">
          <TagSelect :todo="todo" :toggleTag="toggleTag" />
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import axios from 'axios';
  import Sortable from 'sortablejs';
  import TagSelect from './TagSelect.vue';
  import NotificationMixin from '../mixins/NotificationMixin.js';

  export default {
    name: 'Todo',
    mixins: [
      NotificationMixin,
    ],
    components: {
      TagSelect,
    },
    props: {
      todo: Object,
      deleteTodo: Function,
    },
    data() {
      return {
        showTagsDialog: false,
      }
    },
    methods: {
      async updateTodo(todo) {
        try {
          await axios.patch(`/api/todos/${todo._id}`, { completed: todo.completed });
          this.showNotification('Tâche mise à jour.', 'bg-green-100 text-green-700');
        } catch (error) {
          console.error(error);
          this.showNotification('Erreur lors de la mise à jour de la tâche.', 'bg-red-100 text-red-700');
        }
      },
      async toggleTag(tag) {
        const ntags = this.todo.tags.length;
        const tags = this.todo.tags.filter(item => item._id != tag._id);

        if (ntags != tags.length) {
          this.todo.tags = tags;
        } else {
          this.todo.tags = [...this.todo.tags, tag];
        }

        try {
          await axios.patch(`/api/todos/${this.todo._id}`, { tags: this.todo.tags });
          this.showNotification('Tâche mise à jour.', 'bg-green-100 text-green-700');
        } catch (error) {
          console.error(error);
          this.showNotification('Erreur lors de la mise à jour de la tâche.', 'bg-red-100 text-red-700');
        }
      },
    },
  };
</script>
