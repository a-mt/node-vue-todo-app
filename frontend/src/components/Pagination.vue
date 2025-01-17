<template>
  <nav class="pagination flex rounded-md" aria-label="Pagination">
    <!-- Previous -->
    <button
      v-if="page != 1"
      href="#"
      class="pagination__item pagination__item--inactive rounded-s-lg border-e-0"
      @click="gotoPage(page - 1)"
    >
      <span class="sr-only">Précédent</span>
      <svg
        class="size-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        data-slot="icon"
      >
        <path
          fill-rule="evenodd"
          d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- First -->
    <button
      v-if="page > 2"
      aria-current="page"
      class="pagination__item pagination__item--inactive border-e-0"
      @click="gotoPage(1)"
    >
      1
    </button>

    <!-- Dots -->
    <span
      v-if="page > 3"
      class="pagination__item pagination__item--disabled border-e-0"
      >...</span
    >

    <!-- Numbers -->
    <button
      v-for="i in pageList"
      :key="i"
      class="pagination__item"
      :class="[
        i == page
          ? 'pagination__item--active'
          : 'pagination__item--inactive',
        i == 1 && page == 1 ? 'rounded-s-lg' : '',
        i == pageCount && page == pageCount ? 'rounded-e-lg' : 'border-e-0',
      ]"
      @click="gotoPage(i)"
    >
      {{ i }}
    </button>

    <!-- Dots -->
    <span
      v-if="page + 2 < pageCount"
      class="pagination__item pagination__item--disabled border-e-0"
      >...</span
    >

    <!-- Last -->
    <button
      v-if="page + 1 < pageCount"
      class="pagination__item pagination__item--inactive border-e-0"
      @click="gotoPage(pageCount)"
    >
      {{ pageCount }}
    </button>

    <!-- Next -->
    <button
      v-if="pageCount > 1 && page != pageCount"
      class="pagination__item pagination__item--inactive rounded-e-lg"
      @click="gotoPage(page + 1)"
    >
      <span class="sr-only">Suivant</span>
      <svg
        class="size-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        data-slot="icon"
      >
        <path
          fill-rule="evenodd"
          d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </nav>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    page: {
      type: Number,
      required: true,
    },
    pageCount: {
      type: Number,
      required: true,
    },
    gotoPage: {
      type: Function,
      required: true,
    },
  },
  computed: {
    pageList() {
      let res = [];
      let i = Math.max(1, this.page - 1);

      for (i; i <= Math.min(this.page + 1, this.pageCount); i++) {
        res.push(i);
      }
      return res;
    },
  },
};
</script>

<style>
.pagination__item {
  @apply flex items-center justify-center px-3 h-8 leading-tight border;
}
.pagination__item--active {
  @apply text-blue-600 bg-blue-50 border-blue-300;
}
.pagination__item--inactive {
  @apply text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700;
}
.pagination__item--disabled {
  @apply text-gray-700 bg-white border-gray-300;
}
</style>