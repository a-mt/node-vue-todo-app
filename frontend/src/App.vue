<template>
    <div id="app">
      <h1>Todo App</h1>
      <TodoList />
    </div>
  </template>
  
  <script>
  import TodoList from './components/TodoList.vue';
  
  export default {
    name: 'App',
    components: {
      TodoList
    }
  };
  </script>
  
  <style>
  body {
    font-family: Arial, sans-serif;
    text-align: center;
  }
  </style>  