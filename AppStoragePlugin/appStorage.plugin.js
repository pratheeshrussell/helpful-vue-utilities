export default {
  install: (app) => {
    let storage = {};
    app.config.globalProperties.$AppStorage = {
      // Register Put Handler
      put(key, value) {
        try {
          storage[key] = value;
          return true;
        } catch (e) {
          return false;
        }
      },
      // Register Get Handler
      get(key) {
        return storage[key];
      },
      // Register GetAll Handler
      getAll() {
        return storage;
      },
      // Reister delete Handler
      delete(key) {
        try {
          delete storage[key];
          return true;
        } catch (e) {
          return false;
        }
      },
      // Register clear Handler
      clear() {
        try {
          storage = {};
          return true;
        } catch (e) {
          return false;
        }
      },
    };
  },
};
