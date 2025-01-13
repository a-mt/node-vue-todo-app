export default {
  methods: {
    showNotification(msg) {
      this.$toast.show(msg);
    },
    showError(msg) {
      this.$toast.error(msg);
    },
    showSuccess(msg) {
      this.$toast.success(msg);
    },
  },
};
