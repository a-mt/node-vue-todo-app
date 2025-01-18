<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center">
      <!-- Drag handle -->
      <span
        class="handle cursor-move mr-2"
        :class="hideReorder ? 'hidden' : ''"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 8h16M4 16h16"
          />
        </svg>
      </span>

      <!-- Checkbox -->
      <input
        v-model="todo.completed"
        type="checkbox"
        class="form-checkbox h-5 w-5 shrink-0 text-blue-600"
        @change="updateTodo()"
      />

      <!-- Title -->
      <div class="flex flex-col self-baseline">
        <span
          :class="{
            'line-through text-gray-500': todo.completed,
            'text-gray-900': !todo.completed,
          }"
          class="ml-2"
        >
          {{ todo.title }}
          <small class="text-xs text-gray-500 block">
            {{ new Date(todo.createdAt).toLocaleDateString() }}
          </small>
        </span>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center">

      <!-- Set priority -->
      <button
        class="mr-3 w-5 h-5 text-gray-500 hover:text-gray-700 bg-gray-200 rounded text-sm text-center mr-2"
        @click="showPriorityDialog = true"
      >
        {{ todo.priority }}
      </button>

      <!-- Associate priority -->
      <div v-if="showPriorityDialog" class="relative self-end">
        <div
          class="fixed inset-0 bg-black/[.06]"
          @click="showPriorityDialog = false"
        >
          <div class="bg-black opacity-50"></div>
        </div>
        <div
          class="flex flex-col items-start py-1 px-2 space-y-1 text-sm bg-white rounded shadow-lg absolute z-50 right-0 mr-2"
          @click.stop=""
        >
          <button
            v-for="{ value, title } in priorities"
            :key="value"
            class="whitespace-nowrap text-sm px-1 h-5 rounded text-center text-gray-500 hover:text-gray-700"
            :class="{ 'bg-gray-200': value == todo.priority }"
            @click="setPriority(value)"
          >
            {{ value }} - {{ title }}
          </button>
        </div>
      </div>

      <!-- Set tags -->
      <button class="mr-2" @click="showTagsDialog = true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400"
          fill="none"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            d="M3 8v4.172a2 2 0 0 0 .586 1.414l5.71 5.71a2.41 2.41 0 0 0 3.408 0l3.592 -3.592a2.41 2.41 0 0 0 0 -3.408l-5.71 -5.71a2 2 0 0 0 -1.414 -.586h-4.172a2 2 0 0 0 -2 2z"
          ></path>
          <path
            d="M18 19l1.592 -1.592a4.82 4.82 0 0 0 0 -6.816l-4.592 -4.592"
          ></path>
          <path d="M7 10h-.01"></path>
        </svg>
      </button>

      <!-- Edit -->
      <button class="mr-2" @click="openEditDialog">
         <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <path d="M 23.90625 3.96875 C 22.859286 3.96875 21.813178 4.3743215 21 5.1875 L
                  5.40625 20.78125 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L
                  5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 11.21875 26.59375 L 26.8125 11 C
                  28.438857 9.373643 28.438857 6.813857 26.8125 5.1875 C 25.999322 4.3743215 24.953214
                  3.96875 23.90625 3.96875 z M 23.90625 5.875 C 24.409286 5.875 24.919428 6.1069285
                  25.40625 6.59375 C 26.379893 7.567393 26.379893 8.620107 25.40625 9.59375 L 24.6875
                  10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.893072 6.1069285 23.403214 5.875
                  23.90625 5.875 z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.533142
                  22.500659 9.4993415 21.466858 8.21875 20.8125 L 20.3125 8.71875 z M 6.9375 22.4375 C
                  8.1365842 22.923393 9.0766067 23.863416 9.5625 25.0625 L 6.28125 25.71875 L 6.9375
                  22.4375 z" fill="currentColor" />
          </svg>
      </button>

      <!-- Delete -->
      <button
        class="text-red-500 hover:text-red-700"
        @click="deleteTodo(todo._id)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>

  <!-- Associate tags Dialog -->
  <div v-if="showTagsDialog" class="relative">
    <div class="fixed inset-0 bg-black/[.06]" @click="closeTagDialog()">
      <div class="bg-black opacity-50"></div>
    </div>
    <div
      class="w-max w-max-md bg-white p-6 rounded shadow-lg absolute z-50 right-0"
      @click.stop=""
    >
      <div class="-mt-4 mb-2 text-right">
        <button class="text-xs text-gray-500" @click="closeTagDialog()">
          Fermer
        </button>
      </div>
      <TagSelect
        :todo="todo"
        :addOrRemoveTag="addOrRemoveTag"
        @deletedTag="deletedTag"
        @updatedTag="updatedTag"
      />
    </div>
  </div>
  
  <!-- Edit Dialog -->
  <div v-if="showEditDialog" class="relative">
    <div class="fixed inset-0 bg-black/[.06]" @click="closeEditDialog()">
      <div class="bg-black opacity-50"></div>
    </div>
    <div
      class="w-max w-max-md bg-white p-6 rounded shadow-lg absolute z-50 right-0"
      @click.stop=""
    >
      <div class="-mt-4 mb-2 text-right">
        <button class="text-xs text-gray-500" @click="closeEditDialog()">
          Fermer
        </button>
      </div>

      <form class="flex mb-4" @submit.prevent="closeEditDialog(true)">
        <input
          v-model="todoTitle"
          type="text"
          class="grow w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Éditer
        </button>
      </form>

    </div>
  </div>

  <!-- List of tags -->
  <ul v-if="todo.tags.length" class="flex flex-wrap ml-4 pl-10 mt-1">
    <li v-for="tag in todo.tags" :key="tag._id">
      <span
        class="text-xs font-medium me-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800"
        :style="{
          backgroundColor: tag.color,
          color: tag.isLightColor ? 'black' : 'white',
        }"
      >
        {{ tag.title }}
      </span>
    </li>
  </ul>

