// Refs:
// https://vuejs.org/guide/reusability/plugins.html
// https://stackoverflow.com/a/66938952
// 

export default {
  install: (app,options={salt:'f1!o@eL^MA2Eh7S'}) => {
    let storage = {};
    let safeKey = 'vueAppStorage';

    const crypt = (salt, text) => {
      const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
      const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
      const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    
      return text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
    };
    
    const decrypt = (salt, encoded) => {
      const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
      const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
      return encoded
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("");
    };

    let storeInLocalStorage = ()=>{
      //store in local storage
      localStorage.setItem(safeKey, crypt(options.salt, window.btoa(JSON.stringify(storage))));
    };
    let clearLocalStorage = ()=>{
      localStorage.removeItem(safeKey);
    };
    let fetchAllItemsFromLocalStorage = ()=>{
      let itm = localStorage.getItem(safeKey);  
      if(itm)   
      storage = JSON.parse(window.atob(decrypt(options.salt, itm)));
    }
    let checkIfClass = (value)=>{
      // check that it is not a class instance
      return value.constructor.prototype != Object.prototype;
    };

    fetchAllItemsFromLocalStorage();//fetch at start

    // register handlers that can be called from code
    app.config.globalProperties.$AppStorage = {
      // Register Put Handler
      put(key, value) {
        try {
          if(typeof value ==='object' && checkIfClass(value)){
            throw 'Can\'t save class instance'
          }
          storage[key] = value;
          storeInLocalStorage();
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
          storeInLocalStorage();
          return true;
        } catch (e) {
          return false;
        }
      },
      // Register clear Handler
      clear() {
        try {
          storage = {};
          clearLocalStorage();
          return true;
        } catch (e) {
          return false;
        }
      },
    };
  },
};
