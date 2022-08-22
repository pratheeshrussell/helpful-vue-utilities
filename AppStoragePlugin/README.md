# AppStoragePlugin

This plugin stores and manages a persistent object (key-value pair) that allows users to store and retrieve values across components. Uses local storage.  

## How to
### Register the plugin
In main.js file import it

```import AppStoragePlugin from './plugins/appStorage.plugin'```

Before mounting the app

```
app.use(AppStoragePlugin);
app.mount('#app')
```

You can also pass in the following optional parameters
```
app.use(AppStoragePlugin,{salt:'S3cRetVa!ue', persistent = true});
```
By default `persistent` is set to true but it can be changed based on requirement.

### Use the methods exposed by the plugin

#### To add a value to storage
In the component.vue file where you want to add a value use the `this.$AppStorage.put` method. This method returns a `true` or `false` value.

```
this.$AppStorage.put('welcome','Hi World');
this.$AppStorage.put('user', {name:'pratheesh',age:30});
```

**Note:** Don't pass in class instances. Just pass in simple objects(key-value pairs)/strings/numbers/boolean.

#### To get a value from storage
In the component.vue file where you want to get a value use the `this.$AppStorage.get` method. Will return the value if exist or else returns `undefined`.

```
let msg = this.$AppStorage.get('welcome');
```

#### To get all values from storage
In the component.vue file where you want to get the values use the `this.$AppStorage.getAll` method.

```
let msg = this.$AppStorage.getAll();
```

#### To delete value from storage
In the component.vue file where you want to delete a value use the `this.$AppStorage.delete` method. This method returns a `true` or `false` value.

```
if(this.$AppStorage.delete('welcome')){
    console.log('deleted')
}
```

#### To clear the storage
In the component.vue file where you want to clear all values use the `this.$AppStorage.clear` method. This method returns a `true` or `false` value.

```
if(this.$AppStorage.clear()){
    console.log('cleared')
}
```