</template>

<script>
import axios from 'axios';
import TagSelect from './TagSelect.vue';
import NotificationMixin from '../mixins/NotificationMixin.js';

export default {
  name: 'Todo',
  components: {
    TagSelect,
  },
  mixins: [NotificationMixin],
  inject: ['refreshTodos'],
  props: {
    todo: {
      type: Object,
      required: true,
    },
    deleteTodo: {
      type: Function,
      required: true,
    },
    hideReorder: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['deletedTag'],
  data() {
    return {
      todoTitle: '',
      showTagsDialog: false,
      showPriorityDialog: false,
      shouldRefreshTodos: false,
      showEditDialog: false,
      priorities: [
        { value: 3, title: 'Haute priorité' },
        { value: 2, title: 'Moyenne priorité' },
        { value: 1, title: 'Basse priorité' },
      ],
    };
  },
  methods: {
    deletedTag(id) {
      this.shouldRefreshTodos = true;
      this.$emit('deletedTag', id);
    },
    updatedTag(id) {
      this.shouldRefreshTodos = true;
    },
    closeTagDialog() {
      this.showTagsDialog = false;
      this.shouldRefreshTodos && this.refreshTodos();
    },
    openEditDialog() {
      this.showEditDialog = true;
      this.todoTitle = this.todo.title;
    },
    closeEditDialog(submit=false) {
      this.showEditDialog = false;

      if (submit && this.todoTitle != this.todo.title) {
        this.todo.title = this.todoTitle;
        this.updateTodo();
      }
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
          title: this.todo.title,
        });
        this.showSuccess('Tâche mise à jour.');
      } catch (error) {
        console.error(error);
        this.showError('Erreur lors de la mise à jour de la tâche.');
      }
    },
    async addOrRemoveTag(tag) {
      const tags = this.todo.tags;
      const idx = tags.findIndex((item) => item._id == tag._id);

      try {
        const method = idx == -1 ? 'post' : 'delete';

        await axios({
          method,
          url: `/api/todos/${this.todo._id}/tags`,
          data: { tags: [tag._id] },
        });
        if (idx != -1) {
          tags.splice(idx, 1);
        } else {
          tags.push(tag);
        }
        this.showSuccess('Tâche mise à jour.');
      } catch (error) {
        console.error(error);
        this.showError('Erreur lors de la mise à jour de la tâche.');
      }
    },
  },
};
</script>
