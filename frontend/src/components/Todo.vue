<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center">

      <!-- Drag handle -->
      <span class="handle cursor-move mr-2" :class="hideReorder ? 'hidden' : ''">
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
        @change="updateTodo()"
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
    <div class="flex items-center">

      <!-- Set priority -->
      <button
        @click="showPriorityDialog = true"
        class="w-5 h-5 text-gray-500 hover:text-gray-700 bg-gray-200 rounded text-sm text-center mr-2"
      >
        {{ todo.priority }}
      </button>

      <!-- Associate priority -->
      <div v-if="showPriorityDialog" class="relative self-end">
        <div class="fixed inset-0 bg-black/[.06]" @click="showPriorityDialog = false">
          <div class="bg-black opacity-50"></div>
        </div>
        <div class="flex flex-col items-start py-1 px-2 space-y-1 text-sm bg-white rounded shadow-lg absolute z-50 right-0" @click.stop="">
          <button
            v-for="({value, title}) in priorities"
            class="flex whitespace-nowrap text-sm px-1 h-5 rounded text-center text-gray-500 hover:bg-gray-200"
            :class="{'bg-gray-200': value == todo.priority}"
            @click="setPriority(value)"
          >
            {{ value }}: {{ title }}
          </button>
        </div>
      </div>

      <!-- Set tags -->
      <button
        @click="showTagsDialog = true"
        class="mr-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 8v4.172a2 2 0 0 0 .586 1.414l5.71 5.71a2.41 2.41 0 0 0 3.408 0l3.592 -3.592a2.41 2.41 0 0 0 0 -3.408l-5.71 -5.71a2 2 0 0 0 -1.414 -.586h-4.172a2 2 0 0 0 -2 2z"></path>
          <path d="M18 19l1.592 -1.592a4.82 4.82 0 0 0 0 -6.816l-4.592 -4.592"></path>
          <path d="M7 10h-.01"></path>
        </svg>
      </button>

      <!-- Delete -->
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

  <!-- List of tags -->
  <ul v-if="this.todo.tags.length" class="flex flex-wrap ml-4 pl-10 mt-1">
    <li v-for="tag in this.todo.tags">
        <span class="text-xs font-medium me-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800"
              :style="{'backgroundColor': tag.color, 'color': tag.isLightColor ? 'black': 'white'}">
            {{ tag.title }}
        </span>
    </li>
  </ul>

  <!-- Associate tags -->
  <div v-if="showTagsDialog" class="relative">
    <div class="fixed inset-0 bg-black/[.06]" @click="closeTagDialog()">
      <div class="bg-black opacity-50"></div>
    </div>
    <div class="bg-white p-6 rounded shadow-lg absolute z-50 right-0" @click.stop="">
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
      hideReorder: Boolean,
    },
    inject: ['refreshTodos'],
    emits: ['deletedTag'],
    data() {
      return {
        showTagsDialog: false,
        showPriorityDialog: false,
        shouldRefreshTodos: false,
        priorities: [
          {value: 3, title: 'Haute priorité'},
          {value: 2, title: 'Moyenne priorité'},
          {value: 1, title: 'Basse priorité'},
        ],
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
      setPriority(priority) {
        this.showPriorityDialog = false;
        if (priority == this.todo.priority) {
          return;
        }
        this.todo.priority = priority;
        this.updateTodo();
      },
      async updateTodo() {
        try {
          await axios.patch(`/api/todos/${this.todo._id}`, {
            completed: this.todo.completed,
            priority: this.todo.priority,
          });
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
