<template>
  <button
    type="button"
    class="h-6 w-6 text-xs rounded-full shrink-0" :class="class"
    @click="showColorPicker = true"
    :style="{'backgroundColor': value}"
  >
  </button>

  <div v-if="showColorPicker" class="relative">
    <div class="fixed inset-0 bg-black/[.06]" @click="showColorPicker = false">
      <div class="bg-black opacity-50"></div>
    </div>
    <div class="mt-6 absolute z-50" style="left: -270px" @click.stop="">
      <!-- see https://github.com/cyhnkckali/vue3-color-picker -->
      <Vue3ColorPicker
        v-model="value"
        mode="solid"
        :showEyeDrop="false"
        :showAlpha="false"
        :showInputMenu="false"
        :showPickerMode="false"
        :showColorList="false"
        theme="light"
        type="RGB"
      />
    </div>
  </div>
</template>

<script>
  import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker';
  import { ref, watch } from 'vue';

  export default {
    components: {
      Vue3ColorPicker,
    },
    props: {
      class: {
        type: String,
        default: '',
      },
      modelValue: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        showColorPicker: false,
        value: ref(this.modelValue),
      }
    },
    watch: {
      value(newColor) {
        this.$emit('update:modelValue', newColor);
      },
    }
  }
</script>

<style>
  .cp-picker-wrap, .picker-hue {
    height: 70px !important;
  }
</style>