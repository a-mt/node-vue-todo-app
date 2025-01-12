
export default {
  data() {
    return {
      notification: '',
      notificationClass: ''
    };
  },
  methods: {
    showNotification(message, className) {
      this.notification = message;
      this.notificationClass = className;
      setTimeout(() => {
        this.notification = '';
      }, 3000);
    }
  },
};