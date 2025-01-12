<template>
  <form @submit.prevent="addTag" class="flex mb-4">
    <input
      v-model="newTag"
      type="text"
      placeholder="Ajouter un tag"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
    <button
      type="submit"
      class="text-grey-500 hover:text-grey-700 focus:outline-none ml-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 256 256" stroke="currentColor">
        <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"/>
      </svg>
    </button>
  </form>
  {{ this.todo && this.todo.title }}

  <ul>
    <transition-group>
      <li
        v-for="tag in this.tags"
        class="flex items-center p-2 shadow-sm"
        :key="tag._id"
      >
        <div class="h-4 w-4 mr-2 rounded-full dark:ring-1 dark:ring-inset dark:ring-white/10"
              :style="{'background-color': tag.color}"></div>

        <button class="flex w-full" @click="toggleTag(tag)">
          <span>
            {{ tag.title }}
          </span>
          <span v-if="todo.tags.filter(item => item._id == tag._id).length > 0" class="ml-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" class="h-4 w-4 text-blue-600">
              <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 7l3 3 7-7"/>
            </svg>
          </span>
        </button>
      </li>
    </transition-group>
  </ul>
</template>

<script>
import axios from 'axios';
import NotificationMixin from '../mixins/NotificationMixin.js';

const DEFAULT_COLOR = 'grey';

export default {
  name: 'TagSelect',
  mixins: [
    NotificationMixin,
  ],
  props: {
    todo: Object,
    toggleTag: Function,
  },
  data() {
    return {
      tags: [],
      selectedTags: {},
      newTag: '',
      newTagColor: DEFAULT_COLOR,
    };
  },
  inject: ['getTags'],
  methods: {
    async addTag() {
      if (this.newTag.trim() === '') return;
      try {
        const response = await axios.post('/api/tags', {
          title: this.newTag,
          color: this.newTagColor,
        });

        const tag = response.data;
        this.tags.push(tag);
        this.showNotification('Tag ajoutée avec succès.', 'bg-green-100 text-green-700');

        this.newTag = '';
        this.newTagColor = DEFAULT_COLOR;
        this.toggleTag(tag);

      } catch (error) {
        console.error(error);
        this.showNotification('Erreur lors de l\'ajout du tag.', 'bg-red-100 text-red-700');
      }
    },
  },
  mounted() {
    this.tags = this.getTags();
  }
};
</script>