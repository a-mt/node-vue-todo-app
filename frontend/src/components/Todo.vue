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
        class="text-grey-500 hover:text-grey-700 mr-2"
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
        class="text-red-500 hover:text-red-700"
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
        <span class="text-xs font-medium me-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800"
              :style="{'backgroundColor': tag.color, 'color': tag.isLightColor ? 'black': 'white'}">
            {{ tag.title }}
        </span>
    </li>
  </ul>

  <div v-if="showTagsDialog" class="relative">
    <div class="fixed inset-0 bg-black/[.06]" @click="closeTagDialog()">
      <div class="bg-black opacity-50"></div>
    </div>
    <div class="bg-white p-6 rounded shadow-lg absolute z-50" @click.stop="">
      <div class="-mt-4 mb-2 text-right">
        <button class="text-xs text-gray-500" @click="closeTagDialog()">
          Fermer
        </button>
      </div>
      <TagSelect :todo="todo" :addOrRemoveTag="addOrRemoveTag" @deletedTag="deletedTag" />
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
    inject: ['refreshTodos'],
    emits: ['deletedTag'],
    data() {
      return {
        showTagsDialog: false,
        shouldRefreshTodos: false,
      }
    },
    methods: {
      deletedTag(id) {
        this.shouldRefreshTodos = true;
        this.$emit('deletedTag', id);
      },
      closeTagDialog() {
        this.showTagsDialog = false;
        this.shouldRefreshTodos && this.refreshTodos();
      },
      async updateTodo(todo) {
        try {
          await axios.patch(`/api/todos/${todo._id}`, { completed: todo.completed });
          this.showSuccess('Tâche mise à jour.');
        } catch (error) {
          console.error(error);
          this.showError('Erreur lors de la mise à jour de la tâche.');
        }
      },
      async addOrRemoveTag(tag) {
        const tags = this.todo.tags;
        const idx = tags.findIndex(item => item._id == tag._id);

        if (idx != -1) {
          tags.splice(idx, 1);
        } else {
          tags.push(tag);
        }
        try {
          await axios.patch(`/api/todos/${this.todo._id}`, { tags: tags });
          this.showSuccess('Tâche mise à jour.');
        } catch (error) {
          console.error(error);
          this.showError('Erreur lors de la mise à jour de la tâche.');
        }
      },
    },
  };
</script>
