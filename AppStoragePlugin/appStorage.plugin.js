// Refs:
// https://vuejs.org/guide/reusability/plugins.html
// https://stackoverflow.com/a/66938952
//

export default {
  install: (app, { salt = "f1!o@eL^MA2Eh7S", persistent = true } = {}) => {
    let storage = {};
    let safeKey = "vueAppStorage";
    console.log(salt, persistent);
    const crypt = (salt, text) => {
      try {
        const textToChars = (text) =>
          text.split("").map((c) => c.charCodeAt(0));
        const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
        const applySaltToChar = (code) =>
          textToChars(salt).reduce((a, b) => a ^ b, code);

        return text
          .split("")
          .map(textToChars)
          .map(applySaltToChar)
          .map(byteHex)
          .join("");
      } catch (e) {
        clearLocalStorage();
      }
    };

    const decrypt = (salt, encoded) => {
      try {
        const textToChars = (text) =>
          text.split("").map((c) => c.charCodeAt(0));
        const applySaltToChar = (code) =>
          textToChars(salt).reduce((a, b) => a ^ b, code);
        return encoded
          .match(/.{1,2}/g)
          .map((hex) => parseInt(hex, 16))
          .map(applySaltToChar)
          .map((charCode) => String.fromCharCode(charCode))
          .join("");
      } catch (e) {
        clearLocalStorage();
      }
    };

    let storeInLocalStorage = () => {
      //store in local storage
      localStorage.setItem(
        safeKey,
        crypt(salt, window.btoa(JSON.stringify(storage)))
      );
    };
    let clearLocalStorage = () => {
      localStorage.removeItem(safeKey);
    };
    let fetchAllItemsFromLocalStorage = () => {
      try {
        let itm = localStorage.getItem(safeKey);
        if (itm) storage = JSON.parse(window.atob(decrypt(salt, itm)));
      } catch (e) {
        storage = {};
        clearLocalStorage();
      }
    };
    let checkIfClass = (value) => {
      // check that it is not a class instance
      return value.constructor.prototype != Object.prototype;
    };

    if (persistent) {
      fetchAllItemsFromLocalStorage(); //fetch at start
    } else {
      clearLocalStorage();
    }

    // register handlers that can be called from code
    app.config.globalProperties.$AppStorage = {
      // Register Put Handler
      put(key, value) {
        try {
          if (typeof value === "object" && checkIfClass(value)) {
            throw "Can't save class instance";
          }
          storage[key] = value;
          if (persistent) {
            storeInLocalStorage();
          }
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
          if (persistent) {
            storeInLocalStorage();
          }
          return true;
        } catch (e) {
          return false;
        }
      },
      // Register clear Handler
      clear() {
        try {
          storage = {};
          if (persistent) {
            clearLocalStorage();
          }
          return true;
        } catch (e) {
          return false;
        }
      },
    };
  },
};
