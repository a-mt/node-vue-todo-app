export default {
  data() {
    return {
      notification: '',
      notificationClass: '',
    };
  },
  methods: {
    showNotification(message, className) {
      this.notification = message;
      this.notificationClass = className;
      setTimeout(() => {
        this.notification = '';
      }, 3000);
    },
    showError(msg) {
      this.showNotification(msg, 'bg-red-100 text-red-700');
    },
    showSuccess(msg) {
      this.showNotification(msg, 'bg-green-100 text-green-700');
    },
  },
};
