<template>
  <form class="flex items-center mb-4" @submit.prevent="addTag">
    <!-- Input -->
    <input
      v-model="newTag"
      type="text"
      placeholder="Ajouter un tag"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    />

    <!-- Color picker -->
    <div class="ml-2">
      <ColorPicker v-model="newTagColor" />
    </div>

    <!-- Submit -->
    <button type="submit" class="text-grey-500 hover:text-grey-700 ml-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        viewBox="0 0 256 256"
        stroke="currentColor"
      >
        <path
          d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"
        />
      </svg>
    </button>
  </form>

  <ul class="max-h-60 overflow-auto">
    <transition-group>
      <li
        v-for="tag in tags"
        :key="tag._id"
        class="row flex items-center justify-between p-1 shadow-sm"
      >
        <button class="flex w-full" @click="addOrRemoveTag(tag)">
          <span
            class="text-xs font-medium px-2.5 py-0.5 rounded-full"
            :style="{
              'background-color': tag.color,
              color: tag.isLightColor ? 'black' : 'white',
            }"
          >
            {{ tag.title }}
          </span>

          <!-- Is selected -->
          <span
            v-if="todo.tags.filter((item) => item._id == tag._id).length > 0"
            class="ml-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12 12"
              class="h-4 w-4 text-gray-400"
            >
              <path
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 7l3 3 7-7"
              />
            </svg>
          </span>
        </button>

        <!-- Delete -->
        <button
          class="opacity-0 focus:opacity-100 hover:opacity-100 mr-2 text-red-500 hover:text-red-700"
          @click="deleteTag(tag._id)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
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
      </li>
    </transition-group>
  </ul>
</template>

<script>
import axios from 'axios';
import NotificationMixin from '../mixins/NotificationMixin.js';
import ColorPicker from './ColorPicker.vue';
import { ref } from 'vue';

const DEFAULT_COLOR = 'rgb(91, 74, 233)';

export default {
  name: 'TagSelect',
  components: {
    ColorPicker,
  },
  mixins: [NotificationMixin],
  inject: ['getTagsRef'],
  props: {
    todo: {
      type: Object,
      required: true,
    },
    addOrRemoveTag: {
      type: Function,
      required: true,
    },
  },
  emits: ['deletedTag'],
  data() {
    return {
      tags: [],
      newTag: '',
      newTagColor: ref(DEFAULT_COLOR),
    };
  },
  created() {
    this.tags = this.getTagsRef();
  },
  methods: {
    async addTag() {
      if (this.newTag.trim() === '') return;
      try {
        const response = await axios.post('/api/tags', {
          title: this.newTag,
          color: this.newTagColor,
        });
        // Add inplace to the tags list
        const tag = response.data;
        this.tags.push(tag);

        // Reset the form
        this.newTag = '';
        this.newTagColor = DEFAULT_COLOR;

        // Add to the current todo
        this.addOrRemoveTag(tag);
        this.showSuccess('Tag ajouté avec succès.');

      } catch (error) {
        console.error(error);
        this.showError("Erreur lors de l'ajout du tag.");
      }
    },
    async deleteTag(id) {
      try {
        await axios.delete(`/api/tags/${id}`);

        // Remove inplace from the tags list
        const idx = this.tags.findIndex((item) => item._id == id);
        this.tags.splice(idx, 1);

        // Reload all todos once the selector is closed
        this.$emit('deletedTag', id);
        this.showSuccess('Tag supprimé.');

      } catch (error) {
        console.error(error);
        this.showError('Erreur lors de la suppression de la tâche.');
      }
    },
  },
};
</script>

<style scoped>
.row:hover .opacity-0 {
  opacity: 1;
}
</style>
