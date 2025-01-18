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

        <!-- Edit -->
        <button class="opacity-0 focus:opacity-100 hover:opacity-100 mr-2" @click="openEditDialog(tag)">
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

  <!-- Edit -->
  <div v-if="showEditDialog" class="relative">
    <div class="fixed inset-0 bg-black/[.06]" @click="closeEditDialog()">
      <div class="bg-black opacity-50"></div>
    </div>
    <div
      class="bg-white p-6 rounded shadow-lg absolute z-50 right-0"
      @click.stop=""
    >
      <div class="-mt-4 mb-2 text-right">
        <button class="text-xs text-gray-500" @click="closeEditDialog()">
          Fermer
        </button>
      </div>

      <form class="flex mb-4" @submit.prevent="closeEditDialog(true)">
        <input
          v-model="tagTitle"
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
  emits: ['deletedTag', 'updatedTag'],
  data() {
    return {
      tags: [],
      newTag: '',
      newTagColor: ref(DEFAULT_COLOR),
      tag: null,
      tagTitle: '',
      showEditDialog: false,
    };
  },
  created() {
    this.tags = this.getTagsRef();
  },
  methods: {
    openEditDialog(tag) {
      this.tag = tag;
      this.tagTitle = tag.title;
      this.showEditDialog = true;
    },
    closeEditDialog(submit=false) {
      this.showEditDialog = false;

      if (submit && this.tagTitle != this.tag.title) {
        this.tag.title = this.tagTitle;
        this.updateTag();
      }
    },
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
    async updateTag() {
      try {
        await axios.patch(`/api/tags/${this.tag._id}`, {
          title: this.tag.title,
        });
        this.showSuccess('Tag mis à jour.');
        this.$emit('updatedTag', this.tag._id);
      } catch (error) {
        console.error(error);
        this.showError('Erreur lors de la mise à jour du tag.');
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
